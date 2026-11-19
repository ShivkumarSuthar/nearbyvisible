import { after } from "next/server";
import { emailLead, formatMobile } from "@/lib/leads";
import { findByRef } from "@/lib/reports";
import { sendWhatsappText, validSignature, whatsappBotEnabled } from "@/lib/whatsapp";
import { site } from "@/lib/site";
import { allow } from "@/lib/audit/rate-limit";

/**
 * Meta WhatsApp Cloud API webhook.
 * GET: Meta checks the URL once during setup (hub.verify_token must match WHATSAPP_VERIFY_TOKEN).
 * POST: incoming messages. "Ref: NV-XXXXXX" gets the report link back; anything else is emailed to the team,
 * because a Cloud API number cannot be read in the normal WhatsApp app.
 */
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const expected = process.env.WHATSAPP_VERIFY_TOKEN;
  if (expected && q.get("hub.mode") === "subscribe" && q.get("hub.verify_token") === expected) {
    return new Response(q.get("hub.challenge") ?? "", { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

type Incoming = { from: string; id: string; type: string; text?: { body?: string } };
type Payload = {
  entry?: { changes?: { value?: { messages?: Incoming[]; contacts?: { wa_id?: string; profile?: { name?: string } }[] } }[] }[];
};

const REF = /\bNV-([2-9A-HJ-NP-Z]{6})\b/i;

export async function POST(req: Request) {
  const raw = await req.text();
  if (!whatsappBotEnabled() || !validSignature(raw, req.headers.get("x-hub-signature-256"))) {
    return new Response("Forbidden", { status: 403 });
  }
  let payload: Payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  // Answer Meta at once (it retries slow webhooks); do the work afterwards.
  after(async () => {
    for (const entry of payload.entry ?? [])
      for (const change of entry.changes ?? []) {
        const names = new Map((change.value?.contacts ?? []).map((c) => [c.wa_id, c.profile?.name ?? ""]));
        for (const m of change.value?.messages ?? []) await handle(m, names.get(m.from) ?? "").catch((e) => console.error("whatsapp handle failed", e));
      }
  });
  return new Response("OK", { status: 200 });
}

/** A failed reply must not stop the team email, so the lead is never lost. */
async function reply(to: string, body: string) {
  try {
    await sendWhatsappText(to, body);
    return "sent";
  } catch (e) {
    console.error("whatsapp reply failed", e);
    return "FAILED, please reply by hand";
  }
}

async function handle(m: Incoming, profileName: string) {
  const text = m.type === "text" ? (m.text?.body ?? "").slice(0, 1000) : `[${m.type} message]`;
  const local = m.from.startsWith("91") ? m.from.slice(2) : m.from;
  const phone = formatMobile(local) || `+${m.from}`;
  const ref = text.match(REF)?.[0].toUpperCase();
  const found = ref ? await findByRef(ref) : null;

  if (found) {
    const r = found.saved.report;
    const sent = await reply(
      m.from,
      [
        `Hi${profileName ? ` ${profileName}` : ""}! Here is your free Visibility Score for *${r.business.name}*: *${r.score ?? "?"}/100*`,
        "",
        `Full report (open any time in the next 30 days):`,
        found.link,
        "",
        "Want help fixing it? Just reply here and our team will call you.",
      ].join("\n"),
    );
    await emailLead({
      source: "visibility-score",
      name: r.business.name,
      phone,
      business: r.business.name,
      city: found.saved.city,
      intent: "Asked for report on WhatsApp (number verified)",
      message: `${profileName ? `WhatsApp name: ${profileName}\n` : ""}Score ${r.score ?? "?"}/100\nReport: ${found.link}\nLink sent on WhatsApp: ${sent}`,
      page: "WhatsApp",
    });
    return;
  }

  // Not a report request (or an unknown code): reply politely (once a day, so a chat is not flooded) and pass it to the team.
  if (ref || (await allow(`wa-ack:${m.from}`, 1))) await reply(
    m.from,
    ref
      ? `Sorry, we could not find report ${ref}. It may have expired. Run a fresh free check here: ${site.url}/check`
      : "Thanks for your message! Our team will reply soon.",
  );
  await emailLead({
    source: "whatsapp",
    name: profileName || "WhatsApp user",
    phone,
    intent: "Message to the WhatsApp report number",
    message: text,
    page: "WhatsApp",
  });
}
