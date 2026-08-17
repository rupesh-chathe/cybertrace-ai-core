import type {
  AiAnalysis,
  AuditLog,
  Case,
  Database,
  Evidence,
  EvidenceType,
  Note,
  Report,
  TimelineEvent,
} from "@/lib/types";
import { riskLevel } from "@/lib/types";

const HEX = "0123456789abcdef";
function pseudoHash(seed: string): string {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let out = "";
  for (let i = 0; i < 64; i++) {
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    out += HEX[Math.abs(h + i * 31) % 16];
  }
  return out;
}

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600_000).toISOString();
}

const CASES: Case[] = [
  {
    id: "CYB-001",
    title: "Unauthorized Access Investigation",
    description:
      "Review of authentication artifacts and access logs following reported anomalous sign-in activity on an internal application server.",
    investigator: "A. Verma",
    priority: "CRITICAL",
    status: "IN PROGRESS",
    createdAt: hoursAgo(96),
    updatedAt: hoursAgo(3),
  },
  {
    id: "CYB-002",
    title: "Suspicious Document Investigation",
    description:
      "Triage of document artifacts recovered from a shared workstation, including metadata and authorship review.",
    investigator: "R. Nair",
    priority: "HIGH",
    status: "OPEN",
    createdAt: hoursAgo(72),
    updatedAt: hoursAgo(9),
  },
  {
    id: "CYB-003",
    title: "Digital Evidence Review",
    description:
      "Consolidated review of imported media and archive artifacts for an ongoing internal compliance matter.",
    investigator: "S. Iyer",
    priority: "MEDIUM",
    status: "OPEN",
    createdAt: hoursAgo(150),
    updatedAt: hoursAgo(26),
  },
];

interface Seed {
  filename: string;
  type: EvidenceType;
  caseId: string;
  score: number;
  size: number;
  indicators: string[];
}

const SEEDS: Seed[] = [
  {
    filename: "authentication.log",
    type: "Log",
    caseId: "CYB-001",
    score: 91,
    size: 482_113,
    indicators: [
      "Multiple authentication failures in short window",
      "Repeated source pattern",
      "Unusual activity hour",
    ],
  },
  {
    filename: "vpn_session_history.log",
    type: "Log",
    caseId: "CYB-001",
    score: 84,
    size: 221_884,
    indicators: ["Concurrent sessions from distinct subnets", "Unusual time window"],
  },
  {
    filename: "firewall_egress.csv",
    type: "Data",
    caseId: "CYB-001",
    score: 76,
    size: 1_204_002,
    indicators: ["Repeated outbound connection attempts", "Uncommon destination port"],
  },
  {
    filename: "workstation_registry_export.json",
    type: "Data",
    caseId: "CYB-001",
    score: 62,
    size: 94_221,
    indicators: ["Recently modified startup entries"],
  },
  {
    filename: "access_badge_report.pdf",
    type: "Document",
    caseId: "CYB-001",
    score: 24,
    size: 402_881,
    indicators: [],
  },
  {
    filename: "server_uptime.log",
    type: "Log",
    caseId: "CYB-001",
    score: 12,
    size: 60_112,
    indicators: [],
  },
  {
    filename: "contract_draft_final.docx.pdf",
    type: "Document",
    caseId: "CYB-002",
    score: 88,
    size: 733_120,
    indicators: [
      "Suspicious timestamp pattern",
      "Author metadata inconsistent with custodian",
      "Double extension in original filename",
    ],
  },
  {
    filename: "invoice_scan_0417.jpg",
    type: "Image",
    caseId: "CYB-002",
    score: 57,
    size: 2_204_884,
    indicators: ["EXIF creation date precedes document date"],
  },
  {
    filename: "email_export.csv",
    type: "Data",
    caseId: "CYB-002",
    score: 66,
    size: 890_331,
    indicators: ["Bulk external recipients", "Off-hours send pattern"],
  },
  {
    filename: "shared_drive_index.txt",
    type: "Document",
    caseId: "CYB-002",
    score: 31,
    size: 41_220,
    indicators: [],
  },
  {
    filename: "document_metadata.json",
    type: "Data",
    caseId: "CYB-002",
    score: 45,
    size: 22_004,
    indicators: ["Editing time inconsistent with revision count"],
  },
  {
    filename: "printer_queue.log",
    type: "Log",
    caseId: "CYB-002",
    score: 18,
    size: 15_882,
    indicators: [],
  },
  {
    filename: "archive_backup_q2.zip",
    type: "Archive",
    caseId: "CYB-003",
    score: 73,
    size: 18_224_113,
    indicators: ["Nested archive depth", "Unknown file type inside container"],
  },
  {
    filename: "device_image_notes.pdf",
    type: "Document",
    caseId: "CYB-003",
    score: 20,
    size: 220_884,
    indicators: [],
  },
  {
    filename: "camera_still_0091.png",
    type: "Image",
    caseId: "CYB-003",
    score: 38,
    size: 3_112_004,
    indicators: ["Missing EXIF block"],
  },
  {
    filename: "camera_still_0092.png",
    type: "Image",
    caseId: "CYB-003",
    score: 22,
    size: 2_884_112,
    indicators: [],
  },
  {
    filename: "system_events.log",
    type: "Log",
    caseId: "CYB-003",
    score: 69,
    size: 640_221,
    indicators: ["Service restarted outside maintenance window"],
  },
  {
    filename: "usb_device_history.csv",
    type: "Data",
    caseId: "CYB-003",
    score: 81,
    size: 118_004,
    indicators: ["Removable media connected outside business hours", "Unknown device serial"],
  },
  {
    filename: "chain_of_custody.pdf",
    type: "Document",
    caseId: "CYB-003",
    score: 8,
    size: 180_662,
    indicators: [],
  },
  {
    filename: "network_capture_summary.json",
    type: "Data",
    caseId: "CYB-003",
    score: 54,
    size: 512_004,
    indicators: ["Beacon-like interval observed"],
  },
  {
    filename: "misc_artifact.bin",
    type: "Other",
    caseId: "CYB-003",
    score: 49,
    size: 74_112,
    indicators: ["Unknown file type"],
  },
];

export function buildDemoDatabase(): Database {
  const evidence: Evidence[] = SEEDS.map((s, i) => {
    const hash = pseudoHash(s.filename + i);
    return {
      id: `EVD-${String(1001 + i)}`,
      caseId: s.caseId,
      filename: s.filename,
      type: s.type,
      sizeBytes: s.size,
      uploadedAt: hoursAgo(90 - i * 3),
      sha256: hash,
      currentHash: hash,
      integrity: i === 6 ? "PENDING" : "VERIFIED",
      riskScore: s.score,
      analysisStatus: "COMPLETE",
      metadata: {
        "Original Path": `/evidence/${s.caseId.toLowerCase()}/${s.filename}`,
        "MIME Type": mimeFor(s.type),
        Encoding: s.type === "Image" ? "binary" : "utf-8",
        "Custodian Device": `WS-${1200 + i}`,
        "Acquisition Method": "Logical import",
        "Records Parsed": String(180 + i * 37),
      },
      indicators: s.indicators,
    };
  });

  const analyses: AiAnalysis[] = evidence
    .filter((e) => e.riskScore >= 40)
    .map((e, i) => ({
      id: `AIA-${2001 + i}`,
      evidenceId: e.id,
      summary: summaryFor(e),
      riskExplanation: `Automated triage scored this artifact ${e.riskScore}/100 (${riskLevel(
        e.riskScore,
      )}) based on ${e.indicators.length || 1} correlated indicator(s) and comparison against baseline activity for this case.`,
      indicators: e.indicators.length ? e.indicators : ["Deviation from baseline activity profile"],
      recommendation:
        e.riskScore > 70
          ? "Prioritize this artifact for manual investigator review."
          : "Schedule for secondary review after high-risk artifacts are cleared.",
      createdAt: hoursAgo(40 - i),
    }));

  const timeline: TimelineEvent[] = [];
  evidence.forEach((e, i) => {
    timeline.push({
      id: `TL-${3000 + timeline.length}`,
      caseId: e.caseId,
      evidenceId: e.id,
      timestamp: e.uploadedAt,
      category: "Case Activity",
      title: "Evidence uploaded",
      description: `${e.filename} imported and queued for triage.`,
      risk: "LOW",
    });
    if (e.riskScore >= 70) {
      timeline.push({
        id: `TL-${3000 + timeline.length}`,
        caseId: e.caseId,
        evidenceId: e.id,
        timestamp: hoursAgo(89 - i * 3),
        category: e.type === "Log" ? "Authentication" : "File Activity",
        title: "Potentially suspicious artifact detected",
        description: `${e.indicators[0] ?? "Anomalous pattern"} observed in ${e.filename}. Requires investigator review.`,
        risk: "HIGH",
      });
    }
    if (e.riskScore >= 40) {
      timeline.push({
        id: `TL-${3000 + timeline.length}`,
        caseId: e.caseId,
        evidenceId: e.id,
        timestamp: hoursAgo(88 - i * 3),
        category: "System Activity",
        title: "AI analysis completed",
        description: `Automated analysis completed for ${e.filename}.`,
        risk: riskLevel(e.riskScore),
      });
    }
  });
  timeline.push(
    {
      id: "TL-4001",
      caseId: "CYB-001",
      timestamp: hoursAgo(6),
      category: "Network Indicator",
      title: "Repeated outbound connection pattern",
      description: "Egress records show regular-interval connection attempts to a single destination.",
      risk: "HIGH",
    },
    {
      id: "TL-4002",
      caseId: "CYB-001",
      timestamp: hoursAgo(5),
      category: "Authentication",
      title: "Authentication anomaly detected",
      description: "Failed sign-in attempts clustered within a two-minute window.",
      risk: "HIGH",
    },
    {
      id: "TL-4003",
      caseId: "CYB-002",
      timestamp: hoursAgo(11),
      category: "File Activity",
      title: "File modification detected",
      description: "Document modified after the reported custody handover time.",
      risk: "MEDIUM",
    },
  );

  const notes: Note[] = [
    {
      id: "NOTE-1",
      caseId: "CYB-001",
      evidenceId: "EVD-1001",
      author: "A. Verma",
      body: "Artifact requires manual verification against the domain controller export.",
      createdAt: hoursAgo(8),
    },
    {
      id: "NOTE-2",
      caseId: "CYB-001",
      author: "A. Verma",
      body: "Timestamp correlation observed between VPN sessions and failed authentication bursts.",
      createdAt: hoursAgo(4),
    },
    {
      id: "NOTE-3",
      caseId: "CYB-002",
      evidenceId: "EVD-1007",
      author: "R. Nair",
      body: "Author metadata does not match the listed custodian; pending clarification.",
      createdAt: hoursAgo(10),
    },
  ];

  const reports: Report[] = [
    {
      id: "RPT-9001",
      caseId: "CYB-001",
      generatedBy: "A. Verma",
      generatedAt: hoursAgo(2),
      evidenceCount: 6,
      riskLevel: "HIGH",
      status: "FINAL",
    },
    {
      id: "RPT-9002",
      caseId: "CYB-003",
      generatedBy: "S. Iyer",
      generatedAt: hoursAgo(20),
      evidenceCount: 9,
      riskLevel: "MEDIUM",
      status: "DRAFT",
    },
  ];

  const audit: AuditLog[] = [
    auditEntry(1, 96, "A. Verma", "Case Created", "CYB-001", "Investigation opened"),
    auditEntry(2, 90, "A. Verma", "Evidence Uploaded", "EVD-1001", "authentication.log imported"),
    auditEntry(3, 88, "System", "Evidence Analyzed", "EVD-1001", "Triage score 91 (HIGH)"),
    auditEntry(4, 80, "R. Nair", "Case Created", "CYB-002", "Investigation opened"),
    auditEntry(5, 60, "S. Iyer", "Evidence Uploaded", "EVD-1013", "archive_backup_q2.zip imported"),
    auditEntry(6, 40, "A. Verma", "Integrity Verified", "EVD-1002", "SHA-256 comparison matched"),
    auditEntry(7, 20, "S. Iyer", "Report Generated", "RPT-9002", "Draft report generated"),
    auditEntry(8, 8, "A. Verma", "Note Added", "EVD-1001", "Investigator note recorded"),
    auditEntry(9, 2, "A. Verma", "Report Generated", "RPT-9001", "Final report generated"),
  ];

  return { cases: CASES, evidence, analyses, timeline, notes, audit, reports };
}

function auditEntry(
  n: number,
  h: number,
  user: string,
  action: AuditLog["action"],
  resource: string,
  details: string,
): AuditLog {
  return {
    id: `AUD-${5000 + n}`,
    timestamp: hoursAgo(h),
    user,
    action,
    resource,
    details,
    session: `10.20.4.${20 + n} · sess-${pseudoHash(String(n)).slice(0, 6)}`,
  };
}

function mimeFor(type: EvidenceType): string {
  switch (type) {
    case "Document":
      return "application/pdf";
    case "Image":
      return "image/png";
    case "Log":
      return "text/plain";
    case "Archive":
      return "application/zip";
    case "Data":
      return "application/json";
    default:
      return "application/octet-stream";
  }
}

function summaryFor(e: Evidence): string {
  if (e.type === "Log")
    return "Multiple failed authentication attempts and irregular session activity were detected within a short time window.";
  if (e.type === "Document")
    return "Document metadata shows authorship and timestamp inconsistencies relative to the declared custody record.";
  if (e.type === "Image")
    return "Image metadata is incomplete or inconsistent with the reported capture timeline.";
  if (e.type === "Archive")
    return "Container includes nested archives and at least one artifact of unrecognised type.";
  return "Structured records contain repeating patterns that deviate from the established baseline.";
}

export { pseudoHash };
