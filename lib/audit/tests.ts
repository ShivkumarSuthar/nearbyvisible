import type { AuditContext, Outcome, SiteData, TestDef } from "./types";

const pass = (actual: string, evidence?: string): Outcome => ({ status: "PASS", actual, evidence });
const warn = (actual: string, evidence?: string): Outcome => ({ status: "WARNING", actual, evidence });
const fail = (actual: string, evidence?: string): Outcome => ({ status: "FAIL", actual, evidence });
const skip = (actual: string): Outcome => ({ status: "NOT_TESTED", actual });

/** Website tests: FAIL when the business has no website, NOT_TESTED when the site could not be read. */
function onSite(ctx: AuditContext, fn: (s: SiteData) => Outcome): Outcome {
  if (ctx.site.state === "none") return fail("No website found");
  if (ctx.site.state === "error") return skip(`Website could not be read: ${ctx.site.error}`);
  return fn(ctx.site.data);
}

const digits = (s = "") => s.replace(/\D/g, "");
const daysSince = (iso: string) => Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
const pct = (n: number) => `${Math.round(n * 100)}`;

export const TESTS: TestDef[] = [
  // ---------- Google Search visibility ----------
  {
    id: "SEARCH_BRAND",
    name: "Found when searching the business name",
    category: "search",
    description: "Searching the business name and city on Google should show this business first.",
    source: "Google Places Text Search",
    weight: 3,
    fix: "Make the Google profile name match the real business name, and complete every section so Google trusts it.",
    run: (c) => {
      if (!c.brand.ok) return skip(c.brand.error);
      const i = c.brand.ids.indexOf(c.place.id);
      const q = `"${c.input.name} ${c.input.city}"`;
      if (i === 0) return pass(`Shown first for ${q}`);
      if (i > 0) return warn(`Shown at position ${i + 1} for ${q}`);
      return fail(`Not in the top ${c.brand.ids.length} results for ${q}`);
    },
  },
  {
    id: "SEARCH_LOCAL_RANK",
    name: "Found by customers who do not know the name",
    category: "search",
    description: "Where the business appears when someone searches its category in its city.",
    source: "Google Places Text Search",
    weight: 4,
    fix: "Pick the most accurate primary category, add services and photos, and collect steady reviews.",
    run: (c) => {
      if (!c.local.ok) return skip(c.local.error);
      const i = c.local.results.findIndex((p) => p.id === c.place.id);
      const q = `"${c.local.query}"`;
      if (i >= 0 && i < 3) return pass(`Position ${i + 1} for ${q}`);
      if (i >= 0 && i < 10) return warn(`Position ${i + 1} for ${q}`);
      if (i >= 0) return fail(`Position ${i + 1} for ${q}`);
      return fail(`Not in the top ${c.local.results.length} for ${q}`);
    },
  },

  // ---------- Google Maps and Business Profile ----------
  {
    id: "GBP_STATUS",
    name: "Business marked as open",
    category: "maps",
    description: "Google should show the business as operational.",
    source: "Google Places Details",
    weight: 2,
    fix: "If the business is open, correct its status on the Google Business Profile.",
    run: (c) => (c.place.status === "OPERATIONAL" ? pass("Operational") : fail(c.place.status ? `Status: ${c.place.status.toLowerCase().replace(/_/g, " ")}` : "No status")),
  },
  {
    id: "GBP_PHONE",
    name: "Phone number on Google",
    category: "maps",
    description: "Customers should be able to call straight from Google.",
    source: "Google Places Details",
    weight: 2,
    fix: "Add a working phone number to the Google Business Profile.",
    run: (c) => (c.place.phone ? pass(c.place.phone) : fail("No phone number")),
  },
  {
    id: "GBP_WEBSITE",
    name: "Website linked on Google",
    category: "maps",
    description: "The Google profile should link to the business website.",
    source: "Google Places Details",
    weight: 2,
    fix: "Add the website address to the Google Business Profile.",
    run: (c) => (c.place.website ? pass(c.place.website) : fail("No website link")),
  },
  {
    id: "GBP_HOURS",
    name: "Opening hours on Google",
    category: "maps",
    description: "Hours tell customers when they can call or visit.",
    source: "Google Places Details",
    weight: 2,
    fix: "Add regular opening hours, and special hours for holidays.",
    run: (c) => (c.place.hasHours ? pass("Opening hours listed") : fail("No opening hours")),
  },
  {
    id: "GBP_CATEGORY",
    name: "Primary category set",
    category: "maps",
    description: "The primary category decides which searches the business appears in.",
    source: "Google Places Details",
    weight: 1,
    fix: "Choose the most specific primary category that matches the main service.",
    run: (c) => (c.place.typeLabel ? pass(c.place.typeLabel) : warn("No clear primary category")),
  },
  {
    id: "GBP_PHOTOS",
    name: "Photos on Google",
    category: "maps",
    description: "Profiles with real photos get more clicks and calls.",
    source: "Google Places Details (returns at most 10 photos)",
    weight: 2,
    fix: "Upload real photos of the place, team and work, and add new ones every month.",
    run: (c) => {
      const n = c.place.photos;
      if (n >= 10) return pass("10 or more photos");
      if (n >= 3) return warn(`${n} photos`);
      return fail(`${n} photos`);
    },
  },

  // ---------- Website health ----------
  {
    id: "WEB_EXISTS",
    name: "Has a website",
    category: "website",
    description: "A website builds trust and helps the business show up in search.",
    source: "Google profile or entered address",
    weight: 3,
    fix: "Create a simple, fast website with services, contact details and location.",
    run: (c) => (c.site.state === "none" ? fail("No website found") : pass(c.site.state === "ok" ? c.site.data.url : c.site.url)),
  },
  {
    id: "WEB_REACHABLE",
    name: "Website opens",
    category: "website",
    description: "The website should load without errors.",
    source: "Direct request",
    weight: 3,
    fix: "Fix hosting or domain problems so the website loads for everyone.",
    run: (c) =>
      c.site.state === "error"
        ? c.site.blocked
          ? skip(c.site.error)
          : fail(c.site.error)
        : onSite(c, (s) => pass(`Loaded (status ${s.status})`)),
  },
  {
    id: "WEB_HTTPS",
    name: "Secure connection (HTTPS)",
    category: "website",
    description: "Browsers warn visitors about sites without HTTPS.",
    source: "Direct request",
    weight: 2,
    fix: "Install an SSL certificate and redirect all pages to https.",
    run: (c) => onSite(c, (s) => (s.https ? pass("Uses HTTPS", s.url) : fail("Not secure (http)", s.url))),
  },
  {
    id: "WEB_MOBILE",
    name: "Built for mobile screens",
    category: "website",
    description: "Most local searches happen on phones. The page needs a mobile viewport.",
    source: "Page HTML",
    weight: 2,
    fix: "Use a responsive design with a mobile viewport tag.",
    run: (c) => onSite(c, (s) => (s.viewport ? pass("Mobile viewport set") : fail("No mobile viewport"))),
  },
  {
    id: "WEB_SPEED",
    name: "Loads fast on mobile",
    category: "website",
    description: "Google Lighthouse performance score on a mobile device.",
    source: "Google PageSpeed Insights",
    weight: 3,
    fix: "Compress images, remove heavy plugins and use good hosting.",
    run: (c) => {
      if (c.site.state === "none") return fail("No website found");
      if (!c.speed) return skip("Website could not be read");
      if (!c.speed.ok) return skip(`PageSpeed did not respond: ${c.speed.error}`);
      const p = c.speed.data.performance;
      if (p === null) return skip("No performance score returned");
      if (p >= 0.9) return pass(`${pct(p)}/100`);
      if (p >= 0.5) return warn(`${pct(p)}/100`);
      return fail(`${pct(p)}/100`);
    },
  },

  // ---------- Technical SEO ----------
  {
    id: "TECH_TITLE",
    name: "Page title",
    category: "tech",
    description: "The title is the blue link people see on Google. 10 to 65 characters works best.",
    source: "Page HTML",
    weight: 2,
    fix: "Write a clear title with the business name and main service.",
    run: (c) =>
      onSite(c, (s) => {
        const n = s.title.length;
        if (!n) return fail("Missing");
        return n >= 10 && n <= 65 ? pass(`${n} characters`, s.title) : warn(`${n} characters`, s.title);
      }),
  },
  {
    id: "TECH_META_DESC",
    name: "Meta description",
    category: "tech",
    description: "The short text under the link on Google. 50 to 160 characters works best.",
    source: "Page HTML",
    weight: 2,
    fix: "Write one or two sentences about what you offer and why to choose you.",
    run: (c) =>
      onSite(c, (s) => {
        const n = s.metaDescription.length;
        if (!n) return fail("Missing");
        return n >= 50 && n <= 160 ? pass(`${n} characters`, s.metaDescription) : warn(`${n} characters`, s.metaDescription);
      }),
  },
  {
    id: "TECH_H1",
    name: "One main heading (H1)",
    category: "tech",
    description: "The home page should have exactly one H1 heading.",
    source: "Page HTML",
    weight: 2,
    fix: "Use one H1 that says what the business does.",
    run: (c) => onSite(c, (s) => (s.h1Count === 1 ? pass("1 H1") : s.h1Count === 0 ? fail("No H1") : warn(`${s.h1Count} H1 headings`))),
  },
  {
    id: "TECH_INDEXABLE",
    name: "Allowed in Google",
    category: "tech",
    description: "The page must not block Google with noindex or robots.txt.",
    source: "Page HTML and robots.txt",
    weight: 3,
    fix: "Remove the noindex tag and any 'Disallow: /' rule for all crawlers.",
    run: (c) =>
      onSite(c, (s) => {
        if (s.noindex) return fail("Page has a noindex tag");
        if (s.robots.blocksAll) return fail("robots.txt blocks Google", s.robots.rule);
        return pass("Indexable");
      }),
  },
  {
    id: "TECH_CANONICAL",
    name: "Canonical URL",
    category: "tech",
    description: "Tells Google which address is the main version of the page.",
    source: "Page HTML",
    weight: 1,
    fix: "Add a canonical link tag to every page.",
    run: (c) => onSite(c, (s) => (s.canonical ? pass("Set", s.canonical) : warn("Missing"))),
  },
  {
    id: "TECH_ROBOTS",
    name: "robots.txt file",
    category: "tech",
    description: "Guides search engines around the site.",
    source: "robots.txt",
    weight: 1,
    fix: "Add a robots.txt file that allows crawling and lists the sitemap.",
    run: (c) => onSite(c, (s) => (s.robots.found ? pass("Found") : warn("Not found"))),
  },
  {
    id: "TECH_SITEMAP",
    name: "XML sitemap",
    category: "tech",
    description: "Helps Google find every page.",
    source: "sitemap.xml",
    weight: 2,
    fix: "Generate an XML sitemap and submit it in Google Search Console.",
    run: (c) => onSite(c, (s) => (s.sitemap.found ? pass("Found", s.sitemap.url) : fail("Not found"))),
  },
  {
    id: "TECH_ALT",
    name: "Image descriptions (alt text)",
    category: "tech",
    description: "Alt text helps Google and screen readers understand images.",
    source: "Page HTML",
    weight: 1,
    fix: "Add a short description to every meaningful image.",
    run: (c) =>
      onSite(c, (s) => {
        if (!s.images) return pass("No images on the page");
        const r = s.imagesWithAlt / s.images;
        const a = `${s.imagesWithAlt} of ${s.images} images`;
        return r >= 0.9 ? pass(a) : r >= 0.5 ? warn(a) : fail(a);
      }),
  },
  {
    id: "TECH_SCHEMA",
    name: "Structured data",
    category: "tech",
    description: "Schema markup helps Google understand the business.",
    source: "Page HTML (JSON-LD)",
    weight: 1,
    fix: "Add JSON-LD structured data for the organisation or business.",
    run: (c) => onSite(c, (s) => (s.ldTypes.length ? pass(s.ldTypes.slice(0, 4).join(", ")) : fail("None found"))),
  },
  {
    id: "TECH_LH_SEO",
    name: "Google Lighthouse SEO score",
    category: "tech",
    description: "Lighthouse checks basic SEO rules on a mobile device.",
    source: "Google PageSpeed Insights",
    weight: 2,
    fix: "Fix the issues listed in the Lighthouse SEO section.",
    run: (c) => {
      if (c.site.state === "none") return fail("No website found");
      if (!c.speed) return skip("Website could not be read");
      if (!c.speed.ok) return skip(`PageSpeed did not respond: ${c.speed.error}`);
      const p = c.speed.data.seo;
      if (p === null) return skip("No SEO score returned");
      return p >= 0.9 ? pass(`${pct(p)}/100`) : p >= 0.7 ? warn(`${pct(p)}/100`) : fail(`${pct(p)}/100`);
    },
  },
  {
    id: "TECH_BROKEN_LINKS",
    name: "No broken links",
    category: "tech",
    description: "Checks up to 10 internal links from the home page.",
    source: "Direct requests",
    weight: 2,
    fix: "Fix or remove links that lead to missing pages.",
    run: (c) =>
      onSite(c, (s) => {
        if (!s.links.checked) return warn("No internal links found");
        if (!s.links.broken.length) return pass(`${s.links.checked} links checked, none broken`);
        return fail(`${s.links.broken.length} of ${s.links.checked} links broken`, s.links.broken.join("\n"));
      }),
  },

  // ---------- Local SEO ----------
  {
    id: "LOCAL_CITY",
    name: "City mentioned on the website",
    category: "local",
    description: "The website should say where the business works.",
    source: "Page text",
    weight: 2,
    fix: "Mention the city and areas you serve in headings and text.",
    run: (c) => onSite(c, (s) => (s.text.includes(c.input.city.toLowerCase()) ? pass(`Mentions "${c.input.city}"`) : fail(`"${c.input.city}" not found on the home page`))),
  },
  {
    id: "LOCAL_SCHEMA",
    name: "Local business structured data",
    category: "local",
    description: "LocalBusiness schema links the website to a real place.",
    source: "Page HTML (JSON-LD)",
    weight: 2,
    fix: "Add LocalBusiness structured data with name, address and phone.",
    run: (c) =>
      onSite(c, (s) => {
        const local = s.ldTypes.find((t) => /LocalBusiness|Store|Restaurant|Hotel|Clinic|Dentist|Physician|Service|Agent|School|Shop/i.test(t));
        return local ? pass(local) : fail("No local business schema");
      }),
  },
  {
    id: "LOCAL_NAP_PHONE",
    name: "Same phone on Google and website",
    category: "local",
    description: "Name, address and phone should match everywhere.",
    source: "Google Places Details and page text",
    weight: 3,
    fix: "Show the same phone number on the website as on Google.",
    run: (c) =>
      onSite(c, (s) => {
        const phone = digits(c.place.phone).slice(-10);
        if (!phone) return skip("No phone on Google to compare");
        return digits(s.text).includes(phone) || s.linkDigits.includes(phone)
          ? pass("Phone matches")
          : fail("Google phone number not found on the website", c.place.phone);
      }),
  },
  {
    id: "LOCAL_MAPS_LINK",
    name: "Map or directions on the website",
    category: "local",
    description: "A map link or embed helps customers find the place.",
    source: "Page HTML",
    weight: 1,
    fix: "Add a Google Maps link or embedded map on the contact section.",
    run: (c) => onSite(c, (s) => (s.mapsLink ? pass("Map link found") : warn("No map link"))),
  },

  // ---------- Social media presence ----------
  ...(["instagram", "facebook", "linkedin", "youtube"] as const).map(
    (net): TestDef => ({
      id: `SOCIAL_${net.toUpperCase()}`,
      name: `${net[0].toUpperCase()}${net.slice(1)} linked`,
      category: "social",
      description: `Checks for a ${net} profile linked from the website. We never guess accounts by name.`,
      source: "Links on the website",
      weight: net === "instagram" || net === "facebook" ? 3 : 1,
      fix: `If you have a ${net} profile, link it from your website so customers and Google can connect the two.`,
      run: (c) => {
        if (c.site.state !== "ok") return skip("No readable website to find linked profiles");
        const url = c.site.data.socials[net];
        return url ? pass("Linked", url) : warn("Not linked from the website");
      },
    }),
  ),

  // ---------- Online reputation ----------
  {
    id: "REP_RATING",
    name: "Average Google rating",
    category: "reputation",
    description: "Most customers choose businesses rated 4.3 or higher.",
    source: "Google Places Details",
    weight: 3,
    fix: "Deliver great service, ask happy customers for reviews and reply to every review.",
    run: (c) => {
      const r = c.place.rating;
      if (r === undefined) return fail("No rating yet");
      return r >= 4.3 ? pass(`${r} stars`) : r >= 3.8 ? warn(`${r} stars`) : fail(`${r} stars`);
    },
  },
  {
    id: "REP_COUNT",
    name: "Number of Google reviews",
    category: "reputation",
    description: "More reviews make the rating believable.",
    source: "Google Places Details",
    weight: 3,
    fix: "Share a review link with every customer after the job.",
    run: (c) => {
      const n = c.place.reviews ?? 0;
      return n >= 50 ? pass(`${n} reviews`) : n >= 10 ? warn(`${n} reviews`) : fail(`${n} reviews`);
    },
  },
  {
    id: "REP_RECENT",
    name: "Recent reviews",
    category: "reputation",
    description: "New reviews show the business is active today.",
    source: "Google Places Details (latest 5 reviews)",
    weight: 2,
    fix: "Make asking for reviews a weekly habit.",
    run: (c) => {
      if (!c.place.latestReview) return (c.place.reviews ?? 0) > 0 ? skip("Google did not share review dates") : fail("No reviews yet");
      const d = daysSince(c.place.latestReview);
      const a = d === 0 ? "Latest review today" : `Latest review ${d} days ago`;
      // Google shares only 5 "most relevant" reviews, not the newest, so an old date here is a warning, not proof.
      const note = "Based on the 5 reviews Google shares, which are not always the newest.";
      return d <= 90 ? pass(a) : d <= 365 || (c.place.reviews ?? 0) > 5 ? warn(a, note) : fail(a, note);
    },
  },

  // ---------- Lead generation ----------
  {
    id: "LEAD_CALL",
    name: "Click to call",
    category: "leads",
    description: "Customers on phones should be able to tap to call.",
    source: "Website links",
    weight: 2,
    fix: "Add a tap-to-call button on the website.",
    run: (c) => onSite(c, (s) => (s.telLink ? pass("Tap-to-call link on website") : fail("No tap-to-call link on the website"))),
  },
  {
    id: "LEAD_WHATSAPP",
    name: "WhatsApp contact",
    category: "leads",
    description: "Many customers prefer to message first.",
    source: "Website links",
    weight: 2,
    fix: "Add a WhatsApp chat button with a pre-filled message.",
    run: (c) => onSite(c, (s) => (s.whatsappLink ? pass("WhatsApp link found") : fail("No WhatsApp link"))),
  },
  {
    id: "LEAD_FORM",
    name: "Enquiry form",
    category: "leads",
    description: "A form catches customers who do not want to call.",
    source: "Page HTML",
    weight: 1,
    fix: "Add a short enquiry form on the home or contact page.",
    run: (c) => onSite(c, (s) => (s.form ? pass("Form found on the home page") : warn("No form on the home page"))),
  },
  {
    id: "LEAD_CTA",
    name: "Clear call to action",
    category: "leads",
    description: "Buttons like 'Call now' or 'Book' tell visitors what to do next.",
    source: "Page HTML",
    weight: 1,
    fix: "Add clear action buttons near the top of the page.",
    run: (c) => onSite(c, (s) => (s.ctas.length ? pass(`${s.ctas.length} found`, s.ctas.join(", ")) : fail("No clear action buttons"))),
  },
];
