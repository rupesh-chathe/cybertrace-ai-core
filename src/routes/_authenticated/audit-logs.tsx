import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ScrollText, Search } from "lucide-react";
import { EmptyState, SectionCard } from "@/components/ui-kit";
import { Input } from "@/components/ui/input";
import { useDatabase } from "@/lib/store";
import { formatDate } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/audit-logs")({
  head: () => ({
    meta: [
      { title: "Audit Logs | CYBERTRACE AI" },
      { name: "description", content: "Immutable chain-of-custody audit trail of every action performed in the forensic workspace." },
      { property: "og:title", content: "Audit Logs | CYBERTRACE AI" },
      { property: "og:description", content: "Immutable chain-of-custody audit trail for forensic actions." },
    ],
  }),
  component: AuditLogsPage,
});

function AuditLogsPage() {
  const db = useDatabase();
  const [q, setQ] = useState("");
  const logs = db.audit
    .filter((a) => `${a.user} ${a.action} ${a.resource} ${a.details}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return (
    <SectionCard
      title="Audit Trail"
      description="Append-only record supporting chain of custody"
      action={
        <div className="relative w-[260px]">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search audit entries" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      }
    >
      {logs.length ? (
        <ul className="divide-y divide-border/60">
          {logs.map((a) => (
            <li key={a.id} className="flex flex-wrap items-start gap-x-4 gap-y-1 py-2.5 text-sm">
              <span className="w-40 shrink-0 font-mono text-[11px] text-muted-foreground">
                {formatDate(a.timestamp)}
              </span>
              <span className="rounded-md border border-border px-2 py-0.5 text-[11px]">{a.action}</span>
              <span className="font-mono text-xs text-primary">{a.resource}</span>
              <span className="flex-1 text-xs text-muted-foreground">{a.details}</span>
              <span className="text-[11px] text-muted-foreground">{a.user}</span>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No audit entries" message="Actions performed in the workspace are recorded here." icon={ScrollText} />
      )}
    </SectionCard>
  );
}
