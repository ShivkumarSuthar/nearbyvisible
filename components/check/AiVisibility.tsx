"use client";

import { useEffect, useState } from "react";
import type { AiInput, AiReport, AnswerResult, BotResult, Suggestion } from "@/lib/ai/types";

type State = { kind: "loading" } | { kind: "error"; message: string } | { kind: "done"; report: AiReport };

const PRIORITY: Record<Suggestion["priority"], string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-gray-100 text-gray-600",
};

const PURPOSE: Record<BotResult["purpose"], string> = { search: "AI search", user: "User link", training: "AI training" };

export function AiVisibility({ input }: { input: AiInput }) {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/check/ai", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(input), signal: ctrl.signal })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error ?? "The AI check could not finish.");
        setState({ kind: "done", report: data as AiReport });
      })
      .catch((e: Error) => {
        if (e.name !== "AbortError") setState({ kind: "error", message: e.message });
      });
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input.name, input.city, input.category, input.website]);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-brand-dark">New · AI visibility</p>
        <h3 className="font-display text-2xl font-semibold">Does AI recommend {input.name}?</h3>
        <p className="text-gray-600">
          More customers now ask ChatGPT, Gemini and Google&rsquo;s AI Mode &ldquo;who is the best {input.category} in {input.city}?&rdquo;. We asked an AI the same questions and checked whether AI tools can read your website.
        </p>
      </div>

      {state.kind === "loading" && (
        <div className="flex items-center gap-3 rounded-[20px] bg-mist p-6 text-gray-700" aria-live="polite">
          <span className="size-3 animate-pulse rounded-full bg-brand" />
          Asking AI about {input.category} in {input.city}… this takes about 20 seconds.
        </div>
      )}
      {state.kind === "error" && <p className="rounded-[20px] bg-mist p-6 text-gray-700">{state.message}</p>}
      {state.kind === "done" && <Body report={state.report} input={input} />}
    </section>
  );
}

function Body({ report, input }: { report: AiReport; input: AiInput }) {
  const { summary, crawlers } = report;
  const searchBots = crawlers.state === "ok" ? crawlers.bots.filter((b) => b.purpose !== "training") : [];
  const readable = searchBots.filter((b) => b.allowed && !b.firewall?.blocked).length;

  return (
    <div className="flex flex-col gap-8">
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile
          label="Recommended by AI"
          value={report.answers.ok ? `${summary.discoveryMentioned} of ${summary.discoveryTotal}` : "—"}
          good={summary.discoveryMentioned > 0}
          note="customer questions"
        />
        <Tile label="Best AI position" value={summary.bestPosition ? `#${summary.bestPosition}` : "—"} good={summary.bestPosition !== null && summary.bestPosition <= 3} note="in the shortlist" />
        <Tile label="AI knows you by name" value={summary.brandKnown === null ? "—" : summary.brandKnown ? "Yes" : "No"} good={summary.brandKnown === true} note="when asked directly" />
        <Tile
          label="AI search can read site"
          value={crawlers.state === "ok" ? `${readable} of ${searchBots.length}` : crawlers.state === "none" ? "No site" : "—"}
          good={crawlers.state === "ok" && readable === searchBots.length}
          note="search crawlers"
        />
      </ul>

      {!report.answers.ok && <p className="rounded-[20px] bg-mist p-5 text-gray-700">AI answers: {report.answers.error}</p>}

      {report.answers.ok && (
        <div className="flex flex-col gap-3">
          <h4 className="font-display text-xl font-semibold">What AI answered</h4>
          {report.answers.items.map((a) => (
            <AnswerCard key={a.prompt} a={a} />
          ))}
        </div>
      )}

      {(report.competitors.length > 0 || report.sources.length > 0) && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {report.competitors.length > 0 && (
            <div className="flex flex-col gap-3 rounded-[20px] border border-gray-200 p-5">
              <h4 className="font-semibold">Who AI recommends instead</h4>
              <ol className="flex flex-col gap-2">
                {report.competitors.map((c) => (
                  <li key={c.name} className="flex items-baseline justify-between gap-3 text-[15px]">
                    <span>{c.name}</span>
                    <span className="whitespace-nowrap text-sm text-gray-500">
                      #{c.bestPosition}
                      {c.count > 1 ? ` · ${c.count}×` : ""}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
          {report.sources.length > 0 && (
            <div className="flex flex-col gap-3 rounded-[20px] border border-gray-200 p-5">
              <h4 className="font-semibold">Websites AI used as proof</h4>
              <ul className="flex flex-col gap-2">
                {report.sources.map((s) => (
                  <li key={s.domain} className="flex items-baseline justify-between gap-3 text-[15px]">
                    <span className={s.own ? "font-semibold text-brand-dark" : ""}>
                      {s.domain}
                      {s.own ? " (your site)" : ""}
                    </span>
                    <span className="text-sm text-gray-500">{s.count}×</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {crawlers.state === "ok" && (
        <details className="group rounded-[20px] border border-gray-200">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 font-semibold">
            AI crawler access ({crawlers.robotsFound ? "robots.txt found" : "no robots.txt, all allowed"})
            <span className="text-gray-400 transition-transform group-open:rotate-180">⌄</span>
          </summary>
          <ul className="flex flex-col divide-y divide-gray-100 border-t border-gray-100">
            {crawlers.bots.map((b) => (
              <BotRow key={b.token} b={b} />
            ))}
          </ul>
          <p className="border-t border-gray-100 p-5 text-xs text-gray-500">
            Firewall test: we loaded your home page while identifying as the bot. Real bots come from their own servers, so a firewall can treat them differently. Blocking training bots is a business choice; blocking AI search bots stops AI from recommending you.
          </p>
        </details>
      )}
      {crawlers.state === "error" && <p className="text-sm text-gray-500">Crawler check could not run: {crawlers.error}</p>}

      <LlmsBox llms={report.llms} name={input.name} />

      {report.suggestions.length > 0 && (
        <div className="flex flex-col gap-3">
          <h4 className="font-display text-xl font-semibold">What to do next</h4>
          <ol className="flex flex-col gap-3">
            {report.suggestions.map((s) => (
              <li key={s.title} className="flex flex-col gap-1 rounded-[20px] bg-mist p-5">
                <span className="flex flex-wrap items-center gap-2 font-semibold">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${PRIORITY[s.priority]}`}>{s.priority}</span>
                  {s.title}
                </span>
                <span className="text-[15px] text-gray-600">{s.detail}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <p className="text-xs text-gray-500">
        {report.engine ? `Answers from ${report.engine}. ` : ""}AI answers change with the model, the exact wording, time and location. Each result is evidence from this one run, not a guarantee of what every customer sees. Checked{" "}
        {new Date(report.checkedAt).toLocaleString()}.
      </p>
    </div>
  );
}

function Tile({ label, value, note, good }: { label: string; value: string; note: string; good: boolean }) {
  return (
    <li className="flex flex-col gap-1 rounded-[20px] border border-gray-200 p-4">
      <span className="text-xs font-semibold text-gray-500">{label}</span>
      <span className={`font-display text-2xl font-bold ${value === "—" ? "text-gray-400" : good ? "text-brand-dark" : "text-red-600"}`}>{value}</span>
      <span className="text-xs text-gray-500">{note}</span>
    </li>
  );
}

function AnswerCard({ a }: { a: AnswerResult }) {
  const badge = a.mentioned
    ? { text: a.position ? `Mentioned · #${a.position}` : "Mentioned", cls: "bg-brand-tint text-brand-dark" }
    : { text: a.kind === "brand" ? "Not known" : "Not mentioned", cls: "bg-red-100 text-red-700" };
  return (
    <details className="group rounded-[20px] border border-gray-200">
      <summary className="flex cursor-pointer list-none flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-semibold">&ldquo;{a.prompt}&rdquo;</span>
        <span className={`self-start whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold sm:self-auto ${badge.cls}`}>{badge.text}</span>
      </summary>
      <div className="flex flex-col gap-3 border-t border-gray-100 p-5">
        <p className="whitespace-pre-line break-words text-[15px] text-gray-700">{a.text.replace(/\*\*/g, "")}</p>
        {a.sources.length > 0 && (
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-700">Sources: </span>
            {a.sources.map((s) => s.domain).join(", ")}
          </p>
        )}
        {a.queries.length > 0 && (
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-700">AI searched for: </span>
            {a.queries.join(" · ")}
          </p>
        )}
      </div>
    </details>
  );
}

function BotRow({ b }: { b: BotResult }) {
  const blocked = !b.allowed || b.firewall?.blocked;
  const label = !b.allowed ? "Blocked by robots.txt" : b.firewall?.blocked ? `Refused (${b.firewall.status})` : "Allowed";
  return (
    <li className="flex flex-col gap-1 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex flex-col">
        <span className="font-semibold">
          {b.token} <span className="font-normal text-gray-500">· {b.owner}</span>
        </span>
        <span className="text-sm text-gray-600">
          {PURPOSE[b.purpose]}: {b.product}
        </span>
        {b.rule && <span className="text-xs text-gray-400">{b.rule}</span>}
      </div>
      <span
        className={`self-start whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold sm:self-auto ${
          blocked ? (b.purpose === "training" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-700") : "bg-brand-tint text-brand-dark"
        }`}
      >
        {label}
      </span>
    </li>
  );
}

function LlmsBox({ llms, name }: { llms: AiReport["llms"]; name: string }) {
  const [copied, setCopied] = useState(false);
  const content = llms.found ? llms.preview ?? "" : llms.draft;
  function download() {
    const url = URL.createObjectURL(new Blob([llms.draft], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "llms.txt";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <details className="group rounded-[20px] border border-gray-200">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 font-semibold">
        <span>
          llms.txt{" "}
          <span className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-bold ${llms.found ? "bg-brand-tint text-brand-dark" : "bg-gray-100 text-gray-600"}`}>
            {llms.found ? "Found" : "Missing · draft ready"}
          </span>
        </span>
        <span className="text-gray-400 transition-transform group-open:rotate-180">⌄</span>
      </summary>
      <div className="flex flex-col gap-3 border-t border-gray-100 p-5">
        <p className="text-sm text-gray-600">
          {llms.found
            ? `Your site has ${llms.url}. Here is the start of it.`
            : `A plain-text summary of ${name} for AI tools. Fill in the <placeholders>, then upload it to your site as /llms.txt.`}
        </p>
        <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-mist p-4 text-[13px] leading-relaxed text-gray-800">{content}</pre>
        {!llms.found && (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigator.clipboard.writeText(llms.draft).then(() => setCopied(true))}
              className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-ink"
            >
              {copied ? "Copied" : "Copy"}
            </button>
            <button onClick={download} className="rounded-full border border-[#111111] px-5 py-2.5 text-sm font-semibold hover:bg-[#111111] hover:text-white">
              Download llms.txt
            </button>
          </div>
        )}
      </div>
    </details>
  );
}
