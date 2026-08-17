import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Brain,
  FileText,
  Fingerprint,
  Radar,
  ScrollText,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CYBERTRACE AI — Intelligent Digital Forensics Platform" },
      {
        name: "description",
        content:
          "AI-assisted digital forensics workspace for investigators: case management, SHA-256 evidence integrity, automated triage, timelines and court-ready reports.",
      },
      { property: "og:title", content: "CYBERTRACE AI — Intelligent Digital Forensics Platform" },
      {
        property: "og:description",
        content:
          "Case management, evidence integrity, AI-assisted triage and forensic reporting in one investigator workspace.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: Fingerprint, title: "Evidence Integrity", text: "Every artifact is hashed with SHA-256 at import and re-verifiable on demand." },
  { icon: Brain, title: "AI-Assisted Triage", text: "Automated risk scoring surfaces potentially suspicious artifacts for review." },
  { icon: Timer, title: "Investigation Timeline", text: "Chronological reconstruction of events across cases and artifacts." },
  { icon: FileText, title: "Forensic Reporting", text: "Structured, export-ready reports covering evidence, findings and custody." },
  { icon: ScrollText, title: "Audit Trail", text: "Append-only logging of every investigator action for chain of custody." },
  { icon: ShieldCheck, title: "Analyst Controls", text: "AI output is assistive only — investigators retain determination." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary">
            <Radar className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-[0.14em]">CYBERTRACE AI</p>
            <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              Digital Forensics
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="ghost"><Link to="/login">Sign In</Link></Button>
          <Button asChild><Link to="/register">Get Started</Link></Button>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 pt-14 pb-20 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            Smart India Hackathon 2026
          </p>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
            Intelligent digital forensics for modern cyber investigations
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Import artifacts, preserve integrity with SHA-256 hashing, triage with AI assistance,
            reconstruct timelines and produce court-ready forensic reports — in one workspace.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg"><Link to="/login">Launch Demo Workspace</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/register">Create Account</Link></Button>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-xl border border-border bg-surface p-5">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/12 text-primary">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <h2 className="mt-3 text-sm font-semibold">{title}</h2>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-[11px] text-muted-foreground">
        CYBERTRACE AI · Assistive forensic analysis — investigator review required.
      </footer>
    </div>
  );
}
