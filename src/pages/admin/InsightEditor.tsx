import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Save, Trash2 } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { iconNames } from "@/lib/icons";

const TAG_OPTIONS = ["Update", "Guide", "Video", "News", "Story"];

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

type Draft = {
  title: string;
  slug: string;
  tag: string;
  icon: string;
  cover_url: string;
  summary: string;
  body: string;
  published: boolean;
};

const empty: Draft = {
  title: "",
  slug: "",
  tag: "Update",
  icon: "Calendar",
  cover_url: "",
  summary: "",
  body: "",
  published: true,
};

export default function InsightEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new" || !id;
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["insight", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("insights").select("*").eq("id", id!).single();
      if (error) throw error;
      return data as any;
    },
    enabled: !isNew,
  });

  const [draft, setDraft] = useState<Draft>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setDraft({
        title: data.title ?? "",
        slug: data.slug ?? "",
        tag: data.tag ?? "Update",
        icon: data.icon ?? "Calendar",
        cover_url: data.cover_url ?? "",
        summary: data.summary ?? "",
        body: data.body ?? "",
        published: !!data.published,
      });
    }
  }, [data]);

  const save = async () => {
    if (!draft.title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const slug = draft.slug.trim() || slugify(draft.title);
    const payload = { ...draft, slug, cover_url: draft.cover_url || null };
    let result;
    if (isNew) {
      result = await supabase.from("insights").insert(payload).select().single();
    } else {
      result = await supabase.from("insights").update(payload).eq("id", id!).select().single();
    }
    setSaving(false);
    if (result.error) {
      toast({ title: "Save failed", description: result.error.message, variant: "destructive" });
      return;
    }
    qc.invalidateQueries({ queryKey: ["admin_insights"] });
    qc.invalidateQueries({ queryKey: ["insights"] });
    toast({ title: "Saved" });
    if (isNew && result.data) navigate(`/admin/insights/${result.data.id}`, { replace: true });
  };

  const remove = async () => {
    if (isNew || !id) return;
    if (!confirm("Delete this insight? This cannot be undone.")) return;
    const { error } = await supabase.from("insights").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    qc.invalidateQueries({ queryKey: ["admin_insights"] });
    qc.invalidateQueries({ queryKey: ["insights"] });
    navigate("/admin/insights");
  };

  if (!isNew && isLoading) {
    return (
      <div className="p-10">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10">
      <button
        onClick={() => navigate("/admin/insights")}
        className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All insights
      </button>
      <div className="flex items-start justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold">{isNew ? "New insight" : "Edit insight"}</h1>
        <div className="flex gap-2">
          {!isNew && (
            <Button variant="outline" onClick={remove}>
              <Trash2 className="h-4 w-4 mr-1.5" /> Delete
            </Button>
          )}
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Save className="h-4 w-4 mr-1.5" />}
            Save
          </Button>
        </div>
      </div>

      <div className="space-y-5 rounded-lg border bg-card p-5">
        <div className="flex items-center justify-between">
          <Label>Published</Label>
          <Switch checked={draft.published} onCheckedChange={(v) => setDraft({ ...draft, published: v })} />
        </div>

        <div className="space-y-1.5">
          <Label>Title</Label>
          <Input
            value={draft.title}
            onChange={(e) => {
              const t = e.target.value;
              setDraft((d) => ({
                ...d,
                title: t,
                slug: d.slug === "" || d.slug === slugify(d.title) ? slugify(t) : d.slug,
              }));
            }}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Slug</Label>
          <Input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Tag</Label>
            <Select value={draft.tag} onValueChange={(v) => setDraft({ ...draft, tag: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TAG_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Icon</Label>
            <Select value={draft.icon} onValueChange={(v) => setDraft({ ...draft, icon: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {iconNames.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Cover image (optional)</Label>
          <ImageUploader value={draft.cover_url} onChange={(v) => setDraft({ ...draft, cover_url: v })} />
        </div>

        <div className="space-y-1.5">
          <Label>Summary</Label>
          <Textarea
            rows={3}
            value={draft.summary}
            onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Body (full article)</Label>
          <Textarea
            rows={14}
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            placeholder="Write the full article. Plain text — line breaks are preserved."
          />
        </div>
      </div>
    </div>
  );
}