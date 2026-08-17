import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Fingerprint, Loader2, Lock, Mail, Radar, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/store";

export const Route = createFileRoute("/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign In — CyberTrace AI Digital Forensics" },
      {
        name: "description",
        content:
          "Secure sign-in for authorized investigators using CyberTrace AI, an intelligent digital forensics and cyber triage platform.",
      },
      { property: "og:title", content: "Sign In — CyberTrace AI" },
      {
        property: "og:description",
        content: "Secure. Analyze. Investigate. Access the CyberTrace AI investigation workspace.",
      },
    ],
  }),
  component: LoginPage,
});

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className="grid-backdrop absolute inset-0 opacity-40" aria-hidden />
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-hero)" }}
        aria-hidden
      />
      <div className="relative grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_1fr]">
        <section className="hidden flex-col justify-center lg:flex">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] tracking-[0.18em] text-primary uppercase">
            <ShieldCheck className="h-3.5 w-3.5" /> SIH 2026 · SIH26037
          </span>
          <h1 className="mt-6 flex items-center gap-3 text-4xl font-semibold tracking-tight">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary">
              <Radar className="h-6 w-6" />
            </span>
            CYBERTRACE AI
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Intelligent Digital Forensics &amp; Cyber Triage
          </p>
          <p className="mt-1 font-mono text-sm text-primary">Secure. Analyze. Investigate.</p>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
            CyberTrace AI helps authorized investigators organize digital evidence, identify
            potential risk indicators, reconstruct investigation timelines, and generate structured
            forensic reports.
          </p>
          <ul className="mt-8 grid gap-3 text-xs text-muted-foreground sm:grid-cols-2">
            {[
              "SHA-256 evidence integrity",
              "Automated triage scoring",
              "AI-assisted analysis",
              "Investigation timeline",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 rounded-lg border border-border/70 bg-surface/60 px-3 py-2">
                <Fingerprint className="h-3.5 w-3.5 text-primary" /> {f}
              </li>
            ))}
          </ul>
        </section>

        <section className="panel p-7">
          <div className="mb-6 lg:hidden">
            <p className="text-sm font-semibold tracking-[0.14em]">CYBERTRACE AI</p>
            <p className="text-xs text-muted-foreground">
              Intelligent Digital Forensics &amp; Cyber Triage
            </p>
          </div>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </section>
      </div>
    </div>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [forgot, setForgot] = useState(false);

  useEffect(() => {
    api.hydrate();
    if (api.getUser()) navigate({ to: "/dashboard", replace: true });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await api.login(email, password);
      toast.success(`Welcome, ${user.name}`, { description: "Secure session established." });
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Sign in" subtitle="Authorized investigator access only.">
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="investigator@agency.gov"
              className="pl-9"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              required
              minLength={4}
              autoComplete="current-password"
              placeholder="••••••••"
              className="pl-9"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <Checkbox checked={remember} onCheckedChange={(v) => setRemember(Boolean(v))} />
            Remember session
          </label>
          <button
            type="button"
            onClick={() => setForgot(true)}
            className="text-xs text-primary hover:underline"
          >
            Forgot password?
          </button>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Sign In
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            try {
              try {
                await api.login("demo@cybertrace.ai", "demo1234");
              } catch {
                await api.register({
                  name: "Demo Investigator",
                  email: "demo@cybertrace.ai",
                  password: "demo1234",
                  role: "Forensic Analyst",
                  badge: "CT-DEMO-01",
                });
              }
              await api.loadDemoData();
              toast.success("Demo workspace ready", {
                description: "Synthetic investigation dataset loaded.",
              });
              navigate({ to: "/dashboard" });
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Demo mode failed");
            } finally {
              setLoading(false);
            }
          }}
        >
          Enter Demo Mode
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link to="/register">Create Account</Link>
        </Button>

        <p className="pt-2 text-center text-[11px] text-muted-foreground">
          Access is logged. All actions are recorded in the audit trail.
        </p>
      </form>

      <Dialog open={forgot} onOpenChange={setForgot}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Password recovery</DialogTitle>
            <DialogDescription>
              Password resets are handled by your organization's forensic system administrator.
              Submit your work email and a reset request will be recorded.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="investigator@agency.gov" />
            <Button
              className="w-full"
              onClick={() => {
                setForgot(false);
                toast.success("Reset request recorded", {
                  description: "Your administrator has been notified.",
                });
              }}
            >
              Request reset
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AuthLayout>
  );
}
