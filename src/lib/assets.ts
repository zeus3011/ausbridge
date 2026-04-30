import logo from "@/assets/ausbridge-logo.png";
import heroSydney from "@/assets/hero-sydney.png";
import heroMelbourne from "@/assets/hero-melbourne.jpg";
import serviceSkilled from "@/assets/service-skilled.jpg";
import serviceEmployer from "@/assets/service-employer.jpg";
import serviceFamily from "@/assets/service-family.jpg";
import serviceComplex from "@/assets/service-complex.jpg";
import aboutAdvisor from "@/assets/about-advisor.jpg";

const bundled: Record<string, string> = {
  "/src/assets/ausbridge-logo.png": logo,
  "/src/assets/hero-sydney.png": heroSydney,
  "/src/assets/hero-melbourne.jpg": heroMelbourne,
  "/src/assets/service-skilled.jpg": serviceSkilled,
  "/src/assets/service-employer.jpg": serviceEmployer,
  "/src/assets/service-family.jpg": serviceFamily,
  "/src/assets/service-complex.jpg": serviceComplex,
  "/src/assets/about-advisor.jpg": aboutAdvisor,
};

/** Resolve a stored image reference. Bundled `/src/assets/*` paths return the
 *  Vite-imported URL; everything else (uploaded media URLs, https://, etc.) is
 *  returned as-is. Returns empty string for null/undefined. */
export function resolveImage(src: string | null | undefined): string {
  if (!src) return "";
  return bundled[src] ?? src;
}