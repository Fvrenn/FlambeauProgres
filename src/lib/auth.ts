// lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./prisma";

// --- IMPORTE LE PLUGIN ---
import { customSession } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
  },

  plugins: [
    nextCookies(),

    customSession(async ({ user, session }) => {
      if (user) {
        const userFromDb = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            role: true,
            troupeId: true,
            troupeDirigee: true,
            // --- AJOUT ---
            // On récupère les étapes assignées à cet utilisateur
            assigneEtapes: {
              select: {
                etape: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        });

        if (userFromDb) {
          // On transforme les données pour les rendre plus simples à utiliser côté client
          const etapesReferent = userFromDb.assigneEtapes.map(
            (assignation) => assignation.etape
          );

          return {
            session,
            user: {
              ...user,
              role: userFromDb.role,
              troupeId: userFromDb.troupeId,
              troupeDirigee: !!userFromDb.troupeDirigee,
              // --- AJOUT ---
              // On ajoute le nouveau tableau à l'objet utilisateur de la session
              etapesReferent: etapesReferent,
            },
          };
        }
      }
      return { user, session };
    }),
  ],
});