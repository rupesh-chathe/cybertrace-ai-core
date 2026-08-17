import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { EmptyState, SectionCard, StatusBadge } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { useDatabase } from "@/lib/store";
import { formatDate } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({
    meta: [
      { title: "Forensic Reports | CYBERTRACE AI" },
      { name: "description", content: "Generate, review and export court-ready digital forensic investigation reports." },
      { property: "og:title", content: "Forensic Reports | CYBERTRACE AI" },
      { property: "og:description", content: "Generate and export court-ready forensic investigation reports." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const db = useDatabase();
  const reports = [...db.reports].sort((a, b) => b.generatedAt.localeCompare(a.generatedAt));

  return (
    <SectionCard title="Forensic Reports" description={`${reports.length} report(s) generated`}>
      {reports.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[11px] tracking-wide text-muted-foreground uppercase">
              <tr className="border-b border-border">
                <th className="py-2 pr-4">Report ID</th>
                <th className="py-2 pr-4">Case</th>
                <th className="py-2 pr-4">Risk</th>
                <th className="py-2 pr-4">Artifacts</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Generated</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-b border-border/60 hover:bg-surface-2/50">
                  <td className="py-2.5 pr-4 font-mono text-xs">{r.id}</td>
                  <td className="py-2.5 pr-4 font-mono text-xs">{r.caseId}</td>
                  <td className="py-2.5 pr-4">{r.riskLevel}</td>
                  <td className="py-2.5 pr-4 tabular-nums">{r.evidenceCount}</td>
                  <td className="py-2.5 pr-4"><StatusBadge status={r.status} /></td>
                  <td className="py-2.5 pr-4 text-xs text-muted-foreground">{formatDate(r.generatedAt)}</td>
                  <td className="py-2.5 text-right">
                    <Button asChild size="sm" variant="ghost">
                      <Link to="/cases/$id/report" params={{ id: r.caseId }}>Open</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No reports generated"
          message="Open a case and generate a forensic report to see it listed here."
          icon={FileText}
        >
          <Button asChild><Link to="/cases">Go to cases</Link></Button>
        </EmptyState>
      )}
    </SectionCard>
  );
}
