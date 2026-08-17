import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, Cpu, Gauge, ShieldAlert } from "lucide-react";
import { CategoryBars, ChartCard, RiskDonut } from "@/components/charts";
import { EmptyState, RiskBadge, SectionCard, StatCard } from "@/components/ui-kit";
import { useDatabase } from "@/lib/store";
import { formatDate, riskLevel } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/ai-analysis")({
  head: () => ({
    meta: [
      { title: "AI Analysis | CYBERTRACE AI" },
      { name: "description", content: "Assistive machine analysis of digital artifacts with risk scoring, indicators and investigator recommendations." },
      { property: "og:title", content: "AI Analysis | CYBERTRACE AI" },
      { property: "og:description", content: "Assistive machine analysis with risk scoring and indicators." },
    ],
  }),
  component: AiAnalysisPage,
});

function AiAnalysisPage() {
  const db = useDatabase();
  const analyses = [...db.analyses].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const scored = db.evidence;
  const avg = scored.length
    ? Math.round(scored.reduce((s, e) => s + e.riskScore, 0) / scored.length)
    : 0;
  const donut = (["HIGH", "MEDIUM", "LOW"] as const).map((l) => ({
    name: l,
    value: scored.filter((e) => riskLevel(e.riskScore) === l).length,
  }));
  const indicatorCounts = new Map<string, number>();
  analyses.forEach((a) => a.indicators.forEach((i) => indicatorCounts.set(i, (indicatorCounts.get(i) ?? 0) + 1)));
  const bars = [...indicatorCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name: name.length > 22 ? `${name.slice(0, 22)}…` : name, value }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Artifacts Analyzed" value={analyses.length} icon={Cpu} />
        <StatCard label="Average Risk Score" value={avg} icon={Gauge} tone="warn" />
        <StatCard
          label="High Risk Findings"
          value={scored.filter((e) => riskLevel(e.riskScore) === "HIGH").length}
          icon={ShieldAlert}
          tone="high"
        />
        <StatCard label="Detection Rules" value={indicatorCounts.size} icon={Brain} tone="good" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Risk Distribution" description="Across all analyzed artifacts">
          <RiskDonut data={donut} />
        </ChartCard>
        <ChartCard title="Top Indicators" description="Most frequently triggered detections">
          <CategoryBars data={bars} />
        </ChartCard>
      </div>

      <SectionCard
        title="Analysis Findings"
        description="AI output is assistive only — investigator confirmation is required."
      >
        {analyses.length ? (
          <ul className="space-y-3">
            {analyses.map((a) => {
              const e = db.evidence.find((x) => x.id === a.evidenceId);
              if (!e) return null;
              return (
                <li key={a.id} className="rounded-lg border border-border bg-surface-2/40 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link to="/evidence/$id" params={{ id: e.id }} className="text-sm font-medium hover:text-primary">
                      {e.filename}
                    </Link>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground">{e.caseId}</span>
                      <RiskBadge level={riskLevel(e.riskScore)} score={e.riskScore} />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{a.summary}</p>
                  <p className="mt-2 text-[11px] text-primary">{a.recommendation}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{formatDate(a.createdAt)}</p>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState title="No analysis yet" message="Upload evidence or load demo data to populate findings." icon={Brain} />
        )}
      </SectionCard>
    </div>
  );
}
