import { Chapter } from "@/components/home/Chapter";
import { Reveal } from "@/components/ui/Reveal";
import { SearchCard } from "@/components/home/SearchCard";

const competitors = [
  { name: "Plumber A", detail: "Photos, reviews, call button" },
  { name: "Plumber B", detail: "Photos, reviews, website" },
  { name: "Plumber C", detail: "Open now, directions" },
];

export function Story() {
  return (
    <div id="story">
      <section className="mx-auto flex max-w-[1240px] flex-col gap-5 px-6 pb-4 pt-32">
        <Reveal className="flex flex-col gap-5">
          <p className="text-[15px] font-semibold tracking-wide text-brand-dark">The story</p>
          <h2 className="max-w-[820px] font-display text-[clamp(36px,4.4vw,56px)] font-bold leading-[1.1] tracking-[-1px]">
            This is Ramesh. His story may sound like yours.
          </h2>
        </Reveal>
      </section>

      <Chapter number="01" title="A good plumber, known by word of mouth." visual={<ProfileCard />}>
        <p>
          Ramesh fixes leaks in Malviya Nagar. His customers trust him and call him again. But new customers only come
          when an old one remembers his number.
        </p>
      </Chapter>

      <Chapter
        number="02"
        title="Someone nearby needed him. They never found him."
        tone="mist"
        visualFirst
        visual={
          <SearchCard
            id="search-before"
            results={competitors}
            missing={{ name: "Ramesh Plumbing", detail: "Not on the list" }}
          />
        }
      >
        <p>
          Two streets away, a family searched “plumber near me”. They called the first name with photos and reviews.
          Ramesh was better and closer, but he was not on the screen.
        </p>
      </Chapter>

      <Chapter number="03" title="Then Ramesh became visible." visual={<BeforeAfter />}>
        <p>
          We set up his Google profile and Maps pin, gave him a simple website and a WhatsApp Business account, and
          helped his happy customers leave reviews.
        </p>
      </Chapter>

      <Chapter
        number="04"
        title="Now, when someone nearby searches, they find Ramesh."
        tone="dark"
        visualFirst
        visual={
          <SearchCard
            id="search-after"
            featured={{ name: "Ramesh Plumbing", detail: "Malviya Nagar, open now, reviews, website" }}
            results={competitors.slice(0, 2)}
          />
        }
      >
        <p>His work did not change. His visibility did. That is what we do for every business we work with.</p>
        <p className="font-display text-2xl font-semibold text-brand">Get found nearby.</p>
      </Chapter>
    </div>
  );
}

function ProfileCard() {
  return (
    <div className="flex w-full max-w-[420px] flex-col gap-5 rounded-[28px] border border-gray-200 bg-white p-8 shadow-[0_24px_48px_-24px_rgba(17,17,17,0.18)]">
      <div className="flex items-center gap-4">
        <span className="flex size-16 items-center justify-center rounded-full bg-gray-100 font-display text-2xl font-semibold text-gray-700">
          R
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-[19px] font-semibold">Ramesh Plumbing</span>
          <span className="text-[15px] text-gray-600">Plumbing services</span>
        </div>
      </div>
      <ul className="flex flex-col gap-2.5 border-t border-gray-200 pt-[18px] text-base text-gray-700">
        <li>Online profile: none</li>
        <li>Reviews: none</li>
        <li>Website: none</li>
      </ul>
    </div>
  );
}

function BeforeAfter() {
  return (
    <div className="grid w-full max-w-[520px] grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-3.5 rounded-3xl bg-mist p-6">
        <span className="text-sm font-semibold text-gray-600">Before</span>
        <ul className="flex flex-col gap-3.5 text-base text-gray-700">
          <li>No Google profile</li>
          <li>No reviews</li>
          <li>No website</li>
          <li>Only word of mouth</li>
        </ul>
      </div>
      <div className="flex flex-col gap-3.5 rounded-3xl bg-ink p-6 text-white">
        <span className="text-sm font-semibold text-brand">After</span>
        <ul className="flex flex-col gap-3.5 text-base">
          <li>Google profile and Maps pin</li>
          <li>Reviews from real customers</li>
          <li>Simple website</li>
          <li>WhatsApp Business</li>
        </ul>
      </div>
    </div>
  );
}
