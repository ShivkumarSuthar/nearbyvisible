/** Server-only: validates a lead and emails it, with Resend when set up, otherwise EmailJS (REST APIs, no SDK needed). */

export type Lead = {
  /** "visibility-score" is created by the server after a free check, never accepted from a form. */
  source: "service-request" | "contact" | "plan-quote" | "whatsapp" | "visibility-score";
  name: string;
  phone: string;
  business?: string;
  city?: string;
  service?: string;
  plan?: string;
  intent?: string;
  message?: string;
  email?: string;
  page?: string;
};

import { indianMobile, validEmail } from "./phone";
import { resendEnabled, sendResend } from "./resend";

const clip = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export function parseLead(body: Record<string, unknown>): Lead | string {
  const source = body.source;
  if (source !== "service-request" && source !== "contact" && source !== "plan-quote" && source !== "whatsapp") return "Unknown form.";
  const name = clip(body.name, 80);
  const mobile = indianMobile(clip(body.phone, 30));
  if (!name) return "Please add your name.";
  if (!mobile) return "Please add a valid 10-digit mobile number.";
  const email = validEmail(body.email);
  if (clip(body.email, 200) && !email) return "Please check your email address, or leave it empty.";
  const phone = formatMobile(mobile);
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
    email: email || undefined,
    page: clip(body.page, 200) || undefined,
  };
}

const LABEL: Record<Lead["source"], string> = {
  "service-request": "Service request",
  contact: "Contact form",
  "plan-quote": "Plan quote",
  whatsapp: "WhatsApp enquiry",
  "visibility-score": "Visibility Score",
};

/** Formats a phone the same way as form leads: "+91 98765 43210". Returns "" if it is not an Indian mobile. */
export function formatMobile(raw: string) {
  const m = indianMobile(raw);
  return m ? `+91 ${m.slice(0, 5)} ${m.slice(5)}` : "";
}

export async function emailLead(lead: Lead) {
  const templateId = process.env.EMAILJS_TEMPLATE_ID ?? "";
  const rows: [string, string | undefined][] = [
    ["Name", lead.name],
    ["Phone", lead.phone],
    ["Business", lead.business],
    ["City", lead.city],
    ["Plan", lead.plan],
    ["Wants", lead.intent],
    ["Service", lead.service],
    ["Email", lead.email],
    ["Message", lead.message],
    ["Sent from page", lead.page],
  ];
  const filled = rows.filter((r): r is [string, string] => Boolean(r[1]));
  const text = filled.map(([k, v]) => `${k}: ${v}`).join("\n");
  const subject = `${LABEL[lead.source]}: ${lead.name}${lead.plan ? ` · ${lead.plan}` : lead.service ? ` · ${lead.service}` : lead.intent ? ` · ${lead.intent}` : ""}`;

  const to = process.env.LEAD_EMAIL_TO || "nearbyvisible@gmail.com";
  if (resendEnabled()) {
    // Replying to the email goes straight to the customer when they gave an address.
    await sendResend({ to, subject, text, replyTo: lead.email });
    return;
  }

  await sendEmailJs(templateId, {
    name: lead.name,
    phone: lead.phone,
    business: lead.business || "",
    city: lead.city || "",
    service: lead.service || "",
    plan: lead.plan || "",
    intent: lead.intent || "",
    message: lead.message || "",
    details: text,
    source: LABEL[lead.source],
    subject,
    page: lead.page || "",
    to_email: to,
  });
}

/** Sends one email through EmailJS with the given template. Throws if EmailJS is not set up or refuses. */
export async function sendEmailJs(templateId: string, params: Record<string, string>) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;
  if (!serviceId || !templateId || !publicKey) throw new Error("EmailJS is not configured");

  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      ...(privateKey ? { accessToken: privateKey } : {}),
      template_params: params,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`EmailJS error ${res.status}: ${err.slice(0, 200)}`);
  }
}
