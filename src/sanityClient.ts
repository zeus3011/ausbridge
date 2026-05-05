import { createClient } from "@sanity/client";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET;
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || "2024-01-01";
const useCdn = String(import.meta.env.VITE_SANITY_USE_CDN).toLowerCase() === "true";

if (!projectId || !dataset) {
  throw new Error("Missing Sanity env vars: VITE_SANITY_PROJECT_ID and VITE_SANITY_DATASET are required.");
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
});
