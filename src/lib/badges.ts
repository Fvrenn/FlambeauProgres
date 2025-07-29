import type { Badge } from "@/src/types/badge";
export async function getBadges(): Promise<Badge[]> {
  const res = await fetch("/api/badges", { next: { revalidate: 0 } });
  if (!res.ok) throw new Error("Échec du fetch des badges");
  return await res.json();
}