import type { User, UpdateUserRole } from "@/src/types/user";

export async function getUsers(): Promise<User[]> {
  const res = await fetch("/api/users", { 
    next: { revalidate: 0 },
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(`Échec du fetch users: ${res.status} - ${errorData}`);
  }
  
  return await res.json();
}

export async function updateUserRole(payload: UpdateUserRole): Promise<User> {
  const res = await fetch("/api/users", {
    method: "PATCH",
    headers: { 
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: "Erreur inconnue" }));
    throw new Error(`${res.status}: ${errorData.error || "Erreur inconnue"}`);
  }
  
  return await res.json();
}