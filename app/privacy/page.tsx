import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What information NearbyVisible collects through this website and the free Visibility Score, why, who processes it, and how to see, correct or delete it.",
  alternates: { canonical: "/privacy" },
};

// Written to match what the code actually does (forms → EmailJS, /check → Google Places, PageSpeed and Gemini,
// WhatsApp form → saved in the browser, Meta Pixel only after consent). Update it whenever those change,
// and review it with a legal professional (Digital Personal Data Protection Act, 2023).
export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      intro="How we handle the information you share with us."
      updated="18 November 2026"
      sections={[
        {
          heading: "Who we are",
          text: `${site.name} (“we”) runs this website and decides how the information collected here is used. You can reach us at ${site.email}, on WhatsApp or by phone at ${site.phoneDisplay}.`,
        },
        {
          heading: "What we collect",
          text: "When you fill in a form on this site, we collect your name, phone number and, if you add them, your email address, business name, city, the service or plan you are interested in, your message and the page you sent it from. If you give an email address, we send you a short confirmation that we received your request. If you contact us on WhatsApp or by phone, we see the details you share there.",
        },
        {
          heading: "The free Visibility Score",
          text: "When you run the free check, we send the business name, city, category and website you enter to Google’s Places and PageSpeed services to look up public information, and we read the business website’s public pages. The AI part of the check sends the business name, city and category to Google’s Gemini AI service, which may search the web to answer. We also ask for your WhatsApp number. If you also give an email address, we email you the report. When the check finishes, we save the report for 30 days at a private link, and email a copy with your contact details to our team (through EmailJS) so we can contact you about it; we keep that email like any other enquiry. If you choose to message us on WhatsApp for the report, our WhatsApp Business service (run by Meta) replies with the link and passes your messages to our team. Cloudflare Turnstile may check your browser to keep bots out. A short-lived copy of the AI result is kept in server memory for up to 12 hours so the same business is not checked twice.",
        },
        { heading: "How we use it", text: "Only to reply to you, prepare your review or quote, and deliver the services you choose. We do not send marketing messages you did not ask for." },
        {
          heading: "Service providers",
          text: "Form messages and free-check reports reach us, and our emails reach you, through Resend or EmailJS. Saved reports are stored with Upstash, and WhatsApp replies are sent with Meta’s WhatsApp Business service. Cloudflare (Turnstile) checks that forms are sent by people, not bots. The site is hosted by Vercel. The free check uses Google (Places, PageSpeed and Gemini). These providers process data only to deliver their service to us and may store it on servers outside India. We do not sell your information.",
        },
        { heading: "Your accounts", text: "Logins you share with us are used only for your project, kept private and handed back to you when we stop working together." },
        {
          heading: "Saved in your browser",
          text: "When you use the WhatsApp form, your name, phone number, business name and city are saved in your own browser so you do not have to type them again next time. They stay on your device and are not sent anywhere until you submit a form. You can remove them by clearing this site’s data in your browser settings. We also save small settings, such as when you closed the request popup and your cookie choice.",
        },
        {
          heading: "Advertising (Meta Pixel)",
          text: "Only if you choose “Accept” in the cookie banner, we load the Meta Pixel to measure our Facebook and Instagram ads. It tells Meta when someone views a page, searches or finishes a free Visibility Score (with the business category), sends a form, or opens WhatsApp. It does not receive your name, phone number or the business name you type. If you choose “Decline”, the Pixel is not loaded. You can change your choice at any time with the “Cookie settings” link at the bottom of every page.",
        },
        { heading: "How long we keep it", text: "We keep enquiry details while we are in touch and for up to 2 years after our last contact, unless the law requires longer (for example, invoices). Ask us and we will delete them sooner." },
        {
          heading: "Your rights",
          text: `You can ask us at any time to see, correct, update or delete the information we hold about you, or withdraw your consent. Write to ${site.email} or message us on WhatsApp, and we will reply within 30 days.`,
        },
        {
          heading: "Grievances",
          text: `If you have a complaint about how we handle your data, write to our grievance contact at ${site.email} with the subject “Privacy grievance”. If you are not satisfied with our reply, you can approach the Data Protection Board of India.`,
        },
        { heading: "Changes", text: "If we change this policy, we will update the date at the top of this page." },
      ]}
    />
  );
}
