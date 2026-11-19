import { DAILY_CAP, allow, clientIp } from "@/lib/audit/rate-limit";
import { runAudit } from "@/lib/audit/run";
import { checkPass } from "@/lib/turnstile";
import { after } from "next/server";
import { emailLead, formatMobile } from "@/lib/leads";
import { indianMobile } from "@/lib/phone";
import { type Share, canSaveReports, saveReport } from "@/lib/reports";
import { cleanEmail, emailReportToCustomer, reportEmailEnabled } from "@/lib/report-email";
import type { Report } from "@/lib/audit/types";

export const maxDuration = 60;

/** Step 2: run the full audit for the business the user picked. */
export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as Record<string, string | undefined>;
  // Only audits that started from a real search (which checked for a human) are allowed.
  if (!checkPass(b.pass)) {
    return Response.json({ error: "This check has expired. Please search for your business again." }, { status: 403 });
  }
  if (!(await allow(`audit:${clientIp(req)}`, 5)) || !(await allow(`audit-pass:${b.pass}`, 5))) {
    return Response.json({ error: "You have used today's free Visibility Scores. Message us on WhatsApp for a full review." }, { status: 429 });
  }
  const placeId = b.placeId?.trim();
  const name = b.name?.trim().slice(0, 120);
  const city = b.city?.trim().slice(0, 80);
  if (!placeId || !/^[\w\-:%.~+]{5,300}$/.test(placeId) || !name || !city) {
    return Response.json({ error: "Please pick your business from the list." }, { status: 400 });
  }
  const mobile = indianMobile(b.phone ?? "");
  const phone = formatMobile(b.phone ?? "");
  if (!mobile || !phone) return Response.json({ error: "Please add your 10-digit WhatsApp number." }, { status: 400 });
  const email = cleanEmail(b.email);
  if (b.email?.trim() && !email) return Response.json({ error: "Please check your email address, or leave it empty." }, { status: 400 });
  if (!(await allow("global:audit", DAILY_CAP.audits))) {
    return Response.json({ error: "The free check is very busy today. Please try again tomorrow or message us on WhatsApp." }, { status: 429 });
  }

  try {
    const report = await runAudit({
      placeId,
      name,
      city,
      // Category goes into AI prompts later, so keep it to plain words.
      category: b.category?.replace(/[^\p{L}\p{N} &,'/-]/gu, " ").replace(/\s+/g, " ").trim().slice(0, 60) || undefined,
      website: b.website?.trim().slice(0, 300) || undefined,
      competitor: b.competitor?.trim().slice(0, 120) || undefined,
    });
    // Save first (one quick Redis call), so the WhatsApp button and email link work the moment the report shows.
    let share: Share | null = null;
    if (canSaveReports()) {
      try {
        share = await saveReport({ report, city, category: b.category?.trim() ?? "" });
      } catch (e) {
        console.error("save report failed", e);
      }
    }
    const emailQueued = Boolean(email && reportEmailEnabled());

    // After the response is sent (the customer never waits): email the customer and the team.
    after(async () => {
      let emailStatus = email ? "not set up" : "not given";
      if (emailQueued) {
        try {
          await emailReportToCustomer(email, report, share?.link ?? "");
          emailStatus = "sent";
        } catch (e) {
          console.error("customer report email failed", e);
          emailStatus = "FAILED, please send it by hand";
        }
      }
      await emailLead(scoreLead(report, { phone, email, city, category: b.category, website: b.website, share, emailStatus })).catch((e) =>
        console.error("score email failed", e),
      );
    });
    return Response.json({ ...report, share, emailQueued });
  } catch (e) {
    console.error("check/audit failed", e);
    return Response.json({ error: "The check could not finish. Please try again." }, { status: 502 });
  }
}

/** Turns a finished report into a lead email: who checked, how they scored, and what to talk to them about. */
type LeadInfo = {
  phone: string;
  email: string;
  city: string;
  category?: string;
  website?: string;
  share: Share | null;
  emailStatus: string;
};

function scoreLead(r: Report, { phone, email, city, category, website, share, emailStatus }: LeadInfo) {
  const fails = r.tests.filter((t) => t.status === "FAIL").map((t) => `- ${t.name}`);
  const warns = r.tests.filter((t) => t.status === "WARNING").length;
  const areas = r.categories.map((c) => `- ${c.name}: ${c.score ?? "not measured"}`);
  const lines = [
    share ? `Report link: ${share.link}  (WhatsApp ref ${share.ref})` : "Report not saved (Redis not set up)",
    `Report emailed to customer: ${emailStatus}`,
    `Score: ${r.score ?? "not enough data"} / 100 (${Math.round(r.coverage * 100)}% measured)`,
    r.competitors?.rank ? `Google rank for "${r.competitors.query}": #${r.competitors.rank}` : r.competitors ? `Not in the top results for "${r.competitors.query}"` : "",
    r.business.rating ? `Google rating: ${r.business.rating} from ${r.business.reviews ?? 0} reviews` : "No Google rating yet",
    `Category: ${category?.trim() || r.business.typeLabel || "not given"}`,
    `Address: ${r.business.address}`,
    r.business.phone ? `Phone on Google: ${r.business.phone}` : "",
    `Website: ${website?.trim() || r.business.website || "none"}`,
    r.business.mapsUrl ? `Google Maps: ${r.business.mapsUrl}` : "",
    "",
    "Score by area:",
    ...areas,
    "",
    `Failed checks (${fails.length}), plus ${warns} warnings:`,
    ...(fails.length ? fails : ["- none"]),
  ].filter((l, i, all) => l !== "" || all[i - 1] !== "");
  return {
    source: "visibility-score" as const,
    name: r.business.name,
    phone,
    business: r.business.name,
    city,
    intent: `Score ${r.score ?? "?"}/100`,
    email: email || undefined,
    message: lines.join("\n").slice(0, 3000),
    page: "/check",
  };
}
