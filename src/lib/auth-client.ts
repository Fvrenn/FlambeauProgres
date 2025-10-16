import { createAuthClient } from "better-auth/react"
 
export const authClient = createAuthClient()

// Vous pouvez aussi exporter directement les fonctions
export const { signIn, signUp, useSession } = authClient;