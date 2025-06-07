// Service pour la gestion des utilisateurs
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'CHEF' | 'REFERENT';
}

export async function fetchUsers(): Promise<User[]> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Non authentifié");

  const res = await fetch("/api/users", {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  
  if (!res.ok) throw new Error("Erreur lors du chargement des utilisateurs");
  return res.json();
}
