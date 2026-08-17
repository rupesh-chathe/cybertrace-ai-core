import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { NotebookPen } from "lucide-react";
import { toast } from "sonner";
import { EmptyState, SectionCard } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api, useDatabase } from "@/lib/store";
import { formatDate } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/cases/$id/notes")({
  component: CaseNotes,
});

function CaseNotes() {
  const { id } = Route.useParams();
  const db = useDatabase();
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const notes = db.notes
    .filter((n) => n.caseId === id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <SectionCard title="Add Note" description="Notes are attributed and timestamped.">
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!body.trim()) return;
            setSaving(true);
            await api.addNote({ caseId: id, body: body.trim() });
            setBody("");
            setSaving(false);
            toast.success("Note added");
          }}
        >
          <Textarea
            rows={5}
            placeholder="Artifact requires manual verification."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <Button type="submit" disabled={saving || !body.trim()}>
            Add Note
          </Button>
        </form>
      </SectionCard>
      <SectionCard title="Investigator Notes" description={`${notes.length} note(s)`}>
        {notes.length ? (
          <ul className="space-y-3">
            {notes.map((n) => (
              <li key={n.id} className="rounded-lg border border-border bg-surface-2/40 p-4">
                <p className="text-sm">{n.body}</p>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {n.author} · {formatDate(n.createdAt)}
                  {n.evidenceId ? ` · ${n.evidenceId}` : ""}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="No notes yet"
            message="Record observations, correlations and verification steps as you review evidence."
            icon={NotebookPen}
          />
        )}
      </SectionCard>
    </div>
  );
}
