import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { EvidenceTable } from "@/components/evidence-table";
import { SectionCard } from "@/components/ui-kit";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDatabase } from "@/lib/store";
import { riskLevel } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/evidence/")({
  head: () => ({
    meta: [
      { title: "Evidence Explorer | CYBERTRACE AI" },
      { name: "description", content: "Search, filter and verify every digital artifact imported into the forensic workspace." },
      { property: "og:title", content: "Evidence Explorer | CYBERTRACE AI" },
      { property: "og:description", content: "Search, filter and verify every digital artifact in the workspace." },
    ],
  }),
  component: EvidenceExplorer,
});

function EvidenceExplorer() {
  const db = useDatabase();
  const [q, setQ] = useState("");
  const [risk, setRisk] = useState("ALL");
  const [type, setType] = useState("ALL");

  const items = db.evidence
    .filter((e) => {
      const text = `${e.filename} ${e.id} ${e.caseId} ${e.sha256}`.toLowerCase();
      return (
        text.includes(q.toLowerCase()) &&
        (risk === "ALL" || riskLevel(e.riskScore) === risk) &&
        (type === "ALL" || e.type === type)
      );
    })
    .sort((a, b) => b.riskScore - a.riskScore);

  return (
    <SectionCard
      title="Evidence Explorer"
      description={`${items.length} artifact(s) across ${db.cases.length} case(s)`}
    >
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search filename, hash, case ID"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Select value={risk} onValueChange={setRisk}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["ALL", "HIGH", "MEDIUM", "LOW"].map((r) => (
              <SelectItem key={r} value={r}>{r === "ALL" ? "All risk" : r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["ALL", "Document", "Image", "Log", "Archive", "Data", "Other"].map((t) => (
              <SelectItem key={t} value={t}>{t === "ALL" ? "All types" : t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <EvidenceTable items={items} />
    </SectionCard>
  );
}
