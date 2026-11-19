/**
 * Resend (resend.com): sends email from your own domain. Used instead of EmailJS when
 * RESEND_API_KEY and EMAIL_FROM are set, e.g. EMAIL_FROM="NearbyVisible <report@yourdomain.in>".
 * The domain in EMAIL_FROM must be verified in Resend (DNS records), or Resend refuses to send.
 */
export const resendEnabled = () => Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Plain text in, simple readable HTML out: line breaks kept, links clickable. */
export function textToHtml(text: string) {
  const body = esc(text)
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" style="color:#15803d">$1</a>')
    .replace(/\n/g, "<br>");
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#111">${body}</div>`;
}

export async function sendResend(msg: { to: string; subject: string; text: string; replyTo?: string }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: [msg.to],
      subject: msg.subject.replace(/[\r\n]+/g, " ").slice(0, 200),
      text: msg.text,
      html: textToHtml(msg.text),
      ...(msg.replyTo ? { reply_to: msg.replyTo } : {}),
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`Resend error ${res.status}: ${err.slice(0, 200)}`);
  }
}
