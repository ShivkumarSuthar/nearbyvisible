import { searchPlaces } from "@/lib/audit/google";
import { errorMessage } from "@/lib/audit/http";
import { allow, clientIp } from "@/lib/audit/rate-limit";

/** Step 1: find matching businesses so the user can pick the right one. */
export async function POST(req: Request) {
  if (!allow(`search:${clientIp(req)}`, 30)) {
    return Response.json({ error: "Too many searches today. Please try again tomorrow or message us on WhatsApp." }, { status: 429 });
  }
  const body = (await req.json().catch(() => ({}))) as { name?: string; city?: string };
  const name = body.name?.trim().slice(0, 120);
  const city = body.city?.trim().slice(0, 80);
  if (!name || !city) return Response.json({ error: "Please enter the business name and city." }, { status: 400 });

  try {
    return Response.json({ results: await searchPlaces(`${name} ${city}`, 5) });
  } catch (e) {
    console.error("check/search failed", e);
    return Response.json({ error: "Search is not available right now.", detail: errorMessage(e) }, { status: 502 });
  }
}
