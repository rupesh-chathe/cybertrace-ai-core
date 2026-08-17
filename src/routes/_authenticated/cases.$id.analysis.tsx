import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain } from "lucide-react";
import { EmptyState, RiskBadge, SectionCard } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { useDatabase } from "@/lib/store";
import { formatDate, riskLevel } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/cases/$id/analysis")({
  component: CaseAnalysis,
});

function CaseAnalysis() {
  const { id } = Route.useParams();
  const db = useDatabase();
  const items = db.evidence.filter((e) => e.caseId === id);
  const analyses = db.analyses
    .filter((a) => items.some((e) => e.id === a.evidenceId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <SectionCard
      title="AI-Assisted Analysis"
      description="Automated output is assistive and requires investigator confirmation."
    >
      {analyses.length ? (
        <ul className="space-y-4">
          {analyses.map((a) => {
            const e = items.find((x) => x.id === a.evidenceId)!;
            return (
              <li key={a.id} className="rounded-lg border border-border bg-surface-2/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link
                    to="/evidence/$id"
                    params={{ id: e.id }}
                    className="text-sm font-medium hover:text-primary"
                  >
                    {e.filename}
                  </Link>
                  <RiskBadge level={riskLevel(e.riskScore)} score={e.riskScore} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{a.summary}</p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {a.indicators.map((i) => (
                    <li
                      key={i}
                      className="rounded-md border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {i}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-[11px] text-primary">{a.recommendation}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{formatDate(a.createdAt)}</p>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState
          title="No analysis available"
          message="Import evidence into this case to generate automated analysis output."
          icon={Brain}
        >
          <Button asChild>
            <Link to="/cases/$id/evidence" params={{ id }}>
              Upload Evidence
            </Link>
          </Button>
        </EmptyState>
      )}
    </SectionCard>
  );
}
