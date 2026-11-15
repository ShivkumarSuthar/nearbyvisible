import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/blog/PostCard";
import { PostCover } from "@/components/blog/PostCover";
import { formatDate, getAllPosts, getPost } from "@/lib/blog";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.description, publishedTime: post.date },
  };
}

export default async function PostPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const related = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category))
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article>
        <header className="bg-ink text-white">
          <div className="mx-auto grid max-w-[1160px] grid-cols-1 gap-12 px-6 pb-20 pt-20 lg:grid-cols-[minmax(0,1fr)_260px]">
            <div className="mx-auto flex w-full max-w-[720px] flex-col gap-6">
            <Link href="/blog" className="self-start text-[15px] font-semibold text-muted-dark hover:text-white">
              ← All posts
            </Link>
            <span className="self-start rounded-full bg-brand/15 px-3 py-1 text-[13px] font-semibold text-brand">{post.category}</span>
            <h1 className="font-display text-[clamp(34px,4.6vw,58px)] font-bold leading-[1.08] tracking-[-1.2px]">{post.title}</h1>
            <p className="text-xl leading-relaxed text-muted-dark">{post.description}</p>
            <p className="text-[15px] text-muted-dark">
              {site.name} team · {formatDate(post.date)} · {post.readingMinutes} min read
            </p>
            </div>
            <PostCover category={post.category} className="hidden aspect-square self-end rounded-[28px] lg:block" />
          </div>
        </header>

        <div className="mx-auto grid max-w-[1160px] grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="prose-nv mx-auto w-full max-w-[720px]" dangerouslySetInnerHTML={{ __html: post.html }} />

          <aside className="hidden flex-col gap-6 lg:sticky lg:top-28 lg:flex lg:self-start">
            {post.headings.length > 1 && (
              <nav aria-label="On this page" className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-gray-500">On this page</p>
                {post.headings.map((h) => (
                  <a key={h.id} href={`#${h.id}`} className="text-[15px] leading-snug text-gray-700 hover:text-brand-dark">
                    {h.text}
                  </a>
                ))}
              </nav>
            )}
            <div className="flex flex-col gap-3 rounded-[22px] bg-ink p-6 text-white">
              <p className="font-display text-lg font-semibold">How visible is your business?</p>
              <p className="text-[15px] text-muted-dark">Get a free score out of 100 in about 30 seconds.</p>
              <Link href="/check" className="self-start rounded-full bg-brand px-5 py-2.5 text-[15px] font-semibold text-ink">
                Get my score
              </Link>
            </div>
          </aside>
        </div>
      </article>

      <section className="mx-auto max-w-[1240px] px-6">
        <div className="flex flex-col items-center gap-4 rounded-[36px] bg-brand-wash px-6 py-14 text-center">
          <h2 className="max-w-[640px] font-display text-[clamp(26px,3.4vw,40px)] font-bold leading-tight">Want us to do this for you?</h2>
          <p className="max-w-[520px] text-lg text-gray-700">Start with your free Visibility Score. We will show you exactly what to fix first.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/check" className="rounded-full bg-brand px-7 py-4 font-semibold text-ink transition-transform hover:-translate-y-0.5">
              Get your free Visibility Score
            </Link>
            <Link href="/pricing" className="rounded-full border border-[#111111] px-7 py-4 font-semibold hover:bg-[#111111] hover:text-white">
              See plans
            </Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto flex max-w-[1240px] flex-col gap-8 px-6 py-24">
          <h2 className="font-display text-[30px] font-bold">Keep reading</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
