/** Server-only: validates a lead and emails it with Resend (REST API, no SDK needed). */

export type Lead = {
  source: "service-request" | "contact" | "plan-quote";
  name: string;
  phone: string;
  business?: string;
  city?: string;
  service?: string;
  plan?: string;
  intent?: string;
  message?: string;
  page?: string;
};

const clip = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export function parseLead(body: Record<string, unknown>): Lead | string {
  const source = body.source;
  if (source !== "service-request" && source !== "contact" && source !== "plan-quote") return "Unknown form.";
  const name = clip(body.name, 80);
  const phone = clip(body.phone, 20);
  if (!name) return "Please add your name.";
  if (phone.replace(/\D/g, "").length < 10) return "Please add a valid 10-digit phone number.";
  return {
    source,
    name,
    phone,
    business: clip(body.business, 120) || undefined,
    city: clip(body.city, 80) || undefined,
    service: clip(body.service, 80) || undefined,
    plan: clip(body.plan, 60) || undefined,
    intent: clip(body.intent, 60) || undefined,
    message: clip(body.message, 1500) || undefined,
    page: clip(body.page, 200) || undefined,
  };
}

const LABEL: Record<Lead["source"], string> = {
  "service-request": "Service request",
  contact: "Contact form",
  "plan-quote": "Plan quote",
};

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function emailLead(lead: Lead) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  const to = process.env.LEAD_EMAIL_TO || "nearbyvisible@gmail.com";
  const from = process.env.LEAD_EMAIL_FROM || "NearbyVisible Website <onboarding@resend.dev>";

  const rows: [string, string | undefined][] = [
    ["Name", lead.name],
    ["Phone", lead.phone],
    ["Business", lead.business],
    ["City", lead.city],
    ["Plan", lead.plan],
    ["Wants", lead.intent],
    ["Service", lead.service],
    ["Message", lead.message],
    ["Sent from page", lead.page],
  ];
  const filled = rows.filter((r): r is [string, string] => Boolean(r[1]));
  const digits = lead.phone.replace(/\D/g, "").slice(-10);
  const subject = `${LABEL[lead.source]}: ${lead.name}${lead.plan ? ` · ${lead.plan}` : lead.service ? ` · ${lead.service}` : ""}`;

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:560px;color:#111">
    <h2 style="margin:0 0 4px">${esc(LABEL[lead.source])}</h2>
    <p style="margin:0 0 20px;color:#666">New lead from the NearbyVisible website</p>
    <table style="border-collapse:collapse;width:100%">
      ${filled
        .map(([k, v]) => `<tr><td style="padding:8px 12px 8px 0;color:#666;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:8px 0;white-space:pre-wrap">${esc(v)}</td></tr>`)
        .join("")}
    </table>
    <p style="margin:24px 0 0">
      <a href="tel:+91${digits}" style="background:#111;color:#fff;padding:10px 16px;border-radius:999px;text-decoration:none;margin-right:8px">Call</a>
      <a href="https://wa.me/91${digits}" style="background:#22c55e;color:#0b0f0c;padding:10px 16px;border-radius:999px;text-decoration:none">WhatsApp</a>
    </p>
  </div>`;
  const text = filled.map(([k, v]) => `${k}: ${v}`).join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, html, text }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Resend error ${res.status}: ${(await res.text()).slice(0, 200)}`);
}
