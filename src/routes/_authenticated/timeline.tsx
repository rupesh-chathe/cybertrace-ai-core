import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SectionCard } from "@/components/ui-kit";
import { Timeline } from "@/components/timeline";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDatabase } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/timeline")({
  head: () => ({
    meta: [
      { title: "Investigation Timeline | CYBERTRACE AI" },
      { name: "description", content: "Chronological reconstruction of forensic investigation events across all active cases." },
      { property: "og:title", content: "Investigation Timeline | CYBERTRACE AI" },
      { property: "og:description", content: "Chronological reconstruction of forensic investigation events." },
    ],
  }),
  component: GlobalTimeline,
});

function GlobalTimeline() {
  const db = useDatabase();
  const [caseId, setCaseId] = useState("ALL");
  const events = db.timeline.filter((t) => caseId === "ALL" || t.caseId === caseId);

  return (
    <SectionCard
      title="Investigation Timeline"
      description="Chronological reconstruction of recorded investigative events"
      action={
        <Select value={caseId} onValueChange={setCaseId}>
          <SelectTrigger className="w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All cases</SelectItem>
            {db.cases.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.id} · {c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    >
      <Timeline events={events} />
    </SectionCard>
  );
}
