import { DAILY_CAP, allow, clientIp } from "@/lib/audit/rate-limit";
import { emailLead, parseLead } from "@/lib/leads";
import { HONEYPOT } from "@/lib/phone";
import { TURNSTILE_FIELD, verifyHuman } from "@/lib/turnstile";
import { sendAutoreply } from "@/lib/autoreply";
import { after } from "next/server";

const BUSY = "We could not take your request right now. Please message us on WhatsApp instead.";

/** Receives every website form and emails it to the team. */
export async function POST(req: Request) {
  const ip = clientIp(req);
  // Mobile networks put many people behind one IP, so the per-IP limit is generous; the per-phone limit stops inbox flooding.
  if (!(await allow(`lead:${ip}`, 40))) {
    return Response.json({ error: "Too many requests today. Please message us on WhatsApp instead." }, { status: 429 });
  }
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  // Honeypot: real people never fill this hidden field.
  if (typeof body[HONEYPOT] === "string" && body[HONEYPOT]) return Response.json({ ok: true });

  if (!(await verifyHuman(body[TURNSTILE_FIELD], ip))) {
    return Response.json({ error: "Please wait a moment and send again. If it keeps failing, message us on WhatsApp." }, { status: 403 });
  }

  const lead = parseLead(body);
  if (typeof lead === "string") return Response.json({ error: lead }, { status: 400 });
  if (!(await allow(`lead-phone:${lead.phone}`, 6))) {
    return Response.json({ error: "We already have your request. We will reply soon, or message us on WhatsApp." }, { status: 429 });
  }
  if (!(await allow("global:leads", DAILY_CAP.leads))) return Response.json({ error: BUSY }, { status: 429 });

  try {
    await emailLead(lead);
    // The customer's "we got it" email goes after the response; if it fails, the lead is already safe with us.
    after(() => sendAutoreply(lead).catch((e) => console.error("autoreply failed", e)));
    return Response.json({ ok: true });
  } catch (e) {
    console.error("lead email failed", e);
    return Response.json({ error: "We could not send your request. Please message us on WhatsApp instead." }, { status: 502 });
  }
}
