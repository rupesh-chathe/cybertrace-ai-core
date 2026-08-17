import { createFileRoute } from "@tanstack/react-router";
import { SectionCard } from "@/components/ui-kit";
import { Timeline } from "@/components/timeline";
import { useDatabase } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/cases/$id/timeline")({
  component: CaseTimeline,
});

function CaseTimeline() {
  const { id } = Route.useParams();
  const db = useDatabase();
  return (
    <SectionCard title="Case Timeline" description="Reconstructed sequence of recorded events">
      <Timeline events={db.timeline.filter((t) => t.caseId === id)} />
    </SectionCard>
  );
}
