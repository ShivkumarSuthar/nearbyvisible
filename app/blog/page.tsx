import type { Metadata } from "next";
import Link from "next/link";
import { FeaturedPost, PostCard } from "@/components/blog/PostCard";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Practical guides to get your business found on Google, win more reviews and turn searches into customers.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const all = getAllPosts();
  const categories = [...new Set(all.map((p) => p.category))];
  const posts = category ? all.filter((p) => p.category === category) : all;
  const featured = category ? undefined : (posts.find((p) => p.featured) ?? posts[0]);
  const rest = posts.filter((p) => p !== featured);

  return (
    <>
      <section className="bg-ink text-white">
        <div className="mx-auto flex max-w-[77.5rem] flex-col gap-12 px-6 pb-20 pt-20">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="flex max-w-[42.5rem] flex-col gap-5">
              <p className="text-[0.9375rem] font-semibold tracking-wide text-brand">The NearbyVisible blog</p>
              <h1 className="font-display text-[clamp(2.375rem,5vw,4rem)] font-bold leading-[1.04] tracking-[-1.5px]">
                Guides to get found <span className="text-brand">and get chosen.</span>
              </h1>
              <p className="text-lg leading-relaxed text-muted-dark">Plain-language advice for business owners. No jargon, no tricks, just what works.</p>
            </div>
            {categories.length > 1 && (
              <nav aria-label="Categories" className="flex flex-wrap gap-2">
                <Chip href="/blog" active={!category}>
                  All posts
                </Chip>
                {categories.map((c) => (
                  <Chip key={c} href={`/blog?category=${encodeURIComponent(c)}`} active={category === c}>
                    {c}
                  </Chip>
                ))}
              </nav>
            )}
          </div>
          {featured && <FeaturedPost post={featured} />}
        </div>
      </section>

      <section className="mx-auto flex max-w-[77.5rem] flex-col gap-10 px-6 py-20">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-[1.75rem] font-bold tracking-[-0.5px]">{category ? category : "Latest articles"}</h2>
          <span className="text-[0.9375rem] text-gray-500">
            {posts.length} {posts.length === 1 ? "article" : "articles"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
          <CheckCard />
        </div>
      </section>
    </>
  );
}

/** Fills the grid and turns readers into leads. */
function CheckCard() {
  return (
    <div className="relative flex h-full min-h-[23.75rem] flex-col justify-between overflow-hidden rounded-[28px] bg-brand p-8 text-ink">
      <div className="absolute -bottom-20 -right-20 size-64 rounded-full border-[28px] border-ink/10" aria-hidden />
      <div className="relative flex flex-col gap-4">
        <span className="self-start rounded-full bg-ink px-3 py-1 text-[0.8125rem] font-semibold text-brand">Free tool</span>
        <h3 className="font-display text-[1.75rem] font-bold leading-tight tracking-[-0.5px]">How visible is your business right now?</h3>
        <p className="text-[1rem] leading-relaxed text-ink/75">Get a score out of 100 with proof for every point, in about 30 seconds.</p>
      </div>
      <Link href="/check" className="relative self-start rounded-full bg-ink px-6 py-3.5 font-semibold text-white transition-transform hover:-translate-y-0.5">
        Get your free Visibility Score →
      </Link>
    </div>
  );
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-full border px-4 py-2 text-[0.9375rem] font-semibold transition-colors ${
        active ? "border-brand bg-brand text-ink" : "border-edge-dark text-white hover:border-white"
      }`}
    >
      {children}
    </Link>
  );
}
