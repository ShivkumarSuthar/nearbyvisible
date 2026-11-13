import { PageHero } from "@/components/ui/PageHero";

type Props = { title: string; intro: string; updated: string; sections: { heading: string; text: string }[] };

export function LegalPage({ title, intro, updated, sections }: Props) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} text={intro} />
      <article className="mx-auto flex max-w-[760px] flex-col gap-3 px-6 py-24">
        <p className="text-[15px] text-gray-600">Last updated: {updated}</p>
        {sections.map((s) => (
          <section key={s.heading} className="flex flex-col gap-3 pt-6">
            <h2 className="font-display text-2xl font-semibold">{s.heading}</h2>
            <p className="text-[17px] leading-[1.75] text-gray-700">{s.text}</p>
          </section>
        ))}
      </article>
    </>
  );
}
