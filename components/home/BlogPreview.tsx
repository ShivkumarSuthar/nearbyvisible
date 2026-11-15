import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { PostCard } from "@/components/blog/PostCard";
import { getAllPosts } from "@/lib/blog";

export function BlogPreview() {
  const posts = getAllPosts().slice(0, 3);
  if (!posts.length) return null;
  return (
    <section className="bg-mist">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-12 px-6 py-28">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="flex flex-col gap-4">
            <p className="text-[15px] font-semibold tracking-wide text-brand-dark">From the blog</p>
            <h2 className="max-w-[640px] font-display text-[clamp(32px,3.6vw,46px)] font-bold leading-[1.08] tracking-[-1.2px]">
              Free guides to <span className="text-gray-400">get found online.</span>
            </h2>
          </div>
          <Link href="/blog" className="self-start rounded-full border border-gray-300 bg-white px-6 py-3 font-semibold transition-colors hover:border-[#111111] md:self-auto">
            All articles →
          </Link>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
