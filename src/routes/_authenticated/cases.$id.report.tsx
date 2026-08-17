import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText, Loader2, Printer } from "lucide-react";
import { toast } from "sonner";
import { ReportPreview } from "@/components/report-preview";
import { SectionCard } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/cases/$id/report")({
  component: CaseReport,
});

function CaseReport() {
  const { id } = Route.useParams();
  const [loading, setLoading] = useState(false);

  return (
    <SectionCard
      title="Forensic Report"
      description="Structured investigation report for review and export."
      action={
        <div className="no-print flex gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              setLoading(true);
              const r = await api.generateReport(id);
              setLoading(false);
              toast.success("Report generated", { description: `${r.id} · ${r.evidenceCount} artifacts` });
            }}
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
            Generate Forensic Report
          </Button>
          <Button onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </div>
      }
    >
      <p className="no-print mb-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Download className="h-3.5 w-3.5" />
        Use "Download PDF" to export the print-ready report through your browser's print dialog.
      </p>
      <ReportPreview caseId={id} />
    </SectionCard>
  );
}
