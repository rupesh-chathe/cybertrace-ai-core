import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Brain,
  ChevronLeft,
  ClipboardList,
  FileSearch,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Radar,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { api, useCurrentUser } from "@/lib/store";
import { toast } from "sonner";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/cases", label: "Cases", icon: FolderKanban },
  { to: "/evidence", label: "Evidence Explorer", icon: FileSearch },
  { to: "/timeline", label: "Timeline", icon: Activity },
  { to: "/ai-analysis", label: "AI Analysis", icon: Brain },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/audit-logs", label: "Audit Logs", icon: ClipboardList },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function Brand({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-5">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary">
        <Radar className="h-5 w-5" />
      </span>
      {!collapsed ? (
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-[0.12em]">CYBERTRACE AI</p>
          <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
            Digital Forensics
          </p>
        </div>
      ) : null}
    </div>
  );
}

function NavList({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex-1 space-y-1 px-2">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to || pathname.startsWith(`${to}/`);
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            title={label}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground ring-1 ring-primary/30"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
            )}
          >
            <Icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
            {!collapsed ? <span className="truncate">{label}</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}

function UserFooter({ collapsed }: { collapsed?: boolean }) {
  const user = useCurrentUser();
  const navigate = useNavigate();
  return (
    <div className="border-t border-sidebar-border p-3">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-xs font-semibold text-primary">
          {user?.badge ?? "IN"}
        </span>
        {!collapsed ? (
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-medium">{user?.name ?? "Investigator"}</p>
            <p className="truncate text-[11px] text-muted-foreground">
              {user?.role ?? "Forensic Investigator"}
            </p>
          </div>
        ) : null}
        <button
          aria-label="Log out"
          onClick={async () => {
            await api.logout();
            toast.success("Session terminated");
            navigate({ to: "/login", replace: true });
          }}
          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-risk-high"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 lg:flex",
          collapsed ? "w-[76px]" : "w-64",
        )}
      >
        <Brand collapsed={collapsed} />
        <NavList collapsed={collapsed} />
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="mx-3 mb-3 flex items-center justify-center gap-2 rounded-lg border border-sidebar-border py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className={cn("h-3.5 w-3.5 transition-transform", collapsed && "rotate-180")} />
          {!collapsed ? "Collapse" : null}
        </button>
        <UserFooter collapsed={collapsed} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/85 px-4 py-4 backdrop-blur md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-sidebar p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="flex h-full flex-col">
                  <Brand />
                  <NavList onNavigate={() => setOpen(false)} />
                  <UserFooter />
                </div>
              </SheetContent>
            </Sheet>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold tracking-tight">{title}</h1>
              {subtitle ? (
                <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-md border border-risk-low/30 bg-risk-low/10 px-2.5 py-1 text-[11px] font-medium text-risk-low sm:inline-flex">
              <ShieldCheck className="h-3.5 w-3.5" /> Secure session
            </span>
            {actions}
          </div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-6">{children}</main>
      </div>
    </div>
  );
}
