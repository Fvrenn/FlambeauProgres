import type { auth } from "@/lib/auth";

import { createAuthClient } from "better-auth/react";
import { customSessionClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [customSessionClient<typeof auth>()],
});

export const { signIn, signUp, useSession, signOut } = authClient;
