"use client";

import { useEffect, useState } from "react";
import type { PlaceSummary, Report } from "@/lib/audit/types";
import { AuditReport } from "./AuditReport";
import { track } from "@/components/MetaPixel";

type Form = { name: string; city: string; category: string; website: string };
type Stage =
  | { kind: "form" }
  | { kind: "searching" }
  | { kind: "pick"; results: PlaceSummary[] }
  | { kind: "running"; place: PlaceSummary }
  | { kind: "report"; report: Report }
  | { kind: "error"; message: string };

const STEPS = [
  "Finding you on Google Maps",
  "Searching like a new customer would",
  "Opening your website",
  "Running Google speed tests",
  "Checking SEO, links and contact options",
  "Calculating your score",
];

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
  return data as T;
}

export function Checker() {
  const [form, setForm] = useState<Form>({ name: "", city: "", category: "", website: "" });
  const [stage, setStage] = useState<Stage>({ kind: "form" });

  async function search(e: React.FormEvent) {
    e.preventDefault();
    setStage({ kind: "searching" });
    track("Search", { search_string: form.category || "business" });
    try {
      const { results } = await post<{ results: PlaceSummary[] }>("/api/check/search", form);
      setStage(results.length ? { kind: "pick", results } : { kind: "error", message: "We could not find this business on Google Maps. Check the name and city, or message us and we will look manually." });
    } catch (err) {
      setStage({ kind: "error", message: (err as Error).message });
    }
  }

  async function audit(place: PlaceSummary) {
    setStage({ kind: "running", place });
    try {
      const report = await post<Report>("/api/check/audit", { ...form, placeId: place.id });
      setStage({ kind: "report", report });
      track("Lead", { content_name: "visibility_score", visibility_score: report.score ?? 0 });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStage({ kind: "error", message: (err as Error).message });
    }
  }

  if (stage.kind === "report")
    return <AuditReport report={stage.report} city={form.city} category={form.category} onReset={() => setStage({ kind: "form" })} />;

  return (
    <div className="mx-auto w-full max-w-[720px] rounded-[32px] border border-gray-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(17,17,17,0.25)] sm:p-10">
      {(stage.kind === "form" || stage.kind === "searching") && (
        <form onSubmit={search} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Business name" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="As it appears on Google" />
            <Field label="City" required value={form.city} onChange={(v) => setForm({ ...form, city: v })} placeholder="Where customers find you" />
            <Field label="Category (optional)" value={form.category} onChange={(v) => setForm({ ...form, category: v })} placeholder="What customers search for" />
            <Field label="Website (optional)" value={form.website} onChange={(v) => setForm({ ...form, website: v })} placeholder="yourbusiness.com" />
          </div>
          <button
            type="submit"
            disabled={stage.kind === "searching"}
            className="rounded-full bg-brand px-7 py-4 text-[17px] font-semibold text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {stage.kind === "searching" ? "Searching…" : "Get my Visibility Score →"}
          </button>
          <p className="text-center text-sm text-gray-500">Free. Uses only public information. Takes about 30 seconds.</p>
        </form>
      )}

      {stage.kind === "pick" && (
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-2xl font-semibold">Which one is yours?</h2>
          <ul className="flex flex-col gap-3">
            {stage.results.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => audit(p)}
                  className="flex w-full flex-col gap-1 rounded-[20px] border border-gray-200 p-5 text-left transition-colors hover:border-brand hover:bg-brand-wash"
                >
                  <span className="text-[17px] font-semibold">{p.name}</span>
                  <span className="text-sm text-gray-600">{p.address}</span>
                  {p.rating !== undefined && (
                    <span className="text-sm text-gray-600">
                      ★ {p.rating} · {p.reviews ?? 0} reviews
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <button onClick={() => setStage({ kind: "form" })} className="self-start text-sm font-semibold text-brand-dark hover:underline">
            Not listed? Search again
          </button>
        </div>
      )}

      {stage.kind === "running" && <Running name={stage.place.name} />}

      {stage.kind === "error" && (
        <div className="flex flex-col items-start gap-4">
          <p className="text-lg text-gray-700">{stage.message}</p>
          <button onClick={() => setStage({ kind: "form" })} className="rounded-full border border-[#111111] px-6 py-3 font-semibold hover:bg-[#111111] hover:text-white">
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

function Running({ name }: { name: string }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex flex-col gap-6" aria-live="polite">
      <h2 className="font-display text-2xl font-semibold">Checking {name}…</h2>
      <ol className="flex flex-col gap-3">
        {STEPS.map((s, i) => (
          <li key={s} className={`flex items-center gap-3 text-[17px] ${i <= step ? "text-[#111111]" : "text-gray-400"}`}>
            <span
              className={`flex size-6 flex-none items-center justify-center rounded-full text-xs font-bold ${
                i < step ? "bg-brand text-ink" : i === step ? "animate-pulse bg-brand-tint text-brand-dark" : "bg-gray-100"
              }`}
            >
              {i < step ? "✓" : ""}
            </span>
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, required }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700">
      {label}
      <input
        value={value}
        required={required}
        maxLength={120}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-2xl border border-gray-300 px-4 py-3.5 text-base font-normal text-[#111111] outline-none focus:border-brand focus:ring-2 focus:ring-brand-tint"
      />
    </label>
  );
}
