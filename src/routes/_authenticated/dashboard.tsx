import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Clock,
  Database,
  FolderKanban,
  Loader2,
  Plus,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { ActivityArea, CategoryBars, ChartCard, ProcessingBars, RiskDonut } from "@/components/charts";
import {
  EmptyState,
  IntegrityBadge,
  PriorityBadge,
  RiskBadge,
  SectionCard,
  StatCard,
  StatusBadge,
} from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { api, useDatabase } from "@/lib/store";
import { formatDate, riskLevel } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Investigation Dashboard — CyberTrace AI" },
      {
        name: "description",
        content:
          "Monitor active digital forensic investigations, triage scores and high-risk evidence from one console.",
      },
      { property: "og:title", content: "Investigation Dashboard — CyberTrace AI" },
      {
        property: "og:description",
        content: "Monitor active investigations and prioritize critical evidence.",
      },
    ],
  }),
  component: Dashboard,
});

export function DemoDataButton({ label = "Load Demo Investigation" }: { label?: string }) {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      variant="outline"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await api.loadDemoData();
        setLoading(false);
        toast.success("Demo investigation loaded", {
          description: "3 cases, 21 evidence artifacts, timeline and audit history.",
        });
      }}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
      )}
      {label}
    </Button>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function Dashboard() {
  const db = useDatabase();

  const stats = useMemo(() => {
    const high = db.evidence.filter((e) => e.riskScore > 70);
    return {
      cases: db.cases.length,
      evidence: db.evidence.length,
      high: high.length,
      pending: db.evidence.filter(
        (e) => e.integrity !== "VERIFIED" || e.analysisStatus !== "COMPLETE",
      ).length,
      highItems: high.sort((a, b) => b.riskScore - a.riskScore).slice(0, 6),
    };
  }, [db]);

  const riskData = useMemo(
    () =>
      (["LOW", "MEDIUM", "HIGH"] as const).map((l) => ({
        name: l,
        value: db.evidence.filter((e) => riskLevel(e.riskScore) === l).length,
      })),
    [db.evidence],
  );

  const typeData = useMemo(() => {
    const map: Record<string, number> = {
      Documents: 0,
      Images: 0,
      Logs: 0,
      Archives: 0,
      Other: 0,
    };
    db.evidence.forEach((e) => {
      const key =
        e.type === "Document"
          ? "Documents"
          : e.type === "Image"
            ? "Images"
            : e.type === "Log"
              ? "Logs"
              : e.type === "Archive"
                ? "Archives"
                : "Other";
      map[key] = (map[key] ?? 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [db.evidence]);

  const activityData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(Date.now() - (6 - i) * 86400_000);
      return {
        name: d.toLocaleDateString(undefined, { weekday: "short" }),
        key: d.toISOString().slice(0, 10),
        value: 0,
      };
    });
    db.audit.forEach((a) => {
      const bucket = days.find((d) => d.key === a.timestamp.slice(0, 10));
      if (bucket) bucket.value += 1;
    });
    db.evidence.forEach((e) => {
      const bucket = days.find((d) => d.key === e.uploadedAt.slice(0, 10));
      if (bucket) bucket.value += 1;
    });
    return days.map(({ name, value }) => ({ name, value }));
  }, [db]);

  const processingData = useMemo(
    () => [
      {
        name: "Complete",
        value: db.evidence.filter((e) => e.analysisStatus === "COMPLETE").length,
      },
      {
        name: "Processing",
        value: db.evidence.filter((e) => e.analysisStatus === "PROCESSING").length,
      },
      { name: "Queued", value: db.evidence.filter((e) => e.analysisStatus === "QUEUED").length },
    ],
    [db.evidence],
  );

  const recentCases = [...db.cases]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5);

  const isEmpty = db.cases.length === 0 && db.evidence.length === 0;

  return (
    <AppShell
      title={`${greeting()}, Investigator`}
      subtitle="Monitor active investigations and prioritize critical evidence."
      actions={
        <>
          <DemoDataButton label="Load Demo" />
          <Button asChild>
            <Link to="/cases/new">
              <Plus className="mr-2 h-4 w-4" /> New Case
            </Link>
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="panel relative overflow-hidden p-6">
          <div className="grid-backdrop absolute inset-0 opacity-25" aria-hidden />
          <div className="relative max-w-3xl">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
              CyberTrace AI · Cyber Triage Console
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              CyberTrace AI helps authorized investigators organize digital evidence, identify
              potential risk indicators, reconstruct investigation timelines, and generate
              structured forensic reports.
            </p>
          </div>
        </div>

        {isEmpty ? (
          <EmptyState
            title="No investigations found"
            message="Create your first investigation or load the synthetic demo dataset to explore the full triage workflow."
            icon={FolderKanban}
          >
            <Button asChild>
              <Link to="/cases/new">Create Investigation</Link>
            </Button>
            <DemoDataButton />
          </EmptyState>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Total Cases" value={stats.cases} icon={FolderKanban} hint="Active workspace" />
              <StatCard label="Evidence Files" value={stats.evidence} icon={Database} hint="Imported artifacts" />
              <StatCard label="High Risk" value={stats.high} icon={ShieldAlert} tone="high" hint="Score above 70" />
              <StatCard label="Pending Review" value={stats.pending} icon={Clock} tone="warn" hint="Awaiting investigator" />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <ChartCard title="Risk Distribution" description="Triage scores across all evidence">
                <RiskDonut data={riskData} />
              </ChartCard>
              <ChartCard title="Evidence Type Distribution" description="Artifacts by category">
                <CategoryBars data={typeData} />
              </ChartCard>
              <ChartCard title="Investigation Activity" description="Recorded actions over the last 7 days">
                <ActivityArea data={activityData} />
              </ChartCard>
              <ChartCard title="Evidence Processing Status" description="Automated analysis pipeline">
                <ProcessingBars data={processingData} />
              </ChartCard>
            </div>

            <SectionCard
              title="Recent Cases"
              description="Most recently updated investigations"
              action={
                <Button asChild variant="ghost" size="sm">
                  <Link to="/cases">View all</Link>
                </Button>
              }
            >
              <div className="-mx-5 overflow-x-auto px-5">
                <table className="w-full min-w-[820px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
                      <th className="py-2 pr-3 font-medium">Case ID</th>
                      <th className="py-2 pr-3 font-medium">Case Name</th>
                      <th className="py-2 pr-3 font-medium">Priority</th>
                      <th className="py-2 pr-3 font-medium">Evidence</th>
                      <th className="py-2 pr-3 font-medium">Status</th>
                      <th className="py-2 pr-3 font-medium">Updated</th>
                      <th className="py-2 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentCases.map((c) => (
                      <tr key={c.id} className="border-b border-border/60 last:border-0 hover:bg-surface-2/50">
                        <td className="py-3 pr-3 font-mono text-xs text-primary">{c.id}</td>
                        <td className="py-3 pr-3 font-medium">{c.title}</td>
                        <td className="py-3 pr-3">
                          <PriorityBadge priority={c.priority} />
                        </td>
                        <td className="py-3 pr-3 tabular-nums">
                          {db.evidence.filter((e) => e.caseId === c.id).length}
                        </td>
                        <td className="py-3 pr-3">
                          <StatusBadge status={c.status} />
                        </td>
                        <td className="py-3 pr-3 text-xs text-muted-foreground">
                          {formatDate(c.updatedAt)}
                        </td>
                        <td className="py-3">
                          <Button asChild size="sm" variant="outline">
                            <Link to="/cases/$id" params={{ id: c.id }}>
                              View Case
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            <SectionCard
              title="Recent High-Risk Evidence"
              description="Potentially suspicious artifacts requiring investigator review"
              action={
                <Button asChild variant="ghost" size="sm">
                  <Link to="/evidence">Evidence explorer</Link>
                </Button>
              }
            >
              {stats.highItems.length ? (
                <div className="-mx-5 overflow-x-auto px-5">
                  <table className="w-full min-w-[760px] text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
                        <th className="py-2 pr-3 font-medium">Filename</th>
                        <th className="py-2 pr-3 font-medium">Case</th>
                        <th className="py-2 pr-3 font-medium">Risk</th>
                        <th className="py-2 pr-3 font-medium">Score</th>
                        <th className="py-2 pr-3 font-medium">Integrity</th>
                        <th className="py-2 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.highItems.map((e) => (
                        <tr key={e.id} className="border-b border-border/60 last:border-0 hover:bg-surface-2/50">
                          <td className="py-3 pr-3 font-medium">{e.filename}</td>
                          <td className="py-3 pr-3 font-mono text-xs text-primary">{e.caseId}</td>
                          <td className="py-3 pr-3">
                            <RiskBadge level={riskLevel(e.riskScore)} />
                          </td>
                          <td className="py-3 pr-3 tabular-nums">{e.riskScore}</td>
                          <td className="py-3 pr-3">
                            <IntegrityBadge status={e.integrity} />
                          </td>
                          <td className="py-3">
                            <Button asChild size="sm" variant="outline">
                              <Link to="/evidence/$id" params={{ id: e.id }}>
                                View Evidence
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState
                  title="No high-risk artifacts"
                  message="Automated triage has not flagged any artifact above the high-risk threshold."
                  icon={AlertTriangle}
                />
              )}
            </SectionCard>
          </>
        )}
      </div>
    </AppShell>
  );
}
