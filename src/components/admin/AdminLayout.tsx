import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  Newspaper,
  LogOut,
  ExternalLink,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const nav = [
  { to: "/admin", end: true, label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/sections", label: "Page Sections", icon: Home },
  { to: "/admin/insights", label: "Insights", icon: Newspaper },
  { to: "/admin/settings", label: "Site Settings", icon: Settings },
];

export function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-muted/30 font-sans">
      <aside className="w-64 bg-foreground text-background flex flex-col">
        <div className="px-5 py-5 border-b border-background/10">
          <p className="text-[10px] tracking-[0.25em] text-[hsl(var(--gold))] font-medium">CMS PORTAL</p>
          <p className="font-semibold text-base mt-1">AusBridge Admin</p>
        </div>
        <nav className="flex-1 py-3">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-background/10 text-background border-l-2 border-[hsl(var(--gold))]"
                    : "text-background/70 hover:bg-background/5 hover:text-background border-l-2 border-transparent"
                }`
              }
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-background/10 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs text-background/70 hover:text-background"
          >
            <ExternalLink className="h-3.5 w-3.5" /> View live site
          </a>
          <p className="text-[11px] text-background/50 truncate" title={user?.email ?? ""}>
            {user?.email}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-transparent text-background border-background/30 hover:bg-background/10 hover:text-background"
            onClick={async () => {
              await signOut();
              navigate("/admin/login");
            }}
          >
            <LogOut className="h-3.5 w-3.5 mr-1.5" /> Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}