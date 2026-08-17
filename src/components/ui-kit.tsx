import type { ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CaseStatus, Integrity, Priority, RiskLevel } from "@/lib/types";
import { riskLevel } from "@/lib/types";

export function RiskBadge({ level, score }: { level?: RiskLevel; score?: number }) {
  const lvl = level ?? riskLevel(score ?? 0);
  const styles: Record<RiskLevel, string> = {
    LOW: "border-risk-low/40 bg-risk-low/10 text-risk-low",
    MEDIUM: "border-risk-medium/40 bg-risk-medium/10 text-risk-medium",
    HIGH: "border-risk-high/40 bg-risk-high/10 text-risk-high",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase",
        styles[lvl],
      )}
    >
      {lvl === "HIGH" ? <ShieldAlert className="h-3 w-3" /> : null}
      {lvl}
      {typeof score === "number" ? <span className="opacity-70">· {score}</span> : null}
    </span>
  );
}

export function StatusBadge({ status }: { status: CaseStatus | "DRAFT" | "FINAL" | string }) {
  const map: Record<string, string> = {
    OPEN: "border-info/40 bg-info/10 text-info",
    "IN PROGRESS": "border-risk-medium/40 bg-risk-medium/10 text-risk-medium",
    CLOSED: "border-border bg-muted text-muted-foreground",
    FINAL: "border-risk-low/40 bg-risk-low/10 text-risk-low",
    DRAFT: "border-risk-medium/40 bg-risk-medium/10 text-risk-medium",
    COMPLETE: "border-risk-low/40 bg-risk-low/10 text-risk-low",
    PROCESSING: "border-info/40 bg-info/10 text-info",
    QUEUED: "border-border bg-muted text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase",
        map[status] ?? "border-border bg-muted text-muted-foreground",
      )}
    >
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const map: Record<Priority, string> = {
    LOW: "border-border bg-muted text-muted-foreground",
    MEDIUM: "border-info/40 bg-info/10 text-info",
    HIGH: "border-risk-medium/40 bg-risk-medium/10 text-risk-medium",
    CRITICAL: "border-risk-high/40 bg-risk-high/10 text-risk-high",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase",
        map[priority],
      )}
    >
      {priority}
    </span>
  );
}

export function IntegrityBadge({ status }: { status: Integrity }) {
  if (status === "VERIFIED")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-risk-low">
        <ShieldCheck className="h-3.5 w-3.5" /> Verified
      </span>
    );
  if (status === "COMPROMISED")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-risk-high">
        <ShieldAlert className="h-3.5 w-3.5" /> Compromised
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
      <ShieldQuestion className="h-3.5 w-3.5" /> Pending
    </span>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  tone = "default",
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  hint?: string;
  tone?: "default" | "high" | "warn" | "good";
}) {
  const tones = {
    default: "text-primary bg-primary/10",
    high: "text-risk-high bg-risk-high/10",
    warn: "text-risk-medium bg-risk-medium/10",
    good: "text-risk-low bg-risk-low/10",
  } as const;
  return (
    <div className="panel p-5 transition-colors hover:border-primary/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {label}
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{value}</p>
          {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        <span className={cn("rounded-lg p-2", tones[tone])}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("panel", className)}>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold tracking-wide">{title}</h2>
          {description ? (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function EmptyState({
  title,
  message,
  icon: Icon = AlertTriangle,
  children,
}: {
  title: string;
  message: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/80 bg-surface-2/40 px-6 py-14 text-center">
      <span className="rounded-full bg-primary/10 p-3 text-primary">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-sm font-semibold">{title}</h3>
      <p className="mt-1 max-w-md text-xs text-muted-foreground">{message}</p>
      {children ? <div className="mt-5 flex flex-wrap justify-center gap-2">{children}</div> : null}
    </div>
  );
}

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-14 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" /> {label}…
    </div>
  );
}

export function RiskScore({ score, size = 132 }: { score: number; size?: number }) {
  const lvl = riskLevel(score);
  const color =
    lvl === "HIGH" ? "var(--risk-high)" : lvl === "MEDIUM" ? "var(--risk-medium)" : "var(--risk-low)";
  const r = size / 2 - 8;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center" style={{ width: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--border)"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={c - (c * score) / 100}
          style={{ transition: "stroke-dashoffset .8s ease" }}
        />
      </svg>
      <div className="-mt-[calc(50%+14px)] text-center" style={{ height: size / 2 }}>
        <div className="text-3xl font-semibold tabular-nums" style={{ color }}>
          {score}
        </div>
        <div className="text-[11px] font-semibold tracking-[0.14em] uppercase" style={{ color }}>
          {lvl} risk
        </div>
      </div>
    </div>
  );
}

export function SecurityNotice({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-info/30 bg-info/5 px-3 py-2 text-xs text-muted-foreground">
      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-info" />
      <span>{children}</span>
    </div>
  );
}
