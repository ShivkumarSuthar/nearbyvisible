import { site } from "@/lib/site";

const icons: Record<keyof typeof site.social, { label: string; path: React.ReactNode }> = {
  instagram: { label: "Instagram", path: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" /></> },
  facebook: { label: "Facebook", path: <path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2z" /> },
  youtube: { label: "YouTube", path: <><rect x="2" y="5" width="20" height="14" rx="4" /><path d="m10 9 5 3-5 3z" /></> },
  linkedin: { label: "LinkedIn", path: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" /></> },
  googleProfile: { label: "Google profile", path: <><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></> },
};

/** Shows only the networks that have a link in lib/site.ts. */
export function SocialLinks() {
  const entries = (Object.keys(icons) as (keyof typeof icons)[]).filter((k) => site.social[k]);
  if (!entries.length) return null;
  return (
    <div className="flex flex-wrap gap-2.5">
      {entries.map((k) => (
        <a
          key={k}
          href={site.social[k]}
          aria-label={icons[k].label}
          target="_blank"
          rel="noopener noreferrer"
          className="flex size-11 items-center justify-center rounded-full border border-edge-dark text-white transition-colors hover:border-brand hover:text-brand"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {icons[k].path}
          </svg>
        </a>
      ))}
    </div>
  );
}
