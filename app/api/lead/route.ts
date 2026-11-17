import { allow, clientIp } from "@/lib/audit/rate-limit";
import { emailLead, parseLead } from "@/lib/leads";

/** Receives every website form and emails it to the team. */
export async function POST(req: Request) {
  if (!allow(`lead:${clientIp(req)}`, 10)) {
    return Response.json({ error: "Too many requests today. Please message us on WhatsApp instead." }, { status: 429 });
  }
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  // Honeypot: real people never fill this hidden field.
  if (typeof body.website === "string" && body.website) return Response.json({ ok: true });

  const lead = parseLead(body);
  if (typeof lead === "string") return Response.json({ error: lead }, { status: 400 });

  try {
    await emailLead(lead);
    return Response.json({ ok: true });
  } catch (e) {
    console.error("lead email failed", e);
    return Response.json({ error: "We could not send your request. Please message us on WhatsApp instead." }, { status: 502 });
  }
}
