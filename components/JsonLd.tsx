import { site } from "@/lib/site";

/** Renders schema.org data. "<" is escaped so text inside can never close the script tag. */
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

/** BreadcrumbList for a page, e.g. [["Services", "/services"], ["Website", "/services/website"]]. Home is added first. */
export function BreadcrumbJsonLd({ items }: { items: [name: string, path: string][] }) {
  const all: [string, string][] = [["Home", "/"], ...items];
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: all.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${site.url}${path === "/" ? "" : path}` })),
      }}
    />
  );
}

/**
 * Site-wide organisation data. We serve businesses across India from online and WhatsApp, so this is an
 * Organization with areaServed India, not a LocalBusiness (which Google expects to have a street address).
 */
export function LocalBusinessJsonLd() {
  const org = {
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    slogan: site.tagline,
    description: site.description,
    url: site.url,
    logo: `${site.url}/logo-icon.svg`,
    telephone: site.phoneE164,
    ...(site.email ? { email: site.email } : {}),
    areaServed: { "@type": "Country", name: "India" },
    sameAs: Object.values(site.social).filter(Boolean),
  };
  const website = {
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    inLanguage: "en-IN",
    publisher: { "@id": `${site.url}/#organization` },
  };
  return <JsonLd data={{ "@context": "https://schema.org", "@graph": [org, website] }} />;
}
