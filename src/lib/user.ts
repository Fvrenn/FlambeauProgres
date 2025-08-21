import type { User } from "@/src/types/user";

export async function getUsers(): Promise<User[]> {
  const res = await fetch("/api/users", { next: { revalidate: 0 } });
  if (!res.ok) throw new Error("Échec du fetch users");
  return await res.json();
}