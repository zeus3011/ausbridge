import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Plus, Save, Trash2, MoveUp, MoveDown } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { getSectionSchema, type Field, type ListField } from "@/components/admin/sectionSchemas";
import { toast } from "@/hooks/use-toast";

/* ---------- helpers for dotted keys + array-of-string fields ---------- */

const STRING_LIST_KEYS = new Set(["items", "features"]); // fields where the value should be string[]

function getDeep(obj: any, path: string): any {
  return path.split(".").reduce((a, k) => (a == null ? undefined : a[k]), obj);
}
function setDeep(obj: any, path: string, value: any): any {
  const parts = path.split(".");
  const next = { ...obj };
  let cur: any = next;
  for (let i = 0; i < parts.length - 1; i++) {
    cur[parts[i]] = { ...(cur[parts[i]] ?? {}) };
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
  return next;
}
function arr<T>(v: any): T[] {
  return Array.isArray(v) ? v : [];
}

/* ---------- field input ---------- */

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: any;
  onChange: (v: any) => void;
}) {
  if (field.type === "image") {
    return <ImageUploader value={value} onChange={onChange} />;
  }
  if (field.type === "select") {
    return (
      <Select value={value ?? ""} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Choose…" />
        </SelectTrigger>
        <SelectContent>
          {field.options?.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
  if (field.type === "textarea") {
    // String-list textarea: render array as newline-joined.
    if (STRING_LIST_KEYS.has(field.key) && Array.isArray(value)) {
      return (
        <Textarea
          rows={4}
          value={value.join("\n")}
          onChange={(e) =>
            onChange(
              e.target.value
                .split("\n")
                .map((s) => s.trimEnd())
                .filter((s, i, a) => s.length > 0 || i === a.length - 1),
            )
          }
        />
      );
    }
    // "compliance" is also string[] when stored at section level.
    if (field.key === "compliance" && Array.isArray(value)) {
      return (
        <Textarea
          rows={4}
          value={value.join("\n")}
          onChange={(e) => onChange(e.target.value.split("\n").filter((s) => s.trim().length > 0))}
        />
      );
    }
    return <Textarea rows={4} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
  }
  return <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
}

/* ---------- list editor ---------- */

function ListEditor({
  list,
  data,
  onChange,
}: {
  list: ListField;
  data: Record<string, any>;
  onChange: (next: Record<string, any>) => void;
}) {
  const items = arr<any>(data[list.key]);
  const update = (next: any[]) => onChange({ ...data, [list.key]: next });

  const blank = () => Object.fromEntries(list.fields.map((f) => [f.key, f.type === "image" ? "" : ""]));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-sm">{list.label}</p>
          <p className="text-xs text-muted-foreground">{items.length} {list.itemLabel.toLowerCase()}{items.length === 1 ? "" : "s"}</p>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={() => update([...items, blank()])}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Add {list.itemLabel}
        </Button>
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => {
          const title = list.titleKey
            ? Array.isArray(item[list.titleKey])
              ? item[list.titleKey].join(", ")
              : item[list.titleKey]
            : "";
          return (
            <div key={idx} className="rounded-md border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between gap-2 border-b pb-2 mb-1">
                <p className="text-sm font-medium truncate">
                  {list.itemLabel} {idx + 1}
                  {title ? <span className="text-muted-foreground font-normal"> — {String(title).slice(0, 60)}</span> : null}
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    disabled={idx === 0}
                    onClick={() => {
                      const next = [...items];
                      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                      update(next);
                    }}
                  >
                    <MoveUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    disabled={idx === items.length - 1}
                    onClick={() => {
                      const next = [...items];
                      [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
                      update(next);
                    }}
                  >
                    <MoveDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      if (!confirm(`Remove this ${list.itemLabel.toLowerCase()}?`)) return;
                      update(items.filter((_, i) => i !== idx));
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              {list.fields.map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <Label>{f.label}</Label>
                  <FieldInput
                    field={f}
                    value={item[f.key]}
                    onChange={(v) => {
                      const next = [...items];
                      next[idx] = { ...next[idx], [f.key]: v };
                      update(next);
                    }}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- main editor ---------- */

export default function SectionEditor() {
  const { sectionKey } = useParams<{ sectionKey: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const schema = sectionKey ? getSectionSchema(sectionKey) : undefined;

  const { data: row, isLoading } = useQuery({
    queryKey: ["section", sectionKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("section_key", sectionKey!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!sectionKey,
  });

  const [draft, setDraft] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (row?.data) setDraft(row.data as Record<string, any>);
  }, [row]);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(row?.data ?? {}), [draft, row]);

  if (!schema) {
    return (
      <div className="p-8">
        <p>Unknown section: {sectionKey}</p>
      </div>
    );
  }

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("site_content")
      .update({ data: draft })
      .eq("section_key", sectionKey!);
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    qc.invalidateQueries({ queryKey: ["section", sectionKey] });
    qc.invalidateQueries({ queryKey: ["site_content"] });
    toast({ title: "Saved", description: `${schema.label} updated.` });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10">
      <button
        onClick={() => navigate("/admin/sections")}
        className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All sections
      </button>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">{schema.label}</h1>
          {schema.description && <p className="text-sm text-muted-foreground mt-1">{schema.description}</p>}
        </div>
        <Button onClick={save} disabled={!dirty || saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Save className="h-4 w-4 mr-1.5" />}
          Save changes
        </Button>
      </div>

      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      ) : (
        <div className="space-y-8">
          {schema.fields.length > 0 && (
            <div className="rounded-lg border bg-card p-5 space-y-4">
              {schema.fields.map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <Label>{f.label}</Label>
                  <FieldInput
                    field={f}
                    value={getDeep(draft, f.key)}
                    onChange={(v) => setDraft((d) => setDeep(d, f.key, v))}
                  />
                </div>
              ))}
            </div>
          )}
          {schema.lists?.map((l) => (
            <div key={l.key} className="rounded-lg border bg-card p-5">
              <ListEditor list={l} data={draft} onChange={setDraft} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}