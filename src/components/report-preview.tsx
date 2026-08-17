import { Radar } from "lucide-react";
import { useDatabase } from "@/lib/store";
import { formatBytes, formatDate, riskLevel } from "@/lib/types";

export function ReportPreview({ caseId }: { caseId: string }) {
  const db = useDatabase();
  const kase = db.cases.find((c) => c.id === caseId);
  const items = db.evidence.filter((e) => e.caseId === caseId);
  const analyses = db.analyses.filter((a) => items.some((e) => e.id === a.evidenceId));
  const events = db.timeline
    .filter((t) => t.caseId === caseId)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  const notes = db.notes.filter((n) => n.caseId === caseId);
  const audit = db.audit.filter(
    (a) => a.resource === caseId || items.some((e) => e.id === a.resource),
  );
  if (!kase) return null;

  const counts = {
    HIGH: items.filter((e) => riskLevel(e.riskScore) === "HIGH").length,
    MEDIUM: items.filter((e) => riskLevel(e.riskScore) === "MEDIUM").length,
    LOW: items.filter((e) => riskLevel(e.riskScore) === "LOW").length,
  };
  const verified = items.filter((e) => e.integrity === "VERIFIED").length;

  const Section = ({ n, title, children }: { n: number; title: string; children: React.ReactNode }) => (
    <section className="border-t border-border pt-5">
      <h3 className="text-sm font-semibold tracking-wide">
        {n}. {title}
      </h3>
      <div className="mt-2 text-xs leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );

  return (
    <article className="space-y-5 rounded-xl border border-border bg-surface p-6">
      <header className="flex items-start justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary">
            <Radar className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-[0.14em]">CYBERTRACE AI</p>
            <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
              Digital Forensic Investigation Report
            </p>
          </div>
        </div>
        <div className="text-right text-[11px] text-muted-foreground">
          <p>Generated {formatDate(new Date().toISOString())}</p>
          <p>Reference {kase.id}</p>
        </div>
      </header>

      <Section n={1} title="Case Information">
        <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
          <div>Case ID: <span className="text-foreground">{kase.id}</span></div>
          <div>Title: <span className="text-foreground">{kase.title}</span></div>
          <div>Investigator: <span className="text-foreground">{kase.investigator}</span></div>
          <div>Priority: <span className="text-foreground">{kase.priority}</span></div>
          <div>Status: <span className="text-foreground">{kase.status}</span></div>
          <div>Opened: <span className="text-foreground">{formatDate(kase.createdAt)}</span></div>
        </dl>
      </Section>

      <Section n={2} title="Investigation Summary">{kase.description}</Section>

      <Section n={3} title="Evidence Summary">
        <table className="w-full text-left text-[11px]">
          <thead className="text-muted-foreground uppercase">
            <tr>
              <th className="py-1">Evidence ID</th>
              <th className="py-1">Filename</th>
              <th className="py-1">Type</th>
              <th className="py-1">Size</th>
              <th className="py-1">Score</th>
            </tr>
          </thead>
          <tbody className="text-foreground">
            {items.map((e) => (
              <tr key={e.id} className="border-t border-border/60">
                <td className="py-1 font-mono">{e.id}</td>
                <td className="py-1">{e.filename}</td>
                <td className="py-1">{e.type}</td>
                <td className="py-1">{formatBytes(e.sizeBytes)}</td>
                <td className="py-1">{e.riskScore} ({riskLevel(e.riskScore)})</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section n={4} title="Evidence Integrity">
        <p>
          {verified} of {items.length} artifacts currently match their recorded SHA-256 hash.
        </p>
        <ul className="mt-2 space-y-1">
          {items.map((e) => (
            <li key={e.id} className="mono-hash">
              {e.filename} — {e.sha256} [{e.integrity}]
            </li>
          ))}
        </ul>
      </Section>

      <Section n={5} title="Risk Distribution">
        High: {counts.HIGH} · Medium: {counts.MEDIUM} · Low: {counts.LOW}
      </Section>

      <Section n={6} title="Suspicious Evidence">
        <ul className="space-y-1">
          {items
            .filter((e) => e.riskScore > 70)
            .map((e) => (
              <li key={e.id}>
                {e.filename} (score {e.riskScore}) — potentially suspicious artifact; requires
                investigator review. Indicators: {e.indicators.join("; ") || "n/a"}
              </li>
            ))}
          {items.filter((e) => e.riskScore > 70).length === 0 ? <li>None flagged.</li> : null}
        </ul>
      </Section>

      <Section n={7} title="Investigation Timeline">
        <ul className="space-y-1">
          {events.map((e) => (
            <li key={e.id}>
              {formatDate(e.timestamp)} — [{e.category}] {e.title}: {e.description}
            </li>
          ))}
          {events.length === 0 ? <li>No timeline events recorded.</li> : null}
        </ul>
      </Section>

      <Section n={8} title="AI-Assisted Analysis">
        <p className="mb-2">
          Automated analysis is assistive only and does not constitute a finding of wrongdoing.
        </p>
        <ul className="space-y-2">
          {analyses.map((a) => {
            const e = items.find((x) => x.id === a.evidenceId);
            return (
              <li key={a.id}>
                <span className="text-foreground">{e?.filename}</span>: {a.summary} —{" "}
                {a.recommendation}
              </li>
            );
          })}
          {analyses.length === 0 ? <li>No automated analysis available.</li> : null}
        </ul>
      </Section>

      <Section n={9} title="Investigator Notes">
        <ul className="space-y-1">
          {notes.map((n) => (
            <li key={n.id}>
              {formatDate(n.createdAt)} — {n.author}: {n.body}
            </li>
          ))}
          {notes.length === 0 ? <li>No notes recorded.</li> : null}
        </ul>
      </Section>

      <Section n={10} title="Audit Summary">
        <ul className="space-y-1">
          {audit.slice(0, 12).map((a) => (
            <li key={a.id}>
              {formatDate(a.timestamp)} — {a.user} · {a.action} · {a.resource}
            </li>
          ))}
          {audit.length === 0 ? <li>No audit entries for this case.</li> : null}
        </ul>
      </Section>

      <Section n={11} title="Conclusion">
        This report consolidates {items.length} artifact(s) reviewed under case {kase.id}. Flagged
        items are identified as potentially suspicious artifacts requiring investigator review.
        Automated scoring and AI-assisted summaries support, but do not replace, investigator
        judgement.
      </Section>
    </article>
  );
}
