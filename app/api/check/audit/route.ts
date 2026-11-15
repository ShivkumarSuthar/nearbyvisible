import { errorMessage } from "@/lib/audit/http";
import { allow, clientIp } from "@/lib/audit/rate-limit";
import { runAudit } from "@/lib/audit/run";

export const maxDuration = 60;

/** Step 2: run the full audit for the business the user picked. */
export async function POST(req: Request) {
  if (!allow(`audit:${clientIp(req)}`, 5)) {
    return Response.json({ error: "You have used today's free Visibility Scores. Message us on WhatsApp for a full review." }, { status: 429 });
  }
  const b = (await req.json().catch(() => ({}))) as Record<string, string | undefined>;
  const placeId = b.placeId?.trim();
  const name = b.name?.trim().slice(0, 120);
  const city = b.city?.trim().slice(0, 80);
  if (!placeId || !/^[\w-]{10,300}$/.test(placeId) || !name || !city) {
    return Response.json({ error: "Please pick your business from the list." }, { status: 400 });
  }

  try {
    const report = await runAudit({
      placeId,
      name,
      city,
      category: b.category?.trim().slice(0, 80) || undefined,
      website: b.website?.trim().slice(0, 300) || undefined,
    });
    return Response.json(report);
  } catch (e) {
    console.error("check/audit failed", e);
    return Response.json({ error: "The check could not finish. Please try again.", detail: errorMessage(e) }, { status: 502 });
  }
}
