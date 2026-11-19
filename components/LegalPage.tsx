import { PageHero } from "@/components/ui/PageHero";

type Props = { title: string; intro: string; updated: string; sections: { heading: string; text: string }[] };

export function LegalPage({ title, intro, updated, sections }: Props) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} text={intro} />
      <article className="mx-auto flex max-w-[47.5rem] flex-col gap-3 px-6 py-24">
        <p className="text-[0.9375rem] text-gray-600">Last updated: {updated}</p>
        {sections.map((s) => (
          <section key={s.heading} className="flex flex-col gap-3 pt-6">
            <h2 className="font-display text-2xl font-semibold">{s.heading}</h2>
            <p className="text-[1.0625rem] leading-[1.75] text-gray-700">{s.text}</p>
          </section>
        ))}
      </article>
    </>
  );
}
