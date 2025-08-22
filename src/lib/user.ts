import type { User } from "@/src/types/user";

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