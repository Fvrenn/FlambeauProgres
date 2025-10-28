// lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./prisma";
export const auth = betterAuth({
  // Dites à Better Auth d'utiliser votre client Prisma
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  // Activez l'authentification par email/mot de passe
  emailAndPassword: {
    enabled: true,
  },

  // ESSENTIEL pour les Server Actions dans Next.js
  plugins: [nextCookies()],
});

