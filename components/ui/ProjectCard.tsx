import Image from "next/image";

type Props = { client: string; service: string; summary: string; image?: string };

export function ProjectCard({ client, service, summary, image }: Props) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[28px] border border-gray-200">
      <div className="relative aspect-[16/10] bg-mist">
        {image && <Image src={image} alt={`${client} project`} fill className="object-cover" sizes="(min-width: 1024px) 400px, 100vw" />}
      </div>
      <div className="flex flex-col gap-2.5 p-7">
        <span className="text-sm font-semibold text-brand-dark">{service}</span>
        <h3 className="font-display text-2xl font-semibold">{client}</h3>
        <p className="text-base leading-relaxed text-gray-600">{summary}</p>
      </div>
    </article>
  );
}
