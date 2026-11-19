import type { Report } from "@/lib/audit/types";
import { sendEmailJs } from "@/lib/leads";
import { site } from "@/lib/site";
import { resendEnabled, sendResend } from "@/lib/resend";

/**
 * Emails the customer their report: with Resend when set up (no template needed), otherwise a second
 * EmailJS template (EMAILJS_REPORT_TEMPLATE_ID) whose "To Email" is {{to_email}}.
 * EmailJS template variables: to_email, business, score, link, summary, subject.
 */
export const reportEmailEnabled = () =>
  resendEnabled() || Boolean(process.env.EMAILJS_REPORT_TEMPLATE_ID && process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_PUBLIC_KEY);

export { validEmail as cleanEmail } from "@/lib/phone";

export async function emailReportToCustomer(to: string, r: Report, link: string) {
  const fixes = r.tests
    .filter((t) => t.status === "FAIL")
    .slice(0, 5)
    .map((t) => `• ${t.name}: ${t.fix}`);
  const summary = [
    `Your score: ${r.score ?? "not enough data"} / 100`,
    "",
    "Score by area:",
    ...r.categories.map((c) => `• ${c.name}: ${c.score ?? "not measured"}`),
    "",
    fixes.length ? "Fix these first:" : "No failed checks. Well done!",
    ...fixes,
    "",
    link ? `Full report (open any time in the next 30 days): ${link}` : `Run the free check again any time: ${site.url}/check`,
    "",
    `Want help fixing it? Reply to this email or WhatsApp us: ${site.whatsapp}`,
  ].join("\n");

  const subject = `Your Visibility Score for ${r.business.name}: ${r.score ?? "?"}/100`;
  if (resendEnabled()) {
    await sendResend({ to, subject, text: `Hi,\n\nHere is your free NearbyVisible Visibility Score for ${r.business.name}.\n\n${summary}\n\nNearbyVisible\n${site.url}`, replyTo: site.email || undefined });
    return;
  }

  await sendEmailJs(process.env.EMAILJS_REPORT_TEMPLATE_ID!, {
    to_email: to,
    subject,
    business: r.business.name,
    score: String(r.score ?? "?"),
    link,
    summary,
  });
}
