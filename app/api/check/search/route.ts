import { searchPlaces } from "@/lib/audit/google";
import { DAILY_CAP, allow, clientIp } from "@/lib/audit/rate-limit";
import { TURNSTILE_FIELD, issuePass, verifyHuman } from "@/lib/turnstile";

/** Step 1: find matching businesses so the user can pick the right one. Also hands out the pass the audit needs. */
export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!(await allow(`search:${ip}`, 30))) {
    return Response.json({ error: "Too many searches today. Please try again tomorrow or message us on WhatsApp." }, { status: 429 });
  }
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const name = str(body.name, 120);
  const city = str(body.city, 80);
  if (!name || !city) return Response.json({ error: "Please enter the business name and city." }, { status: 400 });

  if (!(await verifyHuman(body[TURNSTILE_FIELD], ip))) {
    return Response.json({ error: "We could not confirm you are not a robot. Please wait a moment and try again." }, { status: 403 });
  }
  if (!(await allow("global:search", DAILY_CAP.searches))) {
    return Response.json({ error: "The free check is very busy today. Please try again tomorrow or message us on WhatsApp." }, { status: 429 });
  }

  try {
    return Response.json({ results: await searchPlaces(`${name} ${city}`, 5), pass: issuePass() });
  } catch (e) {
    console.error("check/search failed", e);
    return Response.json({ error: "Search is not available right now." }, { status: 502 });
  }
}
