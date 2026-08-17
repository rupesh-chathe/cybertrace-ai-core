import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Database, ShieldAlert, ShieldCheck } from "lucide-react";
import { EmptyState, SectionCard, StatCard } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { useDatabase } from "@/lib/store";
import { formatDate, riskLevel } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/cases/$id/")({
  component: CaseOverview,
});

function CaseOverview() {
  const { id } = Route.useParams();
  const db = useDatabase();
  const items = db.evidence.filter((e) => e.caseId === id);
  const counts = {
    high: items.filter((e) => riskLevel(e.riskScore) === "HIGH").length,
    medium: items.filter((e) => riskLevel(e.riskScore) === "MEDIUM").length,
    low: items.filter((e) => riskLevel(e.riskScore) === "LOW").length,
  };
  const verified = items.filter((e) => e.integrity === "VERIFIED").length;
  const activity = [
    ...db.timeline.filter((t) => t.caseId === id),
  ]
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Evidence Count" value={items.length} icon={Database} />
        <StatCard label="High Risk" value={counts.high} icon={ShieldAlert} tone="high" />
        <StatCard label="Medium Risk" value={counts.medium} icon={Activity} tone="warn" />
        <StatCard
          label="Integrity Verified"
          value={`${verified}/${items.length}`}
          icon={ShieldCheck}
          tone="good"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Risk Breakdown" description="Automated triage results for this case">
          <div className="space-y-3">
            {(
              [
                ["High risk", counts.high, "bg-risk-high"],
                ["Medium risk", counts.medium, "bg-risk-medium"],
                ["Low risk", counts.low, "bg-risk-low"],
              ] as const
            ).map(([label, value, bar]) => (
              <div key={label}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="tabular-nums">{value}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-surface-2">
                  <div
                    className={`h-2 rounded-full ${bar}`}
                    style={{ width: `${items.length ? (value / items.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
            <p className="pt-2 text-[11px] text-muted-foreground">
              Flagged artifacts are potentially suspicious and require investigator review.
            </p>
          </div>
        </SectionCard>

        <SectionCard
          title="Recent Activity"
          description="Latest recorded events for this investigation"
          action={
            <Button asChild size="sm" variant="ghost">
              <Link to="/cases/$id/timeline" params={{ id }}>
                Full timeline
              </Link>
            </Button>
          }
        >
          {activity.length ? (
            <ul className="space-y-3">
              {activity.map((e) => (
                <li key={e.id} className="flex items-start gap-3 text-sm">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <div>
                    <p className="font-medium">{e.title}</p>
                    <p className="text-xs text-muted-foreground">{e.description}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {formatDate(e.timestamp)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No activity yet"
              message="Import evidence into this case to generate timeline activity."
              icon={Activity}
            >
              <Button asChild>
                <Link to="/cases/$id/evidence" params={{ id }}>
                  Upload Evidence
                </Link>
              </Button>
            </EmptyState>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
