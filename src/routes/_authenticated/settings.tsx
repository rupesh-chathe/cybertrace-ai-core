import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Database, RefreshCw, ShieldCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SectionCard, SecurityNotice } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { api, useCurrentUser, useDatabase } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings | CYBERTRACE AI" },
      { name: "description", content: "Manage investigator profile, demo dataset and forensic workspace configuration." },
      { property: "og:title", content: "Settings | CYBERTRACE AI" },
      { property: "og:description", content: "Manage investigator profile and forensic workspace configuration." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const user = useCurrentUser();
  const db = useDatabase();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <SectionCard title="Investigator Profile" description="Identity attached to every audit entry">
        <dl className="grid gap-3 text-sm">
          {(
            [
              ["Name", user?.name ?? "—"],
              ["Email", user?.email ?? "—"],
              ["Role", user?.role ?? "—"],
              ["Badge", user?.badge ?? "—"],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between border-b border-border/60 pb-2">
              <dt className="text-muted-foreground">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <Button
          className="mt-4"
          variant="outline"
          onClick={async () => {
            await api.logout();
            navigate({ to: "/login", replace: true });
          }}
        >
          Sign out
        </Button>
      </SectionCard>

      <SectionCard title="Workspace Data" description="Local forensic workspace state">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          {(
            [
              ["Cases", db.cases.length],
              ["Evidence", db.evidence.length],
              ["Analyses", db.analyses.length],
              ["Audit entries", db.audit.length],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="rounded-lg border border-border bg-surface-2/40 p-3">
              <p className="text-[11px] tracking-wide text-muted-foreground uppercase">{k}</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">{v}</p>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              await api.loadDemoData();
              setBusy(false);
              toast.success("Demo dataset loaded");
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Load Demo Data
          </Button>
          <Button
            variant="outline"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              await api.clearWorkspace();
              setBusy(false);
              toast.success("Workspace cleared");
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Clear Workspace
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Integrity & Security" description="Platform safeguards">
        <ul className="space-y-2 text-sm">
          {[
            "SHA-256 hashing computed in-browser at import time",
            "Append-only audit trail for chain of custody",
            "Session-scoped workspace isolation",
            "AI output labelled assistive, never determinative",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-risk-low" />
              <span className="text-muted-foreground">{t}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <SecurityNotice>
            This build stores the workspace locally in the browser for demonstration purposes.
          </SecurityNotice>
        </div>
      </SectionCard>

      <SectionCard title="System Status" description="Runtime components">
        <ul className="space-y-2 text-sm">
          {[
            ["Hashing engine", "Operational"],
            ["Analysis pipeline", "Operational"],
            ["Report generator", "Operational"],
            ["Local datastore", "Operational"],
          ].map(([k, v]) => (
            <li key={k} className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Database className="h-4 w-4" /> {k}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-risk-low">
                <span className="h-1.5 w-1.5 rounded-full bg-risk-low" /> {v}
              </span>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
