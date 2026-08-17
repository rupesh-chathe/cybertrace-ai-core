import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { SectionCard, SecurityNotice } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api, useCurrentUser } from "@/lib/store";
import type { CaseStatus, Priority } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/cases/new")({
  head: () => ({
    meta: [
      { title: "Create Investigation — CyberTrace AI" },
      {
        name: "description",
        content:
          "Open a new digital forensic investigation with priority, status and assigned investigator.",
      },
      { property: "og:title", content: "Create Investigation — CyberTrace AI" },
      { property: "og:description", content: "Open a new digital forensic investigation case." },
    ],
  }),
  component: NewCasePage,
});

function NewCasePage() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    investigator: user?.name ?? "",
    priority: "MEDIUM" as Priority,
    status: "OPEN" as CaseStatus,
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const created = await api.createCase(form);
      toast.success("Investigation created", { description: `${created.id} · ${created.title}` });
      navigate({ to: "/cases/$id", params: { id: created.id } });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      title="Create Investigation"
      subtitle="Open a new case file and begin evidence intake."
      actions={
        <Button asChild variant="outline">
          <Link to="/cases">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to cases
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <SectionCard title="Case Details" description="All fields are recorded in the audit trail.">
          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="title">Case title</Label>
              <Input
                id="title"
                required
                placeholder="Unauthorized Access Investigation"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                required
                rows={5}
                placeholder="Scope of the investigation, systems involved and objectives."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="inv">Lead investigator</Label>
                <Input
                  id="inv"
                  required
                  value={form.investigator}
                  onChange={(e) => setForm({ ...form, investigator: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Select
                  value={form.priority}
                  onValueChange={(v) => setForm({ ...form, priority: v as Priority })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm({ ...form, status: v as CaseStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["OPEN", "IN PROGRESS", "CLOSED"].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create Investigation
            </Button>
          </form>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Intake Checklist">
            <ul className="space-y-3 text-xs text-muted-foreground">
              {[
                "Confirm you are authorized to review this material.",
                "Record the acquisition source for every artifact.",
                "Hash each artifact on import (SHA-256).",
                "Document investigator observations as notes.",
                "Generate a structured report before closing.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-risk-low" />
                  {item}
                </li>
              ))}
            </ul>
          </SectionCard>
          <SecurityNotice>
            Evidence artifacts are stored for review only and are never executed by the platform.
          </SecurityNotice>
        </div>
      </div>
    </AppShell>
  );
}
