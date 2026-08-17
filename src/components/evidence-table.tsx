import { Link } from "@tanstack/react-router";
import { FileSearch } from "lucide-react";
import type { Evidence } from "@/lib/types";
import { formatBytes, formatDate, riskLevel } from "@/lib/types";
import { EmptyState, IntegrityBadge, RiskBadge, StatusBadge } from "./ui-kit";
import { Button } from "@/components/ui/button";

export function EvidenceTable({
  items,
  emptyAction,
  showCase = true,
}: {
  items: Evidence[];
  emptyAction?: React.ReactNode;
  showCase?: boolean;
}) {
  if (!items.length) {
    return (
      <EmptyState
        title="No evidence found"
        message="Import artifacts into an investigation or adjust your filters to see results."
        icon={FileSearch}
      >
        {emptyAction}
      </EmptyState>
    );
  }
  return (
    <div className="-mx-5 overflow-x-auto px-5">
      <table className="w-full min-w-[880px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
            <th className="py-2 pr-3 font-medium">Evidence ID</th>
            <th className="py-2 pr-3 font-medium">Filename</th>
            <th className="py-2 pr-3 font-medium">Type</th>
            {showCase ? <th className="py-2 pr-3 font-medium">Case</th> : null}
            <th className="py-2 pr-3 font-medium">Risk</th>
            <th className="py-2 pr-3 font-medium">Integrity</th>
            <th className="py-2 pr-3 font-medium">Uploaded</th>
            <th className="py-2 pr-3 font-medium">Status</th>
            <th className="py-2 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((e) => (
            <tr key={e.id} className="border-b border-border/60 last:border-0 hover:bg-surface-2/50">
              <td className="py-3 pr-3 font-mono text-xs text-muted-foreground">{e.id}</td>
              <td className="py-3 pr-3">
                <Link
                  to="/evidence/$id"
                  params={{ id: e.id }}
                  className="font-medium hover:text-primary"
                >
                  {e.filename}
                </Link>
                <div className="text-[11px] text-muted-foreground">{formatBytes(e.sizeBytes)}</div>
              </td>
              <td className="py-3 pr-3 text-muted-foreground">{e.type}</td>
              {showCase ? (
                <td className="py-3 pr-3">
                  <Link
                    to="/cases/$id"
                    params={{ id: e.caseId }}
                    className="text-xs text-primary hover:underline"
                  >
                    {e.caseId}
                  </Link>
                </td>
              ) : null}
              <td className="py-3 pr-3">
                <RiskBadge level={riskLevel(e.riskScore)} score={e.riskScore} />
              </td>
              <td className="py-3 pr-3">
                <IntegrityBadge status={e.integrity} />
              </td>
              <td className="py-3 pr-3 text-xs text-muted-foreground">{formatDate(e.uploadedAt)}</td>
              <td className="py-3 pr-3">
                <StatusBadge status={e.analysisStatus} />
              </td>
              <td className="py-3">
                <Button asChild size="sm" variant="outline">
                  <Link to="/evidence/$id" params={{ id: e.id }}>
                    View
                  </Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
