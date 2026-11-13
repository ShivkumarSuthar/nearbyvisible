import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bg-ink text-white">
      <div className="mx-auto flex max-w-[1240px] flex-col items-center gap-6 px-6 py-40 text-center">
        <Image src="/logo-icon.svg" alt="" width={96} height={96} />
        <p className="font-display text-xl font-bold text-brand">404</p>
        <h1 className="font-display text-[clamp(36px,5vw,60px)] font-bold leading-[1.1]">This page could not be found.</h1>
        <p className="max-w-[520px] text-[19px] text-muted-dark">Unlike your business, which we can help people find.</p>
        <Link href="/" className="mt-2 rounded-full bg-brand px-7 py-4 text-[17px] font-semibold text-ink">
          Back to home
        </Link>
      </div>
    </section>
  );
}
