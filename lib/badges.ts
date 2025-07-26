export async function getBadges(): Promise<Badge[]> {
  const res = await fetch("/api/badges", { next: { revalidate: 0 } });
  if (!res.ok) throw new Error("Échec du fetch des badges");
  return await res.json();
}

export type Badge = {
  isActive: boolean;
  number: string;
  name: string;
  description: string;
  image_src: string;
  ordre: number;
  actif: boolean;
  competences: Array<{
    code: string;
    description: string;
  }>;
  realisations: Array<{
    code: string;
    description: string;
  }>;
};
