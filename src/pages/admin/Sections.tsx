import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { sectionSchemas } from "@/components/admin/sectionSchemas";

export default function SectionsList() {
  const visible = sectionSchemas.filter((s) => s.key !== "site");
  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10">
      <h1 className="text-2xl font-semibold mb-1">Page Sections</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Click a section to edit its text, images and lists. Changes are live as soon as you save.
      </p>
      <div className="rounded-lg border bg-card divide-y">
        {visible.map((s) => (
          <Link
            key={s.key}
            to={`/admin/sections/${s.key}`}
            className="flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition-colors"
          >
            <div>
              <p className="font-medium text-sm">{s.label}</p>
              {s.description && <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>}
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}