"use client";

import { useState } from "react";
import { services } from "@/lib/content";
import { whatsappLink } from "@/lib/site";

const field = "w-full rounded-[14px] border border-gray-300 bg-white px-4 py-3.5 text-base outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand/30";

/** No backend needed: the form opens WhatsApp with the details filled in. */
export function ContactForm() {
  const [error, setError] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    if (!get("name") || !get("phone")) {
      setError("Please add your name and phone number.");
      return;
    }
    setError("");
    const message = [
      "Hi NearbyVisible,",
      `Name: ${get("name")}`,
      get("business") && `Business: ${get("business")}`,
      `Phone: ${get("phone")}`,
      get("area") && `Area: ${get("area")}`,
      `Need: ${get("service")}`,
      get("message") && `Message: ${get("message")}`,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5 rounded-[32px] bg-mist p-8 md:p-10">
      <h2 className="font-display text-3xl font-bold">Or send us a message</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field id="name" label="Your name" required />
        <Field id="business" label="Business name" />
        <Field id="phone" label="Phone or WhatsApp" type="tel" required />
        <Field id="area" label="City / area" />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="service" className="text-[15px] font-semibold">What do you need?</label>
        <select id="service" name="service" className={field} defaultValue="Not sure yet, review my business">
          <option>Not sure yet, review my business</option>
          {services.map((s) => (
            <option key={s.slug}>{s.name}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-[15px] font-semibold">Message</label>
        <textarea id="message" name="message" rows={4} className={`${field} resize-y`} />
      </div>
      {error && <p role="alert" className="text-[15px] font-medium text-red-700">{error}</p>}
      <button type="submit" className="self-start rounded-full bg-ink px-7 py-4 text-[17px] font-semibold text-white transition-transform hover:-translate-y-0.5">
        Send on WhatsApp
      </button>
    </form>
  );
}

function Field({ id, label, type = "text", required }: { id: string; label: string; type?: string; required?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[15px] font-semibold">
        {label}
        {required && <span className="text-red-700"> *</span>}
      </label>
      <input id={id} name={id} type={type} required={required} className={field} autoComplete={type === "tel" ? "tel" : id === "name" ? "name" : "off"} />
    </div>
  );
}
