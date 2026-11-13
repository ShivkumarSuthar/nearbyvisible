import { site } from "@/lib/site";

export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    slogan: site.tagline,
    description: site.description,
    url: site.url,
    telephone: "+916377290604",
    sameAs: Object.values(site.social).filter(Boolean),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
