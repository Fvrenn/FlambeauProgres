// lib/auth-client.ts
import type { auth } from "@/lib/auth"; // Importe 'auth' en tant que TYPE

import { createAuthClient } from "better-auth/react";
import { customSessionClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // --- AJOUTE CETTE LIGNE ---
  plugins: [customSessionClient<typeof auth>()],
});

// Tes exports existants sont parfaits
export const { signIn, signUp, useSession, signOut } = authClient;
