import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "cptmwzqn",   // from sanity dashboard
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});
