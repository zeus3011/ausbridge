import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SectionRow = {
  id: string;
  section_key: string;
  title: string | null;
  data: Record<string, unknown>;
  sort_order: number;
  visible: boolean;
  updated_at: string;
};

export type InsightRow = {
  id: string;
  slug: string;
  title: string;
  tag: string;
  icon: string;
  cover_url: string | null;
  summary: string;
  body: string;
  published: boolean;
  sort_order: number;
  published_at: string;
};

/** Map of section_key -> data (jsonb). Returns {} while loading. */
export function useSiteContent() {
  const query = useQuery({
    queryKey: ["site_content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as unknown as SectionRow[];
    },
    staleTime: 30_000,
  });

  const map: Record<string, any> = {};
  for (const row of query.data ?? []) {
    map[row.section_key] = row.data ?? {};
  }
  return { content: map, isLoading: query.isLoading, rows: query.data ?? [] };
}

export function useInsights(opts: { publishedOnly?: boolean } = {}) {
  return useQuery({
    queryKey: ["insights", opts.publishedOnly ?? true],
    queryFn: async () => {
      let q = supabase.from("insights").select("*").order("sort_order", { ascending: true });
      if (opts.publishedOnly !== false) q = q.eq("published", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as InsightRow[];
    },
    staleTime: 30_000,
  });
}