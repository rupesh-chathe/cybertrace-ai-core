import { useRef, useState } from "react";
import { CheckCircle2, FileUp, Loader2, ShieldCheck, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { api } from "@/lib/store";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/types";

const STAGES = [
  "Uploading",
  "Processing",
  "Extracting Metadata",
  "Calculating Hash",
  "Analyzing",
  "Complete",
] as const;

interface Job {
  name: string;
  size: number;
  stage: number;
  hash?: string;
}

export function EvidenceUploader({
  caseId,
  onComplete,
}: {
  caseId: string;
  onComplete?: () => void;
}) {
  const [drag, setDrag] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    for (const file of Array.from(files)) {
      const index = jobs.length;
      setJobs((j) => [...j, { name: file.name, size: file.size, stage: 0 }]);
      const bump = (stage: number, hash?: string) =>
        setJobs((j) =>
          j.map((job, i) =>
            job.name === file.name && (i >= index || true) && job.stage < stage
              ? { ...job, stage, ...(hash ? { hash } : {}) }
              : job,
          ),
        );
      for (let s = 1; s <= 4; s++) {
        await new Promise((r) => setTimeout(r, 320));
        bump(s);
      }
      const evidence = await api.uploadEvidence(caseId, file);
      bump(5, evidence.sha256);
      toast.success("Evidence uploaded successfully.", {
        description: `${file.name} · SHA-256 ${evidence.sha256.slice(0, 12)}…`,
      });
      onComplete?.();
    }
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center transition-colors",
          drag ? "border-primary bg-primary/5" : "border-border bg-surface-2/40",
        )}
      >
        <span className="rounded-full bg-primary/10 p-3 text-primary">
          <UploadCloud className="h-6 w-6" />
        </span>
        <p className="mt-4 text-sm font-medium">Drop evidence files here</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Supported: PDF, TXT, CSV, JPG, PNG, JSON, LOG, ZIP
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => void handleFiles(e.target.files)}
        />
        <Button className="mt-4" onClick={() => inputRef.current?.click()}>
          <FileUp className="mr-2 h-4 w-4" /> Browse Files
        </Button>
        <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-risk-low" />
          Uploaded files are treated as evidence and are never executed.
        </p>
      </div>

      {jobs.length ? (
        <div className="space-y-3">
          {jobs.map((job, i) => (
            <div key={`${job.name}-${i}`} className="panel p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium">{job.name}</p>
                <span className="text-xs text-muted-foreground">{formatBytes(job.size)}</span>
              </div>
              <Progress value={(job.stage / 5) * 100} className="mt-3 h-1.5" />
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                {job.stage < 5 ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5 text-risk-low" />
                )}
                {STAGES[job.stage]}
                {job.hash ? (
                  <span className="mono-hash text-risk-low">SHA-256 {job.hash.slice(0, 24)}…</span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
