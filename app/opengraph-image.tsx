import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "NearbyVisible – Get found online";

export default function Image() {
  return ogImage({ eyebrow: "Digital growth for your business", title: "Good work deserves to be", accent: "found." });
}
