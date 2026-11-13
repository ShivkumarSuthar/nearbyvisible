# NearbyVisible website

Next.js (App Router) + TypeScript + Tailwind CSS v4 + Motion. The home page is server-rendered (SSR) on every request.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Go live on Vercel

1. Push this folder to a new GitHub repo.
2. On vercel.com: Add New > Project > import the repo > Deploy.
3. After you buy the domain: Vercel > Project > Settings > Domains > add it,
   and set the env var `NEXT_PUBLIC_SITE_URL` to `https://yourdomain.com`.

## Where to edit

- Phone, WhatsApp, email, hours, social links, site URL: `lib/site.ts`
- Brand colours and fonts: `app/globals.css` (`@theme`) and `app/layout.tsx`
- Pages: `app/` (home, services, services/[slug], about, work, contact, faq, privacy, terms)
- Service content, FAQs, industries, projects, testimonials: `lib/content.ts`
- Header with dropdowns, footer, chat button: `components/layout/`
- SSR switch: `app/layout.tsx` (`export const dynamic = "force-dynamic"`)
