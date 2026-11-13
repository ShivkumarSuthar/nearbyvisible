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

export const industries = [
  "Plumbers and electricians",
  "Clinics and doctors",
  "Salons and spas",
  "Restaurants and cafes",
  "Shops and showrooms",
  "Coaching and tuition",
  "Hotels and travel",
  "Contractors and repair services",
];

export const reasons = [
  { title: "Honest advice", text: "If you do not need a service, we tell you. You pay only for what helps." },
  { title: "One team for everything", text: "Logo to monthly growth, no running between five vendors." },
  { title: "You own everything", text: "Google profile, domain and pages stay in your name." },
  { title: "Results you can see", text: "A plain-language report every month: views, calls, reviews." },
];

export const faqs = [
  { q: "What does NearbyVisible do?", a: "We help businesses get found online: branding, websites, apps, Google presence, growth and monthly support." },
  { q: "Do I need all six services?", a: "No. We review each service with you and suggest only what helps. You choose." },
  { q: "Do I need a website to show up on Google?", a: "Not always. A complete Google Business Profile can bring calls on its own. A website builds more trust and helps with search." },
  { q: "How long does a Google profile take?", a: "Setup takes a few days. Verification depends on Google and can take longer." },
  { q: "Can you guarantee the top position on Google?", a: "No one honestly can. We follow Google’s rules and do the work that helps you rank and get chosen." },
  { q: "Will you post fake reviews?", a: "Never. We help you collect real reviews from real customers, as Google requires." },
  { q: "Who owns my accounts?", a: "You do. Your Google profile, domain and pages stay in your name. We only manage them." },
  { q: "How much does it cost?", a: "It depends on the services you choose. After a free review we share a clear quote." },
];

/** Replace these with real projects and client words. Empty arrays hide the sections. */
export const projects: { client: string; service: string; summary: string; image?: string }[] = [];
export const testimonials: { quote: string; name: string; business: string }[] = [];
