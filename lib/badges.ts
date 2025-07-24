export async function getBadges(): Promise<BadgeImage[]> {
  const res = await fetch("/api/badges", { next: { revalidate: 0 } });
  if (!res.ok) throw new Error("Échec du fetch des badges");
  const data = await res.json();
  return data.map((badge: any) => ({
    number: badge.number,
    name: badge.name,
    image_src: badge.image_src,
  }));
}

export type BadgeImage = {
  number: string;
  name: string;
  image_src: string;
  isActive: boolean;
};
