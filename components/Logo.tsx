import Image from "next/image";
import clsx from "clsx";

export function Logo({ dark = false, size = 34 }: { dark?: boolean; size?: number }) {
  return (
    <span className="flex items-center gap-2.5">
      <Image src="/logo-icon.svg" alt="" width={size} height={size} priority />
      <span className={clsx("font-display text-xl font-bold", dark ? "text-white" : "text-[#111111]")}>
        Nearby<span className={dark ? "text-brand" : "text-brand-dark"}>Visible</span>
      </span>
    </span>
  );
}
