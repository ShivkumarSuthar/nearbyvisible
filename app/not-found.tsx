import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bg-ink text-white">
      <div className="mx-auto flex max-w-[77.5rem] flex-col items-center gap-6 px-6 py-40 text-center">
        <Image src="/logo-icon.svg" alt="" width={96} height={96} />
        <p className="font-display text-xl font-bold text-brand">404</p>
        <h1 className="font-display text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.1]">This page could not be found.</h1>
        <p className="max-w-[32.5rem] text-[1.1875rem] text-muted-dark">Unlike your business, which we can help people find.</p>
        <Link href="/" className="mt-2 rounded-full bg-brand px-7 py-4 text-[1.0625rem] font-semibold text-ink">
          Back to home
        </Link>
      </div>
    </section>
  );
}
