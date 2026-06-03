// lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { customSession } from "better-auth/plugins";

import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "mysql" }),
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
            assigneEtapes: {
              select: {
                etape: {
                  select: {
                    id: true,
                    name: true,
                    image_src: true,
                  },
                },
              },
            },
          },
        });

        if (userFromDb) {
          const etapesReferent = userFromDb.assigneEtapes.map(
            (assignation) => assignation.etape,
          );

          return {
            session,
            user: {
              ...user,
              role: userFromDb.role,
              troupeId: userFromDb.troupeId,
              etapesReferent: etapesReferent,
            },
          };
        }
      }

      return { user, session };
    }),
  ],
});
