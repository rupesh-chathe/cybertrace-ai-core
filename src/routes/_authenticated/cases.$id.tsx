import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, FolderKanban } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { EmptyState, PriorityBadge, StatusBadge } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api, useDatabase } from "@/lib/store";
import { formatDate } from "@/lib/types";
import type { CaseStatus, Priority } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/cases/$id")({
  head: () => ({
    meta: [
      { title: "Case File — CyberTrace AI" },
      {
        name: "description",
        content:
          "Review case evidence, triage results, investigation timeline, notes and forensic report output.",
      },
      { property: "og:title", content: "Case File — CyberTrace AI" },
      { property: "og:description", content: "Digital forensic case file workspace." },
    ],
  }),
  component: CaseLayout,
});

const TABS = [
  { to: "/cases/$id", label: "Overview", exact: true },
  { to: "/cases/$id/evidence", label: "Evidence" },
  { to: "/cases/$id/timeline", label: "Timeline" },
  { to: "/cases/$id/analysis", label: "AI Analysis" },
  { to: "/cases/$id/notes", label: "Notes" },
  { to: "/cases/$id/report", label: "Report" },
] as const;

function CaseLayout() {
  const { id } = Route.useParams();
  const db = useDatabase();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const kase = db.cases.find((c) => c.id === id);

  if (!kase) {
    return (
      <AppShell title="Case not found" subtitle="This investigation is not in the workspace.">
        <EmptyState
          title="Case not found"
          message="The investigation may have been removed, or the workspace has not been loaded on this device."
          icon={FolderKanban}
        >
          <Button asChild>
            <Link to="/cases">Back to cases</Link>
          </Button>
        </EmptyState>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={kase.title}
      subtitle={`${kase.id} · Lead investigator ${kase.investigator}`}
      actions={
        <Button asChild variant="outline">
          <Link to="/cases">
            <ArrowLeft className="mr-2 h-4 w-4" /> Cases
          </Link>
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="panel p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-primary">{kase.id}</span>
                <StatusBadge status={kase.status} />
                <PriorityBadge priority={kase.priority} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{kase.description}</p>
              <p className="mt-3 text-[11px] text-muted-foreground">
                Created {formatDate(kase.createdAt)} · Updated {formatDate(kase.updatedAt)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select
                value={kase.status}
                onValueChange={async (v) => {
                  await api.updateCase(kase.id, { status: v as CaseStatus });
                  toast.success(`Status set to ${v}`);
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["OPEN", "IN PROGRESS", "CLOSED"].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={kase.priority}
                onValueChange={async (v) => {
                  await api.updateCase(kase.id, { priority: v as Priority });
                  toast.success(`Priority set to ${v}`);
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <nav className="flex flex-wrap gap-1 rounded-lg border border-border bg-surface p-1">
          {TABS.map((t) => {
            const href = t.to.replace("$id", id);
            const active = pathname === href;
            return (
              <Link
                key={t.to}
                to={t.to}
                params={{ id }}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
                )}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>

        <Outlet />
      </div>
    </AppShell>
  );
}
