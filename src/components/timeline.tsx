import { Link } from "@tanstack/react-router";
import { Activity, FileClock, KeyRound, Network, Server } from "lucide-react";
import type { TimelineEvent } from "@/lib/types";
import { formatDate } from "@/lib/types";
import { RiskBadge, EmptyState } from "./ui-kit";
import { cn } from "@/lib/utils";

const ICONS = {
  Authentication: KeyRound,
  "File Activity": FileClock,
  "System Activity": Server,
  "Network Indicator": Network,
  "Case Activity": Activity,
} as const;

export function Timeline({ events }: { events: TimelineEvent[] }) {
  if (!events.length) {
    return (
      <EmptyState
        title="No timeline events"
        message="Timeline events are generated when evidence is imported, analyzed or flagged."
        icon={Activity}
      />
    );
  }
  const sorted = [...events].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  return (
    <ol className="relative space-y-4 border-l border-border pl-6">
      {sorted.map((e) => {
        const Icon = ICONS[e.category];
        const dot =
          e.risk === "HIGH"
            ? "bg-risk-high/15 text-risk-high ring-risk-high/40"
            : e.risk === "MEDIUM"
              ? "bg-risk-medium/15 text-risk-medium ring-risk-medium/40"
              : "bg-risk-low/15 text-risk-low ring-risk-low/40";
        return (
          <li key={e.id} className="relative">
            <span
              className={cn(
                "absolute top-3 -left-[37px] grid h-6 w-6 place-items-center rounded-full ring-1",
                dot,
              )}
            >
              <Icon className="h-3 w-3" />
            </span>
            <div className="panel p-4 transition-colors hover:border-primary/40">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-primary">
                    {new Date(e.timestamp).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <h3 className="text-sm font-medium">{e.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md border border-border px-2 py-0.5 text-[10px] tracking-wide text-muted-foreground uppercase">
                    {e.category}
                  </span>
                  <RiskBadge level={e.risk} />
                </div>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">{e.description}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                <span>{formatDate(e.timestamp)}</span>
                <Link to="/cases/$id" params={{ id: e.caseId }} className="text-primary hover:underline">
                  {e.caseId}
                </Link>
                {e.evidenceId ? (
                  <Link
                    to="/evidence/$id"
                    params={{ id: e.evidenceId }}
                    className="text-primary hover:underline"
                  >
                    {e.evidenceId}
                  </Link>
                ) : null}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
