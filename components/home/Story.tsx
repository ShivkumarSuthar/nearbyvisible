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
      <section className="mx-auto flex max-w-[77.5rem] flex-col gap-5 px-6 pb-4 pt-32">
        <Reveal className="flex flex-col gap-5">
          <p className="text-[0.9375rem] font-semibold tracking-wide text-brand-dark">A story we see every week</p>
          <h2 className="max-w-[53.75rem] font-display text-[clamp(2.25rem,4.4vw,3.5rem)] font-bold leading-[1.1] tracking-[-1px]">
            Meet Ramesh. He is not a real person. <span className="text-brand-dark">His problem is.</span>
          </h2>
        </Reveal>
      </section>

      <Chapter number="01" title="Twelve years of good work. Zero online." visual={<ProfileCard />}>
        <p>
          Ramesh is the plumber people recommend. Old customers save his number and call him again. But every new job
          depends on someone remembering to pass that number on.
        </p>
      </Chapter>

      <Chapter
        number="02"
        title="9 pm. A pipe bursts two streets away."
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
          Water on the kitchen floor. Nobody in that house knows Ramesh, so they open Google and type “plumber near me”.
        </p>
        <p>
          They call the first name with photos and reviews. Ramesh was closer and better. He never even knew this job
          existed.
        </p>
      </Chapter>

      <Chapter
        number="03"
        title="Same Ramesh. Now he is the first call."
        tone="dark"
        visualFirst
        visual={
          <SearchCard
            id="search-after"
            featured={{ name: "Ramesh Plumbing", detail: "Open now, real reviews, website" }}
            results={competitors.slice(0, 2)}
          />
        }
      >
        <p>
          A complete Google profile, a correct Maps pin, reviews from the customers who already loved him, and a WhatsApp
          that answers when he is busy.
        </p>
        <p>His work did not change. Whether people could find it did.</p>
        <p className="font-display text-2xl font-semibold text-brand">Your customers are searching tonight too.</p>
      </Chapter>
    </div>
  );
}

function ProfileCard() {
  return (
    <div className="flex w-full max-w-[26.25rem] flex-col gap-5 rounded-[28px] border border-gray-200 bg-white p-8 shadow-[0_24px_48px_-24px_rgba(17,17,17,0.18)]">
      <div className="flex items-center gap-4">
        <span className="flex size-16 items-center justify-center rounded-full bg-gray-100 font-display text-2xl font-semibold text-gray-700">
          R
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-[1.1875rem] font-semibold">Ramesh Plumbing</span>
          <span className="text-[0.9375rem] text-gray-600">Happy customers: many</span>
        </div>
      </div>
      <ul className="flex flex-col gap-2.5 border-t border-gray-200 pt-[18px] text-base text-gray-700">
        <li className="flex justify-between"><span>Google profile</span><span className="font-semibold text-red-600">None</span></li>
        <li className="flex justify-between"><span>Reviews online</span><span className="font-semibold text-red-600">0</span></li>
        <li className="flex justify-between"><span>Website</span><span className="font-semibold text-red-600">None</span></li>
        <li className="flex justify-between"><span>New customers from search</span><span className="font-semibold text-red-600">0</span></li>
      </ul>
    </div>
  );
}
