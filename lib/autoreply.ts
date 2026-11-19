import type { Lead } from "@/lib/leads";
import { resendEnabled, sendResend } from "@/lib/resend";
import { site } from "@/lib/site";

/**
 * "We got your message" email to the customer, for leads that include an email address.
 * Needs Resend (EmailJS's free plan has no template left for it). Off without Resend.
 */
export const autoreplyEnabled = resendEnabled;

const WHAT: Record<Lead["source"], (l: Lead) => string> = {
  contact: () => "your message",
  "service-request": (l) => (l.service && l.service !== "Not sure yet" ? `your request for ${l.service}` : "your request"),
  "plan-quote": (l) => `your ${l.intent === "Get started" ? "request to get started with" : "quote request for"} ${l.plan ?? "a plan"}`,
  whatsapp: () => "your message",
  "visibility-score": () => "your Visibility Score request",
};

export async function sendAutoreply(lead: Lead) {
  if (!lead.email || !autoreplyEnabled()) return;
  const first = lead.name.split(/\s+/)[0];
  const text = [
    `Hi ${first},`,
    "",
    `Thank you for contacting ${site.name}. We have received ${WHAT[lead.source](lead)}${lead.business ? ` for ${lead.business}` : ""}.`,
    "",
    `We will call or WhatsApp you on ${lead.phone} within one working day.`,
    "",
    `While you wait, see how your business shows up on Google with our free Visibility Score: ${site.url}/check`,
    "",
    `Need us sooner? WhatsApp us: ${site.whatsapp}`,
    "",
    `Team ${site.name}`,
    site.url,
  ].join("\n");
  await sendResend({ to: lead.email, subject: `We got your request – ${site.name}`, text, replyTo: site.email || undefined });
}
