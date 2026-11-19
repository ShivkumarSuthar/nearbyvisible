import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuditReport } from "@/components/check/AuditReport";
import { loadReport } from "@/lib/reports";

// Private, per-customer pages: never cached as static, never indexed.
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const saved = await loadReport((await params).id);
  return {
    title: saved ? `Visibility Score: ${saved.report.business.name}` : "Report not found",
    robots: { index: false, follow: false },
  };
}

export default async function SavedReportPage({ params }: Props) {
  const saved = await loadReport((await params).id);
  if (!saved) notFound();
  return (
    <section className="mx-auto w-full max-w-[60rem] px-6 py-16 md:py-20">
      <AuditReport report={saved.report} city={saved.city} category={saved.category} shared />
    </section>
  );
}
