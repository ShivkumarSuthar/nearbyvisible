import { createHmac, timingSafeEqual } from "node:crypto";
import { site } from "@/lib/site";

/**
 * WhatsApp report bot (Meta WhatsApp Cloud API), the free way:
 * the customer taps "Get this report on WhatsApp", their WhatsApp opens with "… Ref: NV-XXXXXX" typed,
 * they press Send, and /api/whatsapp replies with the report link. Replies to a message the customer
 * sent are free within 24 hours, so no paid template is needed.
 *
 * Env: WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_APP_SECRET, WHATSAPP_VERIFY_TOKEN,
 * and NEXT_PUBLIC_WHATSAPP_REPORT_NUMBER (the bot's number, e.g. 919876543210).
 */
const GRAPH = "https://graph.facebook.com/v21.0";

export const whatsappBotEnabled = () =>
  Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_APP_SECRET);

/** Number the "Get this report on WhatsApp" button opens. Until the bot is set up, the normal business number. */
export function reportWhatsappNumber() {
  const bot = process.env.NEXT_PUBLIC_WHATSAPP_REPORT_NUMBER?.replace(/\D/g, "");
  return bot || site.whatsapp.replace(/\D/g, "");
}

/** Plain text message. Only allowed within 24 hours of the customer's last message. `to` is digits with country code. */
export async function sendWhatsappText(to: string, body: string) {
  const res = await fetch(`${GRAPH}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: { authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", to, type: "text", text: { body: body.slice(0, 4000), preview_url: true } }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: { message?: string; code?: number } };
    throw new Error(`WhatsApp ${res.status}: ${err.error?.code ?? ""} ${err.error?.message ?? ""}`.trim());
  }
}

/** Meta signs every webhook call with the app secret; anything unsigned or altered is rejected. */
export function validSignature(rawBody: string, header: string | null) {
  const secret = process.env.WHATSAPP_APP_SECRET;
  if (!secret || !header?.startsWith("sha256=")) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest();
  const given = Buffer.from(header.slice(7), "hex");
  return given.length === expected.length && timingSafeEqual(given, expected);
}
