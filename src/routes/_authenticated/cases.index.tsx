import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FolderKanban, Plus, Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DemoDataButton } from "./dashboard";
import { EmptyState, PriorityBadge, SectionCard, StatusBadge } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDatabase } from "@/lib/store";
import { formatDate } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/cases/")({
  head: () => ({
    meta: [
      { title: "Investigation Cases — CyberTrace AI" },
      {
        name: "description",
        content:
          "Search, filter and manage digital forensic investigation cases with priority and status tracking.",
      },
      { property: "og:title", content: "Investigation Cases — CyberTrace AI" },
      { property: "og:description", content: "Manage forensic investigation cases end to end." },
    ],
  }),
  component: CasesPage,
});

const PAGE_SIZE = 8;

function CasesPage() {
  const db = useDatabase();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");
  const [priority, setPriority] = useState("ALL");
  const [sort, setSort] = useState("updated");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const list = db.cases.filter((c) => {
      const matches =
        !q ||
        `${c.id} ${c.title} ${c.investigator} ${c.description}`.toLowerCase().includes(q.toLowerCase());
      return matches && (status === "ALL" || c.status === status) && (priority === "ALL" || c.priority === priority);
    });
    const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 } as const;
    return list.sort((a, b) =>
      sort === "priority"
        ? order[a.priority] - order[b.priority]
        : sort === "title"
          ? a.title.localeCompare(b.title)
          : b.updatedAt.localeCompare(a.updatedAt),
    );
  }, [db.cases, q, status, priority, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <AppShell
      title="Investigation Cases"
      subtitle="Track, prioritize and manage active forensic investigations."
      actions={
        <Button asChild>
          <Link to="/cases/new">
            <Plus className="mr-2 h-4 w-4" /> Create Investigation
          </Link>
        </Button>
      }
    >
      <SectionCard title="All Cases" description={`${filtered.length} investigation(s)`}>
        <div className="mb-5 grid gap-3 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search case ID, title or investigator"
              className="pl-9"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {["ALL", "OPEN", "IN PROGRESS", "CLOSED"].map((s) => (
                <SelectItem key={s} value={s}>
                  {s === "ALL" ? "All statuses" : s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {["ALL", "LOW", "MEDIUM", "HIGH", "CRITICAL"].map((p) => (
                  <SelectItem key={p} value={p}>
                    {p === "ALL" ? "All priorities" : p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger>
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">Last updated</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {rows.length ? (
          <>
            <div className="-mx-5 overflow-x-auto px-5">
              <table className="w-full min-w-[880px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
                    <th className="py-2 pr-3 font-medium">Case ID</th>
                    <th className="py-2 pr-3 font-medium">Title</th>
                    <th className="py-2 pr-3 font-medium">Investigator</th>
                    <th className="py-2 pr-3 font-medium">Priority</th>
                    <th className="py-2 pr-3 font-medium">Status</th>
                    <th className="py-2 pr-3 font-medium">Evidence</th>
                    <th className="py-2 pr-3 font-medium">Updated</th>
                    <th className="py-2 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => (
                    <tr key={c.id} className="border-b border-border/60 last:border-0 hover:bg-surface-2/50">
                      <td className="py-3 pr-3 font-mono text-xs text-primary">{c.id}</td>
                      <td className="py-3 pr-3">
                        <Link to="/cases/$id" params={{ id: c.id }} className="font-medium hover:text-primary">
                          {c.title}
                        </Link>
                        <p className="line-clamp-1 max-w-sm text-[11px] text-muted-foreground">
                          {c.description}
                        </p>
                      </td>
                      <td className="py-3 pr-3 text-muted-foreground">{c.investigator}</td>
                      <td className="py-3 pr-3">
                        <PriorityBadge priority={c.priority} />
                      </td>
                      <td className="py-3 pr-3">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="py-3 pr-3 tabular-nums">
                        {db.evidence.filter((e) => e.caseId === c.id).length}
                      </td>
                      <td className="py-3 pr-3 text-xs text-muted-foreground">{formatDate(c.updatedAt)}</td>
                      <td className="py-3">
                        <Button asChild size="sm" variant="outline">
                          <Link to="/cases/$id" params={{ id: c.id }}>
                            Open
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Page {current} of {pages}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={current <= 1} onClick={() => setPage(current - 1)}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled={current >= pages} onClick={() => setPage(current + 1)}>
                  Next
                </Button>
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            title="No investigations found"
            message="No case matches the current filters. Create a new investigation or load the demo dataset."
            icon={FolderKanban}
          >
            <Button asChild>
              <Link to="/cases/new">Create Investigation</Link>
            </Button>
            <DemoDataButton label="Load Demo Data" />
          </EmptyState>
        )}
      </SectionCard>
    </AppShell>
  );
}
