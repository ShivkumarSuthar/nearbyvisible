"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { PlaceSummary, Report } from "@/lib/audit/types";
import { AuditReport } from "./AuditReport";
import { track } from "@/components/MetaPixel";
import { STATES_AND_CITIES } from "@/lib/locations";
import { Combobox, type ComboboxOption } from "@/components/ui/Combobox";

type Form = {
  name: string;
  city: string;
  category: string;
  website: string;
  competitor: string;
};
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

const POPULAR_QUICK_CHIPS = [
  { label: "Clinic / Doctor", icon: "🏥" },
  { label: "Restaurant / Cafe", icon: "🍽️" },
  { label: "Plumber / Electrician", icon: "🔧" },
  { label: "Salon / Beauty", icon: "✂️" },
  { label: "Real Estate", icon: "🏠" },
  { label: "Car Service", icon: "🚗" },
  { label: "Gym & Fitness", icon: "🏋️" },
  { label: "Retail Store", icon: "🛍️" },
];

const CATEGORY_GROUPS = [
  {
    group: "Home & Local Services",
    items: [
      "Plumber",
      "Electrician",
      "Carpenter",
      "AC Repair & Service",
      "Painter",
      "Pest Control",
      "Cleaning Service",
      "Packers and Movers",
    ],
  },
  {
    group: "Healthcare & Medical",
    items: [
      "Dental Clinic",
      "Doctor / Clinic",
      "Hospital",
      "Pharmacy / Chemist",
      "Diagnostics Lab",
      "Physiotherapy Centre",
      "Ayurvedic Clinic",
    ],
  },
  {
    group: "Food, Dining & Stays",
    items: [
      "Restaurant",
      "Cafe",
      "Bakery & Cake Shop",
      "Hotel / Resort / Guest House",
      "Sweet Shop (Mithai)",
      "Catering & Events",
    ],
  },
  {
    group: "Beauty, Wellness & Fitness",
    items: [
      "Salon / Beauty Parlour",
      "Spa & Wellness Centre",
      "Gym / Fitness Club",
      "Yoga Studio",
      "Makeup Artist",
    ],
  },
  {
    group: "Automotive & Vehicles",
    items: [
      "Car Repair & Service",
      "Bike / Two-Wheeler Service",
      "Car Wash & Detailing",
      "Tyre Shop",
      "Auto Spare Parts",
    ],
  },
  {
    group: "Professional & Financial",
    items: [
      "Chartered Accountant (CA)",
      "Lawyer / Advocate",
      "Real Estate Agent / Consultant",
      "Architect & Interior Designer",
      "Tax Consultant",
      "Insurance Agency",
    ],
  },
  {
    group: "Retail & Shopping",
    items: [
      "Clothing & Fashion Store",
      "Jewellery Showroom",
      "Electronics & Mobile Shop",
      "Hardware & Electrical Store",
      "Furniture Store",
      "Grocery & Supermarket",
    ],
  },
  {
    group: "Education & Coaching",
    items: [
      "Coaching Institute",
      "School / Play School",
      "Computer Training Centre",
      "Dance & Music Academy",
    ],
  },
];

const STATE_OPTIONS: ComboboxOption[] = STATES_AND_CITIES.map((s) => ({
  value: s.state,
  label: s.state,
}));

const CATEGORY_OPTIONS: ComboboxOption[] = CATEGORY_GROUPS.flatMap((g) =>
  g.items.map((item) => ({
    value: item,
    label: item,
    group: g.group,
  }))
);

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
  return data as T;
}

export function Checker() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState<Form>({ name: "", city: "", category: "", website: "", competitor: "" });
  const [selectedState, setSelectedState] = useState("");
  const [stage, setStage] = useState<Stage>({ kind: "form" });

  useEffect(() => {
    const queryName = searchParams?.get("name") || searchParams?.get("q");
    if (queryName) {
      setForm((prev) => ({ ...prev, name: queryName }));
    }
  }, [searchParams]);

  const cityOptions: ComboboxOption[] = useMemo(() => {
    const found = STATES_AND_CITIES.find((s) => s.state === selectedState);
    if (!found) return [];
    return found.cities.map((city) => ({
      value: city,
      label: city,
    }));
  }, [selectedState]);

  function handleStateChange(state: string) {
    setSelectedState(state);
    setForm((prev) => ({ ...prev, city: "" }));
  }

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (!form.city.trim()) {
      setStage({ kind: "error", message: "Please select or enter your city." });
      return;
    }
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
    <div className="mx-auto w-full max-w-[760px] rounded-[32px] border border-gray-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(17,17,17,0.25)] sm:p-10">
      {(stage.kind === "form" || stage.kind === "searching") && (
        <form onSubmit={search} className="flex flex-col gap-6">
          <div className="flex flex-col gap-5">
            {/* Business Name */}
            <Field
              label="Business name"
              required
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              placeholder="As it appears on Google (e.g. Ramesh Plumbing)"
            />

            {/* Standard Searchable State & City Comboboxes */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Combobox
                label="State / Region"
                required
                value={selectedState}
                onChange={handleStateChange}
                options={STATE_OPTIONS}
                placeholder="Select State..."
                searchPlaceholder="Search state (e.g. Rajasthan, Delhi, Maharashtra...)"
              />

              <Combobox
                label="City"
                required
                value={form.city}
                onChange={(city) => setForm((prev) => ({ ...prev, city }))}
                options={cityOptions}
                disabled={!selectedState}
                placeholder={!selectedState ? "Select state first..." : "Select City..."}
                searchPlaceholder="Search city (or type custom city)..."
                emptyText={!selectedState ? "Please select a state above first." : "City not found? Type to use custom:"}
                allowCustom
              />
            </div>

            {/* Standard Searchable Category Combobox */}
            <div className="flex flex-col gap-3">
              <Combobox
                label="Business Category (optional)"
                value={form.category}
                onChange={(category) => setForm((prev) => ({ ...prev, category }))}
                options={CATEGORY_OPTIONS}
                placeholder="Search or select category..."
                searchPlaceholder="Search 50+ categories (e.g. Plumber, Dental, Cafe, Gym...)"
                allowCustom
              />

              {/* 1-Tap Quick Select Chips */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-gray-500">Popular:</span>
                {POPULAR_QUICK_CHIPS.map((chip) => {
                  const isSelected = form.category.toLowerCase() === chip.label.toLowerCase();
                  return (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          category: isSelected ? "" : chip.label,
                        }))
                      }
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                        isSelected
                          ? "bg-brand text-ink shadow-sm ring-2 ring-brand"
                          : "border border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-white"
                      }`}
                    >
                      <span>{chip.icon}</span>
                      <span>{chip.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Website & Optional Competitor Fields */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                label="Website (optional)"
                value={form.website}
                onChange={(v) => setForm({ ...form, website: v })}
                placeholder="e.g. yourbusiness.com"
              />

              <Field
                label="Benchmark Competitor (optional)"
                value={form.competitor}
                onChange={(v) => setForm({ ...form, competitor: v })}
                placeholder="e.g. Rival Business Name"
              />
            </div>
            {form.competitor ? (
              <p className="text-xs text-brand-dark">
                🎯 We will compare your business head-to-head against <strong>{form.competitor}</strong> in {form.city || "your city"}.
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                💡 Tip: Leave competitor blank to automatically compare with the #1 top-ranking business in your city.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={stage.kind === "searching"}
            className="rounded-full bg-brand px-7 py-4 text-[17px] font-semibold text-ink shadow-[0_8px_20px_-6px_rgba(34,197,94,0.6)] transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
          >
            {stage.kind === "searching" ? "Searching Google Places…" : "Get my Visibility Score →"}
          </button>
          <p className="text-center text-sm text-gray-500">Free 180-Point Audit. Uses public Google records. Takes ~30 seconds.</p>
        </form>
      )}

      {stage.kind === "pick" && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-brand-tint px-3 py-1 text-xs font-bold text-brand-dark">
              <span>{stage.results.length === 1 ? "✓ 1 Exact Match Found" : `📍 ${stage.results.length} Matching Profiles Found`}</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              {stage.results.length === 1 ? "Is this your business profile?" : "Which business is yours?"}
            </h2>
            <p className="text-sm text-gray-600 sm:text-base">
              {stage.results.length === 1
                ? "Please verify the address, category, and phone number below to make sure you are auditing the exact right profile."
                : "Multiple businesses were found with similar names. Compare the address and phone numbers below to select your exact profile:"}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {stage.results.map((p, idx) => (
              <div
                key={p.id}
                className="group relative flex flex-col gap-4 rounded-[24px] border-2 border-gray-200 bg-white p-6 transition-all hover:border-brand hover:shadow-lg sm:p-7"
              >
                {/* Header row: Name + Category badge */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Result #{idx + 1}</span>
                    <h3 className="font-display text-xl font-bold text-ink group-hover:text-brand-dark sm:text-2xl">{p.name}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {p.typeLabel && (
                      <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-gray-700">
                        {p.typeLabel}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-tint/70 px-2.5 py-1 text-xs font-medium text-brand-dark">
                      <span className="size-1.5 rounded-full bg-brand animate-pulse" />
                      Google Maps Verified
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 gap-2.5 border-y border-gray-100 py-4 text-sm text-gray-700 sm:grid-cols-2">
                  <div className="flex items-start gap-2.5">
                    <span className="text-base">📍</span>
                    <span className="flex-1 leading-snug">{p.address}</span>
                  </div>
                  {p.phone && (
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">📞</span>
                      <span className="font-medium text-ink">{p.phone}</span>
                    </div>
                  )}
                  {p.rating !== undefined && (
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">⭐</span>
                      <span>
                        <strong className="text-ink">{p.rating.toFixed(1)}</strong> / 5.0 · {p.reviews ?? 0} Google reviews
                      </span>
                    </div>
                  )}
                  {p.website && (
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">🌐</span>
                      <span className="truncate text-gray-500">{p.website.replace(/^https?:\/\//i, "").replace(/\/$/, "")}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  {p.mapsUrl ? (
                    <a
                      href={p.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-ink hover:underline"
                    >
                      <span>Open on Google Maps</span>
                      <svg viewBox="0 0 20 20" fill="currentColor" className="size-3.5">
                        <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h4a.75.75 0 0 1 0 1.5h-4Z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 0 0 1.06 1.06L13 8.06v2.69a.75.75 0 0 0 1.5 0v-5a.75.75 0 0 0-.75-.75h-5a.75.75 0 0 0 0 1.5h2.69l-5.246 5.253Z" clipRule="evenodd" />
                      </svg>
                    </a>
                  ) : <span />}

                  <button
                    type="button"
                    onClick={() => audit(p)}
                    className="flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-ink shadow-[0_6px_16px_-4px_rgba(34,197,94,0.5)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>Audit This Business</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Not your business? */}
          <div className="flex flex-col items-center justify-between gap-3 rounded-2xl bg-mist p-5 text-center sm:flex-row sm:text-left">
            <div>
              <p className="font-semibold text-ink">Can&apos;t find your exact business?</p>
              <p className="text-xs text-gray-600">Try searching with your locality or landmark name (e.g. &ldquo;Ramesh Clinic Mansarovar&rdquo;).</p>
            </div>
            <button
              type="button"
              onClick={() => setStage({ kind: "form" })}
              className="flex-none rounded-full border border-gray-300 bg-white px-5 py-2.5 text-xs font-semibold text-ink hover:border-gray-400 hover:bg-gray-50"
            >
              ← Edit Search Query
            </button>
          </div>
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

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700">
      <span>
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <input
        value={value}
        required={required}
        maxLength={120}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-2xl border border-gray-300 px-4 py-3.5 text-base font-normal text-[#111111] outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-tint"
      />
    </label>
  );
}
