import { Link } from "react-router-dom";
import { Newspaper, LayoutGrid, Settings as SettingsIcon, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AdminDashboard() {
  const { user } = useAuth();
  const cards = [
    {
      to: "/admin/sections",
      icon: LayoutGrid,
      title: "Page Sections",
      desc: "Edit hero, services, about, testimonials and every other block on the homepage.",
    },
    {
      to: "/admin/insights",
      icon: Newspaper,
      title: "Insights",
      desc: "Write, edit and publish blog posts and articles.",
    },
    {
      to: "/admin/settings",
      icon: SettingsIcon,
      title: "Site Settings",
      desc: "Logo, tagline, header phone and primary CTA.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-10">
      <p className="text-[10px] tracking-[0.3em] text-[hsl(var(--gold))] mb-2">— CMS PORTAL —</p>
      <h1 className="text-3xl font-semibold mb-1">Welcome back</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Signed in as {user?.email}. Pick a section below to start editing.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="group rounded-lg border bg-card p-5 hover:border-foreground/30 transition-colors"
          >
            <c.icon className="h-6 w-6 text-[hsl(var(--gold))] mb-3" />
            <p className="font-semibold mb-1">{c.title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
          </Link>
        ))}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-dashed bg-card p-5 hover:border-foreground/30 transition-colors"
        >
          <ExternalLink className="h-6 w-6 text-muted-foreground mb-3" />
          <p className="font-semibold mb-1">Open live site</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Preview the homepage in a new tab.
          </p>
        </a>
      </div>
    </div>
  );
}