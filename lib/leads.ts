/** Server-only: validates a lead and emails it with EmailJS (REST API, no SDK needed). */

export type Lead = {
  source: "service-request" | "contact" | "plan-quote" | "whatsapp";
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
  if (source !== "service-request" && source !== "contact" && source !== "plan-quote" && source !== "whatsapp") return "Unknown form.";
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
  whatsapp: "WhatsApp enquiry",
};

export async function emailLead(lead: Lead) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error(
      "EmailJS is not configured. Please set EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, and EMAILJS_PUBLIC_KEY in .env.local"
    );
  }

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
  const text = filled.map(([k, v]) => `${k}: ${v}`).join("\n");
  const subject = `${LABEL[lead.source]}: ${lead.name}${lead.plan ? ` · ${lead.plan}` : lead.service ? ` · ${lead.service}` : ""}`;

  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    ...(privateKey ? { accessToken: privateKey } : {}),
    template_params: {
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
      to_email: process.env.LEAD_EMAIL_TO || "nearbyvisible@gmail.com",
    },
  };

  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`EmailJS error ${res.status}: ${err.slice(0, 200)}`);
  }
}
