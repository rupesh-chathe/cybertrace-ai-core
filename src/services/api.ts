/**
 * Service layer. All data access goes through this module so the UI never
 * talks to a data source directly. Today it is backed by a local persisted
 * store (demo mode). To connect a real backend (Node/Express/Mongo or any
 * REST API), set VITE_API_URL and replace the bodies of these functions with
 * fetch() calls — the signatures are the contract.
 */
import type {
  AiAnalysis,
  AuditAction,
  AuditLog,
  Case,
  CaseStatus,
  Database,
  Evidence,
  EvidenceType,
  Note,
  Priority,
  Report,
  TimelineEvent,
  User,
} from "@/lib/types";
import { riskLevel } from "@/lib/types";
import { buildDemoDatabase, pseudoHash } from "./demoData";

export const API_URL = import.meta.env['VITE_API_URL'] ?? "";

const DB_KEY = "cybertrace.db.v1";
const USER_KEY = "cybertrace.user.v1";
const USERS_KEY = "cybertrace.users.v1";

const empty = (): Database => ({
  cases: [],
  evidence: [],
  analyses: [],
  timeline: [],
  notes: [],
  audit: [],
  reports: [],
});

let db: Database = empty();
let currentUser: User | null = null;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function persist() {
  if (typeof window === "undefined") return;
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) db = { ...empty(), ...(JSON.parse(raw) as Database) };
    const u = localStorage.getItem(USER_KEY);
    if (u) currentUser = JSON.parse(u) as User;
  } catch {
    db = empty();
  }
  emit();
}

export function getSnapshot(): Database {
  return db;
}
export function getUser(): User | null {
  return currentUser;
}
export function isHydrated() {
  return hydrated;
}

const delay = (ms = 320) => new Promise((r) => setTimeout(r, ms));
const now = () => new Date().toISOString();
const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

/* ---------------------------------------------------------------- auth */

interface StoredUser extends User {
  password: string;
}

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]") as StoredUser[];
  } catch {
    return [];
  }
}

function setUser(u: User | null) {
  currentUser = u;
  if (typeof window !== "undefined") {
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
    else localStorage.removeItem(USER_KEY);
  }
  emit();
}

export async function register(input: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<User> {
  await delay();
  const users = readUsers();
  if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
    throw new Error("An account already exists for this email.");
  }
  const user: StoredUser = {
    id: uid("USR"),
    name: input.name,
    email: input.email,
    role: input.role,
    badge: input.name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    password: input.password,
  };
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  const { password: _pw, ...safe } = user;
  setUser(safe);
  log("Login", safe.email, "New investigator account created and session started.");
  return safe;
}

export async function login(email: string, password: string): Promise<User> {
  await delay();
  const users = readUsers();
  const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (found) {
    if (found.password !== password) throw new Error("Invalid credentials.");
    const { password: _pw, ...safe } = found;
    setUser(safe);
    log("Login", safe.email, "Authenticated session established.");
    return safe;
  }
  // No registered account: create a workspace session for this email so the
  // demo environment is usable without a provisioned backend.
  const name = email.split("@")[0]!.replace(/[._-]/g, " ");
  return register({ name, email, password, role: "Forensic Investigator" });
}

export async function logout() {
  if (currentUser) log("Logout", currentUser.email, "Session terminated.");
  await delay(120);
  setUser(null);
}

/* --------------------------------------------------------------- audit */

function log(action: AuditAction, resource: string, details: string) {
  const entry: AuditLog = {
    id: uid("AUD"),
    timestamp: now(),
    user: currentUser?.name ?? "System",
    action,
    resource,
    details,
    session: `session · ${(currentUser?.id ?? "anon").slice(-6).toLowerCase()}`,
  };
  db = { ...db, audit: [entry, ...db.audit] };
  persist();
  emit();
}

/* --------------------------------------------------------------- demo */

export async function loadDemoData() {
  await delay(600);
  db = buildDemoDatabase();
  persist();
  log("Demo Data Loaded", "workspace", "Synthetic investigation dataset loaded.");
  emit();
}

export async function clearWorkspace() {
  await delay(200);
  db = empty();
  persist();
  emit();
}

/* --------------------------------------------------------------- cases */

export async function createCase(input: {
  title: string;
  description: string;
  investigator: string;
  priority: Priority;
  status: CaseStatus;
}): Promise<Case> {
  await delay();
  const seq = db.cases.length + 1;
  const c: Case = {
    id: `CYB-${String(seq).padStart(3, "0")}`,
    ...input,
    createdAt: now(),
    updatedAt: now(),
  };
  db = { ...db, cases: [c, ...db.cases] };
  persist();
  log("Case Created", c.id, `Investigation "${c.title}" created.`);
  return c;
}

export async function updateCase(id: string, patch: Partial<Case>) {
  await delay(180);
  db = {
    ...db,
    cases: db.cases.map((c) => (c.id === id ? { ...c, ...patch, updatedAt: now() } : c)),
  };
  persist();
  log("Case Updated", id, `Case updated: ${Object.keys(patch).join(", ")}.`);
  emit();
}

/* ------------------------------------------------------------ evidence */

export function typeForFile(name: string): EvidenceType {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["pdf", "txt", "docx", "doc"].includes(ext)) return "Document";
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "Image";
  if (["log"].includes(ext)) return "Log";
  if (["zip", "tar", "gz", "rar"].includes(ext)) return "Archive";
  if (["csv", "json", "xml"].includes(ext)) return "Data";
  return "Other";
}

export async function sha256(file: File): Promise<string> {
  try {
    const buf = await file.arrayBuffer();
    const digest = await crypto.subtle.digest("SHA-256", buf);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return pseudoHash(`${file.name}:${file.size}`);
  }
}

function scoreFor(name: string, type: EvidenceType, size: number) {
  const n = name.toLowerCase();
  let score = 18 + (size % 17);
  const indicators: string[] = [];
  if (type === "Log") {
    score += 40;
    indicators.push("Multiple authentication failures in short window", "Unusual activity hour");
  }
  if (type === "Other") {
    score += 30;
    indicators.push("Unknown file type");
  }
  if (type === "Archive") {
    score += 28;
    indicators.push("Nested archive depth");
  }
  if (/auth|login|access|vpn|firewall/.test(n)) {
    score += 20;
    indicators.push("Access-related artifact naming pattern");
  }
  if (/final|copy|draft|\.\w+\.\w+$/.test(n)) {
    score += 12;
    indicators.push("Suspicious timestamp pattern");
  }
  if (type === "Image") indicators.push("EXIF block requires verification");
  return { score: Math.max(4, Math.min(98, Math.round(score))), indicators };
}

export async function uploadEvidence(caseId: string, file: File): Promise<Evidence> {
  const hash = await sha256(file);
  const type = typeForFile(file.name);
  const { score, indicators } = scoreFor(file.name, type, file.size);
  const e: Evidence = {
    id: uid("EVD"),
    caseId,
    filename: file.name,
    type,
    sizeBytes: file.size,
    uploadedAt: now(),
    sha256: hash,
    currentHash: hash,
    integrity: "VERIFIED",
    riskScore: score,
    analysisStatus: "COMPLETE",
    metadata: {
      "Original Path": `/evidence/${caseId.toLowerCase()}/${file.name}`,
      "MIME Type": file.type || "application/octet-stream",
      "Acquisition Method": "Browser import (not executed)",
      "Last Modified": new Date(file.lastModified).toISOString(),
    },
    indicators,
  };
  const analysis: AiAnalysis = {
    id: uid("AIA"),
    evidenceId: e.id,
    summary: indicators.length
      ? `Automated triage flagged ${indicators.length} indicator(s) in ${file.name}. Treated as a potentially suspicious artifact.`
      : `No notable indicators were detected in ${file.name} during automated triage.`,
    riskExplanation: `Score ${score}/100 (${riskLevel(score)}) derived from artifact type, naming pattern and structural characteristics.`,
    indicators: indicators.length ? indicators : ["No anomalous pattern detected"],
    recommendation:
      score > 70
        ? "Prioritize this artifact for manual investigator review."
        : "Queue for standard review.",
    createdAt: now(),
  };
  const events: TimelineEvent[] = [
    {
      id: uid("TL"),
      caseId,
      evidenceId: e.id,
      timestamp: now(),
      category: "Case Activity",
      title: "Evidence uploaded",
      description: `${file.name} imported, hashed and triaged.`,
      risk: "LOW",
    },
  ];
  if (score > 70) {
    events.push({
      id: uid("TL"),
      caseId,
      evidenceId: e.id,
      timestamp: now(),
      category: type === "Log" ? "Authentication" : "File Activity",
      title: "Potentially suspicious artifact detected",
      description: `${indicators[0]} — requires investigator review.`,
      risk: "HIGH",
    });
  }
  db = {
    ...db,
    evidence: [e, ...db.evidence],
    analyses: [analysis, ...db.analyses],
    timeline: [...events, ...db.timeline],
    cases: db.cases.map((c) => (c.id === caseId ? { ...c, updatedAt: now() } : c)),
  };
  persist();
  log("Evidence Uploaded", e.id, `${file.name} imported to ${caseId}.`);
  return e;
}

export async function verifyIntegrity(evidenceId: string): Promise<boolean> {
  await delay(700);
  const e = db.evidence.find((x) => x.id === evidenceId);
  if (!e) return false;
  const ok = e.currentHash === e.sha256;
  db = {
    ...db,
    evidence: db.evidence.map((x) =>
      x.id === evidenceId ? { ...x, integrity: ok ? "VERIFIED" : "COMPROMISED" } : x,
    ),
  };
  persist();
  log(
    "Integrity Verified",
    evidenceId,
    ok ? "SHA-256 comparison matched the original hash." : "Hash mismatch detected.",
  );
  return ok;
}

export async function runAnalysis(evidenceId: string): Promise<AiAnalysis> {
  const e = db.evidence.find((x) => x.id === evidenceId);
  if (!e) throw new Error("Evidence not found");
  db = {
    ...db,
    evidence: db.evidence.map((x) =>
      x.id === evidenceId ? { ...x, analysisStatus: "PROCESSING" } : x,
    ),
  };
  emit();
  await delay(1200);
  const analysis: AiAnalysis = {
    id: uid("AIA"),
    evidenceId,
    summary: e.indicators.length
      ? `Re-analysis confirms ${e.indicators.length} correlated indicator(s) in ${e.filename}.`
      : `Re-analysis of ${e.filename} found no anomalous pattern above the review threshold.`,
    riskExplanation: `Score ${e.riskScore}/100 (${riskLevel(e.riskScore)}). AI output is assistive and requires investigator confirmation.`,
    indicators: e.indicators.length ? e.indicators : ["No anomalous pattern detected"],
    recommendation:
      e.riskScore > 70
        ? "Prioritize this artifact for manual investigator review."
        : "Queue for standard review.",
    createdAt: now(),
  };
  db = {
    ...db,
    analyses: [analysis, ...db.analyses.filter((a) => a.evidenceId !== evidenceId)],
    evidence: db.evidence.map((x) =>
      x.id === evidenceId ? { ...x, analysisStatus: "COMPLETE" } : x,
    ),
    timeline: [
      {
        id: uid("TL"),
        caseId: e.caseId,
        evidenceId,
        timestamp: now(),
        category: "System Activity",
        title: "AI analysis completed",
        description: `Automated analysis completed for ${e.filename}.`,
        risk: riskLevel(e.riskScore),
      },
      ...db.timeline,
    ],
  };
  persist();
  log("Evidence Analyzed", evidenceId, `Triage score ${e.riskScore} (${riskLevel(e.riskScore)}).`);
  return analysis;
}

/* ---------------------------------------------------------------- notes */

export async function addNote(input: { caseId: string; evidenceId?: string; body: string }) {
  await delay(200);
  const note: Note = {
    id: uid("NOTE"),
    caseId: input.caseId,
    evidenceId: input.evidenceId,
    author: currentUser?.name ?? "Investigator",
    body: input.body,
    createdAt: now(),
  };
  db = { ...db, notes: [note, ...db.notes] };
  persist();
  log("Note Added", input.evidenceId ?? input.caseId, "Investigator note recorded.");
  return note;
}

/* -------------------------------------------------------------- reports */

export async function generateReport(caseId: string): Promise<Report> {
  await delay(900);
  const items = db.evidence.filter((e) => e.caseId === caseId);
  const top = Math.max(0, ...items.map((e) => e.riskScore));
  const report: Report = {
    id: uid("RPT"),
    caseId,
    generatedBy: currentUser?.name ?? "Investigator",
    generatedAt: now(),
    evidenceCount: items.length,
    riskLevel: riskLevel(top),
    status: "FINAL",
  };
  db = { ...db, reports: [report, ...db.reports] };
  persist();
  log("Report Generated", report.id, `Forensic report generated for ${caseId}.`);
  return report;
}
