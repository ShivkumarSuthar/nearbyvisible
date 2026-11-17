export type Service = {
  slug: string;
  name: string;
  number: string;
  short: string;
  menu: string;
  title: string;
  intro: string;
  gets: { title: string; text: string }[];
  steps: { title: string; text: string }[];
  goodFor: string;
  featured?: boolean;
};

export const services: Service[] = [
  {
    slug: "branding",
    name: "Branding",
    number: "01",
    short: "A logo, colours and a look people remember and trust.",
    menu: "Logo, colours, brand kit",
    title: "A look people remember and trust.",
    intro:
      "We give your business one clear identity, so your board, card, website and Google profile all look like the same trusted business.",
    gets: [
      { title: "Logo design", text: "Two or three directions, refined into one logo you love." },
      { title: "Brand colours and fonts", text: "A simple palette and type that work everywhere." },
      { title: "Tagline", text: "One line that says what you do and why you." },
      { title: "Visiting card", text: "With a QR code that opens your WhatsApp." },
      { title: "Letterhead and invoice design", text: "Professional paperwork for every bill." },
      { title: "Banner, flyer and poster", text: "For your shop, events and offers." },
      { title: "Social media profile photo and cover", text: "So every page looks like you." },
      { title: "Brand guidelines", text: "A brand kit with every file, colour and font." },
    ],
    steps: [
      { title: "Understand", text: "Your business, customers and competitors." },
      { title: "Explore", text: "Logo and colour options to choose from." },
      { title: "Refine", text: "Changes until it feels right." },
      { title: "Deliver", text: "Brand kit in one shared folder." },
    ],
    goodFor: "New businesses, shops, clinics, restaurants and service providers who want to look established.",
  },
  {
    slug: "website",
    name: "Website",
    number: "02",
    short: "A simple, fast website that tells your story and brings calls.",
    menu: "Fast sites that bring calls",
    title: "A website that tells your story and brings calls.",
    intro:
      "Fast, mobile-friendly websites built on modern technology, connected to Google and WhatsApp from day one.",
    gets: [
      { title: "Any type of website", text: "Business site, landing page, online store, booking site or custom portal." },
      { title: "Domain, hosting and SSL", text: "Set up, secure and live under your name." },
      { title: "Business email", text: "Like info@yourbusiness.com." },
      { title: "Google search setup", text: "SEO basics and Search Console submission." },
      { title: "Tracking", text: "Google Analytics to see visitors and enquiries." },
      { title: "Call and WhatsApp buttons", text: "On every page, one tap away." },
      { title: "Connected everywhere", text: "Linked to your Google profile and social pages." },
      { title: "Handover and training", text: "Your logins and how to update it." },
    ],
    steps: [
      { title: "Requirement", text: "Pages, content and photos." },
      { title: "Design and build", text: "Your website, made to fit your business." },
      { title: "Test and approve", text: "You check everything first." },
      { title: "Launch", text: "Live on your domain." },
      { title: "Connect", text: "Google, WhatsApp, social." },
      { title: "Handover", text: "Logins and a short training." },
    ],
    goodFor: "Any business that wants customers to trust it before they call.",
  },
  {
    slug: "app",
    name: "App",
    number: "03",
    short: "An app when your customers book or order again and again.",
    menu: "Android and iOS apps",
    title: "An app when customers come back again and again.",
    intro: "Android and iOS apps for bookings, orders and loyalty, with a simple admin panel for you.",
    gets: [
      { title: "Android and iOS app", text: "One app for both, built for your customers." },
      { title: "Screen design", text: "You see and approve every screen." },
      { title: "Admin panel", text: "Manage orders, bookings and customers." },
      { title: "Store publishing", text: "Listed on Google Play and the App Store." },
      { title: "Usage tracking", text: "See downloads and how people use it." },
      { title: "Connected", text: "Linked from your website, Google profile and WhatsApp." },
    ],
    steps: [
      { title: "Requirement", text: "What the app should do." },
      { title: "Design", text: "Screens for your approval." },
      { title: "Build", text: "The app and admin panel." },
      { title: "Test and approve", text: "On real phones." },
      { title: "Publish", text: "Play Store and App Store." },
      { title: "Handover", text: "Logins and training." },
    ],
    goodFor: "Restaurants, salons, clinics, coaching centres and shops with repeat customers.",
  },
  {
    slug: "google-presence",
    name: "Google Presence",
    number: "04",
    short: "Your Google profile, Maps pin and reviews, set up the right way.",
    menu: "Google profile, Maps, reviews",
    title: "Be the business people find on Google and Maps.",
    intro:
      "We set up your Google Business Profile the right way, within Google’s rules, so you show up when people nearby search.",
    gets: [
      { title: "Google Business Profile", text: "Created or fixed, with the right category." },
      { title: "Verification", text: "Done with Google’s own process." },
      { title: "Complete profile", text: "Photos, services, timings, description and links." },
      { title: "Maps setup", text: "Correct pin or service area." },
      { title: "Reviews", text: "A simple link and routine to collect real reviews." },
      { title: "Business listings", text: "Same name, number and address on other directories." },
      { title: "Owner access stays with you", text: "We manage, you own." },
    ],
    steps: [
      { title: "Collect info", text: "Name, phone, area, photos." },
      { title: "Create or fix", text: "Your Google Business Profile." },
      { title: "Verify", text: "With Google." },
      { title: "Complete", text: "Every section filled in." },
      { title: "Reviews", text: "Start collecting real reviews." },
      { title: "Handover", text: "How to reply and stay active." },
    ],
    goodFor: "Plumbers, electricians, clinics, salons, shops and every business customers search near me for.",
    featured: true,
  },
  {
    slug: "business-growth",
    name: "Business Growth",
    number: "05",
    short: "Social media, ads, WhatsApp and reviews that bring customers back.",
    menu: "Social, ads, WhatsApp",
    title: "More enquiries, every month.",
    intro:
      "Once you are visible, we help you reach more people and bring customers back, and show you the results every month.",
    gets: [
      { title: "Goal setting", text: "What growth means for you, and where you start." },
      { title: "Social media", text: "Instagram, Facebook and YouTube pages set up and active." },
      { title: "Content", text: "Posts, reels and Google updates on a steady schedule." },
      { title: "Ads", text: "Google Ads and Meta Ads, with a budget you control." },
      { title: "WhatsApp and automation", text: "Catalogue, quick replies, chatbot and follow-ups." },
      { title: "Reviews", text: "A routine that keeps reviews coming." },
      { title: "Bring customers back", text: "Offers, reminders and referrals." },
      { title: "Monthly report", text: "Views, calls, enquiries and reviews in plain words." },
    ],
    steps: [
      { title: "Set the goal", text: "And note today’s numbers." },
      { title: "Plan", text: "Channels that fit your business." },
      { title: "Run", text: "Content, ads and WhatsApp." },
      { title: "Measure", text: "A report every month." },
      { title: "Improve", text: "More of what works." },
    ],
    goodFor: "Businesses that are already online and want steady new customers.",
  },
  {
    slug: "maintenance-support",
    name: "Maintenance and Support",
    number: "06",
    short: "We keep everything running, updated and safe, every month.",
    menu: "Updates, security, support",
    title: "Everything keeps running, so you can focus on work.",
    intro: "A monthly plan that keeps your website, app and Google profile updated, safe and fast.",
    gets: [
      { title: "Domain and hosting renewals", text: "Never miss an expiry date." },
      { title: "Website and app updates", text: "New photos, prices and pages." },
      { title: "Security and backups", text: "SSL, regular backups and updates." },
      { title: "Bug fixing", text: "If something breaks, we fix it." },
      { title: "Speed checks", text: "Your pages stay fast." },
      { title: "Google profile updates", text: "Timings, holidays and new photos." },
      { title: "Support", text: "Help when you need a change." },
      { title: "Monthly check report", text: "What we checked and updated." },
    ],
    steps: [
      { title: "Check", text: "Everything, every month." },
      { title: "Update", text: "Content, security and speed." },
      { title: "Fix", text: "Anything that needs it." },
      { title: "Report", text: "A short monthly summary." },
    ],
    goodFor: "Every business with a website, app or Google profile.",
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);

export const processSteps = [
  { title: "We talk", text: "Your business, customers and area." },
  { title: "We review", text: "Where you stand today, service by service." },
  { title: "You choose", text: "Yes to what helps, skip the rest." },
  { title: "We build", text: "You approve everything first." },
  { title: "We launch", text: "Live, and we show you how to use it." },
  { title: "We grow it", text: "A simple report and improvements every month." },
];

export const reasons = [
  { title: "Honest advice", text: "If you do not need a service, we tell you. You pay only for what helps." },
  { title: "One team for everything", text: "Logo to monthly growth, no running between five vendors." },
  { title: "You own everything", text: "Google profile, domain and pages stay in your name." },
  { title: "Results you can see", text: "A plain-language report every month: views, calls, reviews." },
];

export type Faq = { q: string; a: string };

/** FAQ grouped by topic. Answers avoid promises we cannot keep: prices and timelines go in the written quote. */
export const faqGroups: { id: string; title: string; items: Faq[] }[] = [
  {
    id: "start",
    title: "Getting started",
    items: [
      { q: "What does NearbyVisible do?", a: "We help businesses get found online and turn that into calls and visits. That covers branding, websites, apps, your Google presence, growth work like reviews and social media, and monthly support." },
      { q: "Who is this for?", a: "Any business whose customers search online before they call, visit or book. It does not matter what you sell. It matters how people find you." },
      { q: "How do we start?", a: "Message us on WhatsApp or get your free Visibility Score on this site. We look at where you stand today, share what will help and what will not, and send a written plan and quote. Nothing starts until you say yes." },
      { q: "Do I need all six services?", a: "No. We review each service with you and suggest only what will make a difference. Many businesses start with just their Google profile." },
      { q: "What do you need from me?", a: "Your business details, a few real photos, access to any accounts you already have, and your approval before anything goes live. We handle the rest." },
      { q: "Do we have to meet in person?", a: "No. Most of the work happens on WhatsApp and calls. If you prefer, we can also meet at your shop or office." },
    ],
  },
  {
    id: "google",
    title: "Google and results",
    items: [
      { q: "Do I need a website to show up on Google?", a: "Not always. A complete Google Business Profile can bring calls on its own. A website adds trust, answers questions before customers call, and helps you appear in more searches." },
      { q: "How long does a Google profile take?", a: "Setting it up takes a few days once we have your details. Verification is done by Google and can take longer. We guide you through every step." },
      { q: "When will I see results?", a: "Some fixes, like a complete profile with correct timings and photos, can help quickly. Ranking higher builds over months through reviews, activity and good information. Your monthly report shows what is changing." },
      { q: "Can you guarantee the top position on Google?", a: "No one honestly can. Google decides the order. We follow Google’s rules and do the work that helps you rank higher and get chosen." },
      { q: "Will you post fake reviews?", a: "Never. Fake reviews can get a profile suspended. We help you collect real reviews from real customers with a simple link and routine." },
      { q: "Someone else controls our Google profile, or it is suspended. Can you help?", a: "Yes. We help you request access or appeal through Google’s own process. The final decision is Google’s, and we keep you updated." },
      { q: "What is the Visibility Score?", a: "A free audit that tests your business across 180+ digital checkpoints — including your Google Business Profile, local 3-pack rank against competitors, website speed via Google Lighthouse, technical SEO, reviews, and AI search visibility. You get an instant score out of 100 with measured proof for every single point." },
    ],
  },
  {
    id: "website",
    title: "Websites and apps",
    items: [
      { q: "I already have a website. Do I need a new one?", a: "Not always. We check it first. Often fixing speed, content and contact buttons is enough. If a rebuild is better value, we explain why." },
      { q: "Will my website work well on phones?", a: "Yes. Most customers search on their phones, so every site we build is designed for mobile first, with tap-to-call and WhatsApp buttons." },
      { q: "Can I update the website myself?", a: "We can set it up so you can make simple changes, or we can handle updates for you on a monthly plan. Your choice." },
      { q: "Do you build mobile apps?", a: "Yes, when an app truly helps, for example for bookings, orders or loyalty. For many businesses a fast website is enough, and we will tell you honestly." },
    ],
  },
  {
    id: "pricing",
    title: "Pricing and payments",
    items: [
      { q: "How much does it cost?", a: "It depends on the services you choose. After a free review we send a written quote, item by item, so you see exactly what you pay for." },
      { q: "Is the Visibility Score really free?", a: "Yes. No payment and no obligation. If you want help fixing what it finds, you can message us." },
      { q: "How do payments work?", a: "Payment terms are written in your quote before any work starts, so there are no surprises." },
      { q: "Are there monthly charges?", a: "Only if you choose a monthly plan, such as growth or maintenance. One-time work is charged once. Domain and hosting renew every year with the provider." },
    ],
  },
  {
    id: "trust",
    title: "Ownership and trust",
    items: [
      { q: "Who owns my accounts?", a: "You do. Your Google profile, domain, website and social pages stay in your name. We only manage them with your permission." },
      { q: "What happens if I stop working with you?", a: "Everything stays yours. We hand over every login and file we manage, so you can continue on your own or with anyone else." },
      { q: "Is my information safe?", a: "We only ask for what the work needs and never share your details with anyone else." },
    ],
  },
];

export const faqs: Faq[] = faqGroups.flatMap((g) => g.items);

/** Replace these with real projects and client words. Empty arrays hide the sections. */
export const projects: { client: string; service: string; summary: string; image?: string }[] = [];
export const testimonials: { quote: string; name: string; business: string }[] = [];

/** "Your journey" map and page. "get" is what the client actually receives at that stop. */
export const journey = [
  {
    title: "Say hi on WhatsApp",
    we: "Ask three quick questions: what you do, where you work, and who your customers are.",
    you: "Your business name and area.",
    get: "A real person on the other side.",
  },
  {
    title: "Free Google check",
    we: "Search for you the way a customer would, and compare you with the top three that show up.",
    you: "Nothing. We do the looking.",
    get: "Screenshots of where you stand, on WhatsApp.",
  },
  {
    title: "Plan and quote",
    we: "List what to fix first, what can wait, and what you do not need at all.",
    you: "Pick what you want.",
    get: "A written quote, item by item.",
  },
  {
    title: "Preview first",
    we: "Build your profile, website or app and share a preview link.",
    you: "Photos, prices, timings and your OK.",
    get: "A preview link to check before anything goes live.",
  },
  {
    title: "Launch and handover",
    we: "Go live, then hand over every login.",
    you: "A short call to learn replies and updates.",
    get: "All your logins, in your own name.",
  },
  {
    title: "Monthly report",
    we: "Track views, calls, direction requests and reviews.",
    you: "Share new offers and photos when you have them.",
    get: "A one-page report every month.",
  },
];

/**
 * Plans. Set `startingFrom` to a number (in rupees) to show "Starting from ₹X".
 * Leave it null to show "Ask for price" instead.
 */
export type Plan = {
  id: string;
  name: string;
  tagline: string;
  billing: "one-time" | "per month";
  startingFrom: number | null;
  popular?: boolean;
  includes: string[];
  bestFor: string;
};

export const plans: Plan[] = [
  {
    id: "get-found",
    name: "Get Found",
    tagline: "Show up on Google and Maps.",
    billing: "one-time",
    startingFrom: 2999,
    includes: [
      "Google Business Profile created or fixed",
      "Verification with Google’s own process",
      "Right category, services and description",
      "Photos, timings and links added",
      "Exact Maps pin or service area",
      "A review link to share with customers",
      "Owner access stays with you",
    ],
    bestFor: "Not on Google yet, or the profile is incomplete.",
  },
  {
    id: "get-chosen",
    name: "Get Chosen",
    tagline: "Look trusted and turn searches into calls.",
    billing: "one-time",
    startingFrom: 9999,
    popular: true,
    includes: [
      "Everything in Get Found",
      "A fast, mobile-first website",
      "Domain, hosting and SSL in your name",
      "Call and WhatsApp buttons on every page",
      "Google search setup and Search Console",
      "WhatsApp Business with catalogue and quick replies",
      "Handover and a short training",
    ],
    bestFor: "Ready to look professional online.",
  },
  {
    id: "grow-monthly",
    name: "Grow Monthly",
    tagline: "Keep growing, every month.",
    billing: "per month",
    startingFrom: 3999,
    includes: [
      "Posts, reels and Google updates on a schedule",
      "A routine that keeps reviews coming",
      "Google and Meta ads managed (ad budget is yours)",
      "Website and Google profile updates",
      "Security, backups and renewals tracked",
      "A plain-language report every month",
    ],
    bestFor: "Already online and want steady new customers.",
  },
];

export const addOns = [
  { name: "Branding", slug: "branding", text: "Logo, colours, visiting card and a complete brand kit." },
  { name: "App", slug: "app", text: "An Android and iOS app for bookings, orders or loyalty." },
];
