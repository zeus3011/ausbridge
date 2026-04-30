import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronRight, Loader2, Plus, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { InsightRow } from "@/hooks/useContent";

export default function InsightsList() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin_insights"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("insights")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as unknown as InsightRow[];
    },
  });

  const togglePublish = async (id: string, next: boolean) => {
    const { error } = await supabase.from("insights").update({ published: next }).eq("id", id);
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
      return;
    }
    qc.invalidateQueries({ queryKey: ["admin_insights"] });
    qc.invalidateQueries({ queryKey: ["insights"] });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Insights</h1>
          <p className="text-sm text-muted-foreground mt-1">Blog posts and articles.</p>
        </div>
        <Button asChild>
          <Link to="/admin/insights/new">
            <Plus className="h-4 w-4 mr-1.5" /> New insight
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      ) : !data || data.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">No insights yet. Create your first one.</p>
        </div>
      ) : (
        <div className="rounded-lg border bg-card divide-y">
          {data.map((it) => (
            <div key={it.id} className="flex items-center gap-3 px-5 py-4 hover:bg-muted/30 transition-colors">
              <Link to={`/admin/insights/${it.id}`} className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{it.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {it.tag} · /{it.slug}
                </p>
              </Link>
              <button
                onClick={() => togglePublish(it.id, !it.published)}
                className={`text-xs inline-flex items-center gap-1 px-2 py-1 rounded ${
                  it.published
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
                title={it.published ? "Click to unpublish" : "Click to publish"}
              >
                {it.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                {it.published ? "Published" : "Draft"}
              </button>
              <Link to={`/admin/insights/${it.id}`}>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}