import Link from "next/link";
import { formatDate, type PostMeta } from "@/lib/blog";
import { PostCover } from "./PostCover";

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-gray-200 bg-white transition-all hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(17,17,17,0.3)]"
    >
      <PostCover category={post.category} className="aspect-[5/3] transition-transform duration-500 group-hover:scale-[1.02]" />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center gap-2 text-[0.8125rem]">
          <span className="font-semibold text-brand-dark">{post.category}</span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-500">{post.readingMinutes} min read</span>
        </div>
        <h3 className="font-display text-[1.3125rem] font-bold leading-snug tracking-[-0.3px] group-hover:text-brand-dark">{post.title}</h3>
        <p className="line-clamp-3 text-[0.9375rem] leading-relaxed text-gray-600">{post.description}</p>
        <span className="mt-auto pt-3 text-[0.8125rem] text-gray-400">{formatDate(post.date)}</span>
      </div>
    </Link>
  );
}

export function FeaturedPost({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid grid-cols-1 overflow-hidden rounded-[32px] border border-line-dark bg-ink-soft transition-colors hover:border-brand/60 lg:grid-cols-2"
    >
      <PostCover category={post.category} className="aspect-[5/3] lg:aspect-auto lg:min-h-[23.75rem]" />
      <div className="flex flex-col justify-center gap-5 p-8 md:p-12">
        <div className="flex items-center gap-2 text-[0.875rem]">
          <span className="rounded-full bg-brand px-3 py-1 font-semibold text-ink">Featured</span>
          <span className="font-semibold text-brand">{post.category}</span>
        </div>
        <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.8px] text-white">{post.title}</h2>
        <p className="text-lg leading-relaxed text-muted-dark">{post.description}</p>
        <div className="mt-2 flex items-center justify-between gap-4 text-[0.9375rem]">
          <span className="text-muted-dark">
            {formatDate(post.date)} · {post.readingMinutes} min read
          </span>
          <span className="font-semibold text-brand transition-transform group-hover:translate-x-1">Read article →</span>
        </div>
      </div>
    </Link>
  );
}
