import clsx from "clsx";

type Result = { name: string; detail: string };

type SearchCardProps = {
  id: string;
  results: Result[];
  /** Shows the client's business at the top, highlighted, with action buttons. */
  featured?: Result;
  /** Shows the client's business as missing, at the bottom. */
  missing?: Result;
};

export function SearchCard({ id, results, featured, missing }: SearchCardProps) {
  return (
    <div className="flex w-full max-w-[25rem] flex-col gap-3 rounded-[36px] bg-white p-6 text-[#111111] shadow-[0_24px_48px_-24px_rgba(17,17,17,0.2)]">
      <label htmlFor={id} className="text-[0.8125rem] font-semibold text-gray-600">
        Google search
      </label>
      <input
        id={id}
        type="text"
        value="plumber near me"
        readOnly
        className="rounded-full border border-gray-300 bg-gray-50 px-[18px] py-3.5 text-[1.0625rem]"
      />
      {featured && (
        <div className="flex flex-col gap-3 rounded-[18px] border-2 border-brand bg-brand-wash p-4">
          <div className="flex flex-col gap-1">
            <span className="text-[1.0625rem] font-semibold">{featured.name}</span>
            <span className="text-sm text-gray-700">{featured.detail}</span>
          </div>
          <div className="flex flex-wrap gap-2 text-sm font-semibold">
            <span className="rounded-full bg-brand px-4 py-2.5 text-ink">Call</span>
            <span className="rounded-full border border-[#111111] px-4 py-2">WhatsApp</span>
            <span className="rounded-full border border-[#111111] px-4 py-2">Directions</span>
          </div>
        </div>
      )}
      {results.map((r) => (
        <ResultRow key={r.name} {...r} />
      ))}
      {missing && <ResultRow {...missing} dashed />}
    </div>
  );
}

function ResultRow({ name, detail, dashed }: Result & { dashed?: boolean }) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-1 rounded-[18px] p-4",
        dashed ? "border-2 border-dashed border-gray-400" : "border border-gray-200",
      )}
    >
      <span className={clsx("font-semibold", dashed && "text-gray-600")}>{name}</span>
      <span className="text-sm text-gray-600">{detail}</span>
    </div>
  );
}
