import { getPost } from "@/lib/blog";
import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "NearbyVisible blog post";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  return ogImage({ eyebrow: post ? `Blog · ${post.category}` : "Blog", title: post?.title ?? "Guides to get found and get chosen." });
}
