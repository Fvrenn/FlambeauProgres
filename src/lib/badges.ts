import type { Badge } from "@/src/types/badge";

export async function getBadges(): Promise<Badge[]> {
  const res = await fetch("/api/badges", { 
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(`Échec du fetch badges: ${res.status} - ${errorData}`);
  }
  
  return await res.json();
}

export async function getBadge(id: string): Promise<Badge> {
  const res = await fetch(`/api/badges/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(`Échec du fetch badge: ${res.status} - ${errorData}`);
  }
  
  return await res.json();
}