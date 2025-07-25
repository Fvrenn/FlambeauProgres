export async function getBadges(): Promise<BadgeImage[]> {
  const res = await fetch("/api/badges", { next: { revalidate: 0 } });
  if (!res.ok) throw new Error("Échec du fetch des badges");
  const data = await res.json();
  return data.map((badge: any) => ({
    number: badge.number,
    name: badge.name,
    image_src: badge.image_src,
    isActive: badge.actif,
  }));
}

export async function getBadgesComplete(): Promise<BadgeComplete[]> {
  const res = await fetch("/api/badges", { next: { revalidate: 0 } });
  if (!res.ok) throw new Error("Échec du fetch des badges");
  return await res.json();
}

export type BadgeImage = {
  number: string;
  name: string;
  image_src: string;
  isActive: boolean;
};

export interface BadgeComplete {
  number: string;
  name: string;
  description: string;
  image_src: string;
  ordre: number;
  actif: boolean;
  competences: Array<{
    description: string;
  }>;
  realisations: Array<{
    description: string;
  }>;
}