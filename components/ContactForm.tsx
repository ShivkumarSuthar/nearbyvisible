"use client";

import { services } from "@/lib/content";
import { Honeypot, useLeadForm } from "@/components/ui/useLeadForm";

const field = "w-full rounded-[14px] border border-gray-300 bg-white px-4 py-3.5 text-base outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand/30";

/** Sends the enquiry to the team's email through /api/lead. */
export function ContactForm() {
  const { state, error, onSubmit, reset } = useLeadForm("contact");

  if (state === "sent") {
    return (
      <div className="flex flex-col items-start gap-4 rounded-[32px] bg-brand-wash p-8 md:p-10">
        <span className="flex size-12 items-center justify-center rounded-full bg-brand text-xl font-bold text-ink">✓</span>
        <h2 className="font-display text-3xl font-bold">Message received.</h2>
        <p className="text-lg text-gray-700">Thank you. We will call or message you soon.</p>
        <button type="button" onClick={reset} className="font-semibold text-brand-dark hover:underline">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative flex flex-col gap-5 rounded-[32px] bg-mist p-8 md:p-10">
      <Honeypot />
      <h2 className="font-display text-3xl font-bold">Or send us a message</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field id="name" label="Your name" required />
        <Field id="business" label="Business name" />
        <Field id="phone" label="Phone or WhatsApp" type="tel" required />
        <Field id="email" label="Email (optional)" type="email" />
        <Field id="city" label="City / area" />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="service" className="text-[0.9375rem] font-semibold">What do you need?</label>
        <select id="service" name="service" className={field} defaultValue="Not sure yet, review my business">
          <option>Not sure yet, review my business</option>
          {services.map((s) => (
            <option key={s.slug}>{s.name}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-[0.9375rem] font-semibold">Message</label>
        <textarea id="message" name="message" rows={4} className={`${field} resize-y`} />
      </div>
      {error && <p role="alert" className="text-[0.9375rem] font-medium text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={state === "sending"}
        className="self-start rounded-full bg-ink px-7 py-4 text-[1.0625rem] font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

function Field({ id, label, type = "text", required }: { id: string; label: string; type?: string; required?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[0.9375rem] font-semibold">
        {label}
        {required && <span className="text-red-700"> *</span>}
      </label>
      <input id={id} name={id} type={type} required={required} className={field} autoComplete={type === "tel" ? "tel" : type === "email" ? "email" : id === "name" ? "name" : "off"} />
    </div>
  );
}
