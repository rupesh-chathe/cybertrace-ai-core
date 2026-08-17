export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type CaseStatus = "OPEN" | "IN PROGRESS" | "CLOSED";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type Integrity = "VERIFIED" | "PENDING" | "COMPROMISED";
export type EvidenceType = "Document" | "Image" | "Log" | "Archive" | "Data" | "Other";
export type AnalysisStatus = "QUEUED" | "PROCESSING" | "COMPLETE";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  badge: string;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  investigator: string;
  priority: Priority;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Evidence {
  id: string;
  caseId: string;
  filename: string;
  type: EvidenceType;
  sizeBytes: number;
  uploadedAt: string;
  sha256: string;
  currentHash: string;
  integrity: Integrity;
  riskScore: number;
  analysisStatus: AnalysisStatus;
  metadata: Record<string, string>;
  indicators: string[];
}

export interface AiAnalysis {
  id: string;
  evidenceId: string;
  summary: string;
  riskExplanation: string;
  indicators: string[];
  recommendation: string;
  createdAt: string;
}

export type TimelineCategory =
  | "Authentication"
  | "File Activity"
  | "System Activity"
  | "Network Indicator"
  | "Case Activity";

export interface TimelineEvent {
  id: string;
  caseId: string;
  evidenceId?: string | undefined;
  timestamp: string;
  category: TimelineCategory;
  title: string;
  description: string;
  risk: RiskLevel;
}

export interface Note {
  id: string;
  caseId: string;
  evidenceId?: string | undefined;
  author: string;
  body: string;
  createdAt: string;
}

export type AuditAction =
  | "Login"
  | "Logout"
  | "Case Created"
  | "Case Updated"
  | "Evidence Uploaded"
  | "Evidence Analyzed"
  | "Integrity Verified"
  | "Report Generated"
  | "Note Added"
  | "Demo Data Loaded";

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: AuditAction;
  resource: string;
  details: string;
  session: string;
}

export interface Report {
  id: string;
  caseId: string;
  generatedBy: string;
  generatedAt: string;
  evidenceCount: number;
  riskLevel: RiskLevel;
  status: "DRAFT" | "FINAL";
}

export interface Database {
  cases: Case[];
  evidence: Evidence[];
  analyses: AiAnalysis[];
  timeline: TimelineEvent[];
  notes: Note[];
  audit: AuditLog[];
  reports: Report[];
}

export function riskLevel(score: number): RiskLevel {
  if (score <= 30) return "LOW";
  if (score <= 70) return "MEDIUM";
  return "HIGH";
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
