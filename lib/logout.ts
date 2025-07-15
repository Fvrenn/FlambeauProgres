"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
          },
        },
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return { handleSignOut };
};