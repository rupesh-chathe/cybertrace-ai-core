import { createFileRoute } from "@tanstack/react-router";
import { EvidenceTable } from "@/components/evidence-table";
import { EvidenceUploader } from "@/components/evidence-uploader";
import { SectionCard } from "@/components/ui-kit";
import { useDatabase } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/cases/$id/evidence")({
  component: CaseEvidence,
});

function CaseEvidence() {
  const { id } = Route.useParams();
  const db = useDatabase();
  const items = db.evidence
    .filter((e) => e.caseId === id)
    .sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div className="space-y-6">
      <SectionCard
        title="Evidence Intake"
        description="Artifacts are hashed with SHA-256 and triaged automatically on import."
      >
        <EvidenceUploader caseId={id} />
      </SectionCard>
      <SectionCard title="Case Evidence" description={`${items.length} artifact(s) in ${id}`}>
        <EvidenceTable items={items} showCase={false} />
      </SectionCard>
    </div>
  );
}
