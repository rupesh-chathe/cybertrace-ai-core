import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Brain, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Timeline } from "@/components/timeline";
import {
  EmptyState,
  IntegrityBadge,
  RiskScore,
  SectionCard,
  SecurityNotice,
} from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { api, useDatabase } from "@/lib/store";
import { formatBytes, formatDate } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/evidence/$id")({
  component: EvidenceDetail,
});

function EvidenceDetail() {
  const { id } = Route.useParams();
  const db = useDatabase();
  const [busy, setBusy] = useState<"verify" | "analyze" | null>(null);
  const e = db.evidence.find((x) => x.id === id);

  if (!e) {
    return (
      <EmptyState
        title="Evidence not found"
        message="This artifact may have been removed or the workspace was cleared."
        icon={ShieldCheck}
      >
        <Button asChild>
          <Link to="/evidence">Back to evidence</Link>
        </Button>
      </EmptyState>
    );
  }

  const analysis = db.analyses.find((a) => a.evidenceId === e.id);
  const events = db.timeline.filter((t) => t.evidenceId === e.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            to="/evidence"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Evidence Explorer
          </Link>
          <h1 className="mt-1 text-xl font-semibold">{e.filename}</h1>
          <p className="text-xs text-muted-foreground">
            {e.id} · <Link to="/cases/$id" params={{ id: e.caseId }} className="hover:text-primary">{e.caseId}</Link>
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={busy !== null}
            onClick={async () => {
              setBusy("verify");
              const ok = await api.verifyIntegrity(e.id);
              setBusy(null);
              toast[ok ? "success" : "error"](ok ? "Integrity verified" : "Integrity check failed");
            }}
          >
            {busy === "verify" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
            Verify Integrity
          </Button>
          <Button
            disabled={busy !== null}
            onClick={async () => {
              setBusy("analyze");
              await api.runAnalysis(e.id);
              setBusy(null);
              toast.success("Analysis complete");
            }}
          >
            {busy === "analyze" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
            Re-run Analysis
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <SectionCard title="Artifact Metadata" description="Recorded at time of import">
          <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            {(
              [
                ["Type", e.type],
                ["Size", formatBytes(e.sizeBytes)],
                ["Case", e.caseId],
                ["Uploaded at", formatDate(e.uploadedAt)],
                ["Analysis", e.analysisStatus],
              ] as const
            ).map(([k, v]) => (
              <div key={k}>
                <dt className="text-[11px] tracking-wide text-muted-foreground uppercase">{k}</dt>
                <dd className="mt-0.5">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 rounded-lg border border-border bg-surface-2/50 p-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
                SHA-256 Hash
              </p>
              <IntegrityBadge status={e.integrity} />
            </div>
            <p className="mono-hash mt-1 break-all">{e.sha256}</p>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Recorded {formatDate(e.uploadedAt)} · chain of custody preserved
            </p>
          </div>
        </SectionCard>

        <SectionCard title="Risk Assessment" description="Automated triage score">
          <div className="flex flex-col items-center gap-3">
            <RiskScore score={e.riskScore} />
            <SecurityNotice>
              Flagged as a potentially suspicious artifact requiring investigator review. This score
              is assistive and is not a determination of wrongdoing.
            </SecurityNotice>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="AI-Assisted Analysis" description="Model-generated observations">
          {analysis ? (
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">{analysis.summary}</p>
              <ul className="space-y-1.5">
                {analysis.indicators.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-risk-medium" />
                    {i}
                  </li>
                ))}
              </ul>
              <p className="rounded-md border border-primary/30 bg-primary/10 p-3 text-xs text-primary">
                {analysis.recommendation}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {analysis.riskExplanation} · {formatDate(analysis.createdAt)}
              </p>
            </div>
          ) : (
            <EmptyState title="No analysis" message="Run analysis to generate observations." icon={Brain} />
          )}
        </SectionCard>
        <SectionCard title="Artifact Timeline" description="Events referencing this artifact">
          <Timeline events={events} />
        </SectionCard>
      </div>
    </div>
  );
}
