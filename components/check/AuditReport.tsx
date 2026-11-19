"use client";

import type { Report, Status, TestResult } from "@/lib/audit/types";
import { CATEGORIES } from "@/lib/audit/types";
import { site, whatsappLink } from "@/lib/site";
import { AiVisibility } from "./AiVisibility";

const STATUS: Record<Status, { label: string; cls: string }> = {
  PASS: { label: "Pass", cls: "bg-brand-tint text-brand-dark" },
  WARNING: { label: "Warning", cls: "bg-amber-100 text-amber-800" },
  FAIL: { label: "Fail", cls: "bg-red-100 text-red-700" },
  NOT_TESTED: { label: "Not tested", cls: "bg-gray-100 text-gray-600" },
};

const tone = (n: number | null) => (n === null ? "text-gray-400" : n >= 75 ? "text-brand-dark" : n >= 50 ? "text-amber-600" : "text-red-600");
const bar = (n: number) => (n >= 75 ? "bg-brand" : n >= 50 ? "bg-amber-400" : "bg-red-500");

/** `shared` = opened later from a saved link: no live AI check, and "check another" goes to /check. */
export function AuditReport({
  report,
  city,
  category,
  onReset,
  shared = false,
  share,
  emailSent = false,
}: {
  report: Report;
  city: string;
  category: string;
  onReset?: () => void;
  shared?: boolean;
  /** Saved copy: the WhatsApp button sends its reference code so the bot can reply with the link. */
  share?: { ref: string; link: string } | null;
  emailSent?: boolean;
}) {
  const { score, coverage, business } = report;
  const counts = report.tests.reduce((m, t) => ({ ...m, [t.status]: (m[t.status] ?? 0) + 1 }), {} as Partial<Record<Status, number>>);
  // Biggest wins first: failed tests weighted by their category weight, then warnings.
  const priorities = report.tests
    .filter((t) => t.status === "FAIL" || t.status === "WARNING")
    .sort((a, b) => impact(b) - impact(a))
    .slice(0, 5);
  const msg = `Hi, I checked ${business.name} on NearbyVisible and got ${score ?? "no"} / 100. I want help fixing it.`;

  return (
    <div className="flex flex-col gap-10">
      {!shared && (
        <div className="flex flex-col items-start gap-4 rounded-[24px] border-2 border-brand/40 bg-brand-wash p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex flex-col gap-1">
            <p className="font-display text-lg font-semibold text-ink">Keep this report</p>
            <p className="text-[0.9375rem] text-gray-700">
              {emailSent ? "We are emailing it to you now. " : ""}
              Get the link on WhatsApp too: tap the button, then press Send.
            </p>
          </div>
          <a
            href={reportWhatsapp(report, share)}
            target="_blank"
            rel="noopener"
            data-direct
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-6 py-3.5 font-semibold text-ink transition-transform hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.4Z" />
            </svg>
            Get this report on WhatsApp
          </a>
        </div>
      )}
      {shared && (
        <p className="rounded-2xl bg-mist px-5 py-4 text-[0.9375rem] text-gray-700">
          Saved report from {new Date(report.auditedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}. Your
          Google profile may have changed since. <a href="/check" className="font-semibold text-brand-dark underline underline-offset-2">Run a fresh check</a>.
        </p>
      )}
      {/* Summary */}
      <section className="grid grid-cols-1 gap-6 rounded-[32px] bg-ink p-8 text-white md:grid-cols-[auto_1fr] md:gap-10 md:p-10">
        <ScoreRing score={score} />
        <div className="flex flex-col justify-center gap-3">
          <div className="inline-flex items-center gap-2 self-start rounded-full bg-brand/20 px-3 py-1 text-xs font-bold text-brand">
            <span className="size-1.5 rounded-full bg-brand animate-pulse" />
            Digital Visibility Score
          </div>
          <h2 className="font-display text-[clamp(1.625rem,3.4vw,2.375rem)] font-bold leading-tight">{business.name}</h2>
          <p className="text-muted-dark">{business.address}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            <Chip>{Math.round(coverage * 100)}% measured</Chip>
            <Chip>{report.confidence} confidence</Chip>
            <Chip>{counts.PASS ?? 0} passed</Chip>
            <Chip>{counts.WARNING ?? 0} warnings</Chip>
            <Chip>{counts.FAIL ?? 0} failed</Chip>
            {counts.NOT_TESTED ? <Chip>{counts.NOT_TESTED} not tested</Chip> : null}
          </div>
          <p className="text-sm text-muted-dark">Scanned via Google Places & Lighthouse · {new Date(report.auditedAt).toLocaleString()}</p>
          <a href="#all-checks" className="self-start text-sm font-semibold text-brand underline-offset-4 hover:underline">
            See all {report.tests.length} checks we ran ↓
          </a>
        </div>
      </section>

      {/* Categories */}
      <section className="flex flex-col gap-4">
        <h3 className="font-display text-2xl font-semibold">Score by area</h3>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {report.categories.map((c) => (
            <li key={c.id} className="flex flex-col gap-3 rounded-[20px] border border-gray-200 p-5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-semibold">{c.name}</span>
                <span className={`font-display text-xl font-bold ${tone(c.score)}`}>{c.score === null ? "—" : c.score}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                {c.score !== null && <div className={`h-full rounded-full ${bar(c.score)}`} style={{ width: `${Math.max(c.score, 3)}%` }} />}
              </div>
              <span className="text-xs text-gray-500">
                Weight {c.weight} · {c.tested} of {c.total} tests measured
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Action plan */}
      {priorities.length > 0 && (
        <section className="flex flex-col gap-4">
          <h3 className="font-display text-2xl font-semibold">Fix these first</h3>
          <ol className="flex flex-col gap-3">
            {priorities.map((t, i) => (
              <li key={t.id} className="flex gap-4 rounded-[20px] bg-mist p-5">
                <span className="flex size-8 flex-none items-center justify-center rounded-full bg-ink font-display text-sm font-bold text-white">{i + 1}</span>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">{t.name}</span>
                  <span className="text-[0.9375rem] text-gray-600">{t.fix}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Competitors & Head-to-Head Benchmark */}
      {report.competitors && (
        <section className="flex flex-col gap-6 rounded-[32px] border border-gray-200 bg-gradient-to-b from-white to-brand-wash/30 p-6 shadow-sm sm:p-10">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-brand-tint px-3 py-1 text-xs font-bold text-brand-dark">
              <span>⚔️ Head-to-Head Local Rank Benchmark</span>
            </div>
            <h3 className="font-display text-2xl font-bold sm:text-3xl">
              Who Customers Find When Searching for &ldquo;{report.competitors.query}&rdquo;
            </h3>
            <p className="text-base text-gray-600">
              {report.competitors.rank ? (
                <>
                  <strong className="text-ink">{business.name}</strong> appears at{" "}
                  <span className="font-semibold text-brand-dark">Position #{report.competitors.rank}</span> on Google Maps.
                </>
              ) : (
                <>
                  <strong className="text-ink">{business.name}</strong> is{" "}
                  <span className="font-semibold text-red-600">not in the top 20</span> results for this search in {city}.
                </>
              )}
            </p>
          </div>

          {/* Head-to-Head Comparison Card (you vs one competitor) */}
          {report.competitors.benchmark && (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
                {/* Your Business Card */}
                <div className="flex flex-col justify-between gap-4 rounded-[24px] border-2 border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-1.5">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600 self-start">
                      Your Business Profile
                    </span>
                    <h4 className="font-display text-xl font-bold text-ink sm:text-2xl">{business.name}</h4>
                    <span className="text-xs text-gray-500 line-clamp-1">{business.address}</span>
                  </div>

                  <div className="flex flex-col gap-2.5 border-t border-gray-100 pt-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Google Maps Rank:</span>
                      <span className="font-bold text-ink">
                        {report.competitors.rank ? `#${report.competitors.rank}` : "20+ (Not Ranking)"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Star Rating:</span>
                      <span className="font-bold text-ink">
                        {business.rating ? `★ ${business.rating.toFixed(1)}` : "No rating"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Reviews Volume:</span>
                      <span className="font-bold text-ink">{business.reviews ?? 0} reviews</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Photos (sample):</span>
                      <span className="font-bold text-ink">{business.photos ?? 0}{(business.photos ?? 0) >= 10 ? "+" : ""} photos</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Connected Website:</span>
                      <span className="font-bold text-ink">{business.website ? "Connected" : "Missing"}</span>
                    </div>
                  </div>
                </div>

                {/* VS Badge */}
                <div className="flex items-center justify-center">
                  <div className="flex size-14 items-center justify-center rounded-full bg-ink font-display text-lg font-bold text-brand shadow-md">
                    VS
                  </div>
                </div>

                {/* Benchmark Competitor Card */}
                {(() => {
                  const comp = report.competitors.benchmark.competitor;
                  return (
                    <div className="flex flex-col justify-between gap-4 rounded-[24px] border-2 border-brand/50 bg-white p-6 shadow-sm">
                      <div className="flex flex-col gap-1.5">
                        <span className="rounded-full bg-brand-tint px-3 py-1 text-xs font-bold text-brand-dark self-start">
                          {report.competitors.benchmark.chosen ? "Competitor you named" : "Top competitor in this search"}
                        </span>
                        <h4 className="font-display text-xl font-bold text-ink sm:text-2xl">{comp.name}</h4>
                        <span className="text-xs text-gray-500 line-clamp-1">{comp.address}</span>
                      </div>

                      <div className="flex flex-col gap-2.5 border-t border-gray-100 pt-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Google Maps Rank:</span>
                          <span className="font-bold text-brand-dark">{comp.rank ? `#${comp.rank}` : "Not in this search"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Star Rating:</span>
                          <span className="font-bold text-ink">
                            {comp.rating ? `★ ${comp.rating.toFixed(1)}` : "No rating"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Reviews Volume:</span>
                          <span className="font-bold text-ink">{comp.reviews ?? 0} reviews</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Photos (sample):</span>
                          <span className="font-bold text-ink">{comp.photosCount ?? 0}{(comp.photosCount ?? 0) >= 10 ? "+" : ""} photos</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Connected Website:</span>
                          <span className="font-bold text-ink">{comp.website ? "Connected" : "Missing"}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* The Gap Breakdown */}
              <div className="rounded-[24px] border border-brand/20 bg-brand-wash/60 p-6">
                <h4 className="text-base font-bold text-ink mb-3">How you compare:</h4>
                <ul className="flex flex-col gap-2.5">
                  {report.competitors.benchmark.keyGaps.map((gap, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <span className="flex-none font-bold text-brand-dark">▸</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Top 3 Competitors Leaderboard */}
          <div className="flex flex-col gap-3 pt-2">
            <h4 className="font-display text-lg font-semibold text-ink">Top competitors in this search in {city}</h4>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {report.competitors.top.map((p, i) => (
                <li key={p.id} className="flex flex-col justify-between gap-2 rounded-[20px] border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-brand-dark">Position #{p.rank ?? i + 1} in this search</span>
                    <span className="font-semibold text-ink line-clamp-1">{p.name}</span>
                    <span className="text-xs text-gray-500 line-clamp-2">{p.address}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-xs">
                    <span className="font-semibold text-ink">
                      {p.rating !== undefined ? `★ ${p.rating} · ${p.reviews ?? 0} reviews` : "No rating"}
                    </span>
                    {p.mapsUrl && (
                      <a href={p.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-brand-dark hover:underline">
                        View Profile ↗
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* AI visibility (loads on its own, after the main report) */}
      {!shared && <AiVisibility input={report.ai.input} token={report.ai.token} />}

      {/* All tests */}
      <section id="all-checks" className="flex scroll-mt-24 flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-display text-2xl font-semibold">Every check, with evidence</h3>
          <p className="text-[0.9375rem] text-gray-600">All {report.tests.length} checks we ran, grouped by area. Areas with a failed check are open.</p>
        </div>
        {(Object.keys(CATEGORIES) as (keyof typeof CATEGORIES)[]).map((cat) => {
          const tests = report.tests.filter((t) => t.category === cat);
          if (!tests.length) return null;
          const n = (st: Status) => tests.filter((t) => t.status === st).length;
          return (
            <details key={cat} className="group rounded-[20px] border border-gray-200" open={n("FAIL") > 0}>
              <summary className="flex list-none flex-wrap items-center justify-between gap-3 p-5">
                <span className="font-semibold">
                  {CATEGORIES[cat].name} <span className="font-normal text-gray-500">· {tests.length} checks</span>
                </span>
                <span className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
                  {(["PASS", "WARNING", "FAIL", "NOT_TESTED"] as Status[]).map((st) =>
                    n(st) ? (
                      <span key={st} className={`rounded-full px-2.5 py-1 ${STATUS[st].cls}`}>
                        {n(st)} {STATUS[st].label.toLowerCase()}
                      </span>
                    ) : null,
                  )}
                  <span className="ml-1 text-base text-gray-400 transition-transform group-open:rotate-180" aria-hidden="true">
                    ⌄
                  </span>
                </span>
              </summary>
              <ul className="flex flex-col divide-y divide-gray-100 border-t border-gray-100">
                {tests.map((t) => (
                  <TestRow key={t.id} t={t} />
                ))}
              </ul>
            </details>
          );
        })}
      </section>

      {/* Honesty */}
      <section className="flex flex-col gap-2 rounded-[20px] bg-mist p-6 text-sm text-gray-600">
        <p className="font-semibold text-gray-800">How to read this report</p>
        <p>Pass, warning and fail are measured facts from public sources. &ldquo;Not tested&rdquo; means the data was not available, and it does not lower the score. The measured share shows how much of the full audit actually ran.</p>
        <ul className="list-disc pl-5">
          {report.limitations.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center gap-5 rounded-[32px] border-2 border-brand/30 bg-brand-wash px-6 py-12 text-center shadow-lg">
        <span className="rounded-full bg-brand px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ink">
          Next Step: Get Found & Beat Competitors
        </span>
        <h3 className="font-display text-[clamp(1.625rem,3.4vw,2.375rem)] font-bold">
          Want us to fix these issues for your business?
        </h3>
        <p className="max-w-[35rem] text-base text-gray-700 sm:text-lg">
          Send this report to us on WhatsApp. We will explain your failed checks and create a customized action plan to outrank local competitors.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={whatsappLink(msg)}
            className="flex items-center gap-2 rounded-full bg-brand px-8 py-4 font-semibold text-ink shadow-[0_8px_20px_-6px_rgba(34,197,94,0.6)] transition-transform hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.4Z" />
            </svg>
            Send on WhatsApp for Fix Plan
          </a>
          <button
            onClick={() => window.print()}
            className="rounded-full border border-[#111111] bg-white px-7 py-4 font-semibold text-ink hover:bg-[#111111] hover:text-white"
          >
            Save as PDF
          </button>
          {onReset ? (
            <button onClick={onReset} className="rounded-full px-6 py-4 font-semibold text-brand-dark hover:underline">
              Check another business
            </button>
          ) : (
            <a href="/check" className="rounded-full px-6 py-4 font-semibold text-brand-dark hover:underline">
              Check another business
            </a>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-semibold text-gray-600">
          <span>✓ Free 15-Min Consultation</span>
          <span>✓ Honest Itemized Quote</span>
          <span>✓ Zero Sales Pressure</span>
        </div>
      </section>
    </div>
  );
}

function impact(t: TestResult) {
  return t.weight * CATEGORIES[t.category].weight * (t.status === "FAIL" ? 2 : 1);
}

function TestRow({ t }: { t: TestResult }) {
  const s = STATUS[t.status];
  return (
    <li className="flex flex-col gap-2 p-5 sm:flex-row sm:items-start sm:gap-5">
      <span className={`self-start whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${s.cls}`}>{s.label}</span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="font-semibold">{t.name}</span>
        <span className="text-[0.9375rem] text-gray-700">{t.actual}</span>
        {t.evidence && <span className="whitespace-pre-line break-words text-sm text-gray-500">{t.evidence}</span>}
        {(t.status === "FAIL" || t.status === "WARNING") && <span className="text-sm text-brand-dark">Fix: {t.fix}</span>}
        <span className="text-xs text-gray-400">
          {t.id} · {t.source}
        </span>
      </div>
    </li>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-line-dark bg-ink-soft px-3 py-1 capitalize">{children}</span>;
}

function ScoreRing({ score }: { score: number | null }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const v = score ?? 0;
  const color = v >= 75 ? "var(--color-brand)" : v >= 50 ? "#fbbf24" : "#ef4444";
  return (
    <div className="relative mx-auto size-44">
      <svg viewBox="0 0 128 128" className="size-full -rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" stroke="var(--color-line-dark)" strokeWidth="12" />
        <circle cx="64" cy="64" r={r} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - v / 100)} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-5xl font-bold">{score ?? "—"}</span>
        <span className="text-sm text-muted-dark">out of 100</span>
      </div>
    </div>
  );
}

/** WhatsApp link for the "Get this report" button. With a saved copy the message carries its reference code. */
function reportWhatsapp(r: Report, share?: { ref: string; link: string } | null) {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_REPORT_NUMBER || site.whatsapp).replace(/\D/g, "");
  const text = share
    ? `Hi, please send my Visibility Score report. Ref: ${share.ref}`
    : `Hi, I checked ${r.business.name} on NearbyVisible and got ${r.score ?? "no"}/100. Please send me the report.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
