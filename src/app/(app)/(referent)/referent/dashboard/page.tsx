import React from "react";
import { type User } from "@prisma/client";

import ReferentDashboardClientV2 from "./ReferentDashboardClientV2";

import { getUser } from "@/lib/auth-server";
import prisma from "@/lib/prisma"; // Assurez-vous d'importer votre client Prisma

type ReferentDashboardPageProps = {
  searchParams: Promise<{
    etapeId?: string;
  }>;
};

export default async function ReferentDashboardPage({
  searchParams,
}: ReferentDashboardPageProps) {
  // Avec Next.js 15, searchParams est une Promise
  const params = await searchParams;
  const etapeId = params.etapeId;

  if (!etapeId) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-lg text-default-500">
          Veuillez sélectionner une étape dans le menu de gauche pour commencer.
        </p>
      </div>
    );
  }

  const objectifsCounts = await prisma.objectif.groupBy({
    by: ["type"],
    where: { etapeId: etapeId },
    _count: {
      id: true,
    },
  });

  const totalCompetences =
    objectifsCounts.find((c) => c.type === "COMPETENCE")?._count.id || 0;
  const totalRealisations =
    objectifsCounts.find((c) => c.type === "REALISATION")?._count.id || 0;

  const chefsProgress = await prisma.justification.groupBy({
    by: ["chefId"],
    where: {
      etapeId: etapeId,
      statut: { in: ["AUTO_VALIDEE", "VALIDEE"] },
    },
    _count: {
      id: true,
    },
  });

  // 3. Filtrer pour trouver les chefs ayant 100%
  const chefsCompletsIds = [];

  for (const chef of chefsProgress) {
    const [competencesValidees, realisationsValidees] = await Promise.all([
      prisma.justification.count({
        where: {
          chefId: chef.chefId,
          etapeId: etapeId,
          statut: "AUTO_VALIDEE",
          objectif: { type: "COMPETENCE" },
        },
      }),
      prisma.justification.count({
        where: {
          chefId: chef.chefId,
          etapeId: etapeId,
          statut: "VALIDEE",
          objectif: { type: "REALISATION" },
        },
      }),
    ]);

    if (
      competencesValidees === totalCompetences &&
      realisationsValidees === totalRealisations
    ) {
      chefsCompletsIds.push(chef.chefId);
    }
  }

  const chefsDejaValides = await prisma.chefEtapeStatut.findMany({
    where: {
      etapeId: etapeId,
      statut: "VALIDE",
      chefId: { in: chefsCompletsIds }, // On ne cherche que parmi les chefs complets
    },
    select: {
      chefId: true,
    },
  });
  const chefsDejaValidesIds = chefsDejaValides.map((statut) => statut.chefId);

  const chefsEnAttenteDeRevisionIds = chefsCompletsIds.filter(
    (id) => !chefsDejaValidesIds.includes(id),
  );

  let chefsAReviser: User[] = [];

  if (chefsEnAttenteDeRevisionIds.length > 0) {
    chefsAReviser = await prisma.user.findMany({
      where: {
        id: { in: chefsEnAttenteDeRevisionIds },
      },
    });
  }

  // --- FIN DE LA MODIFICATION ---

  const user = await getUser();

  if (!user || !("role" in user) || user.role !== "REFERENT") {
    return <div>Accès refusé</div>;
  }

  const rawJustificationsAValider = await prisma.justification.findMany({
    where: {
      etapeId: etapeId,
      statut: "SOUMISE", // ou un autre statut pertinent
    },
    include: {
      chef: true,
      objectif: true,
      commentaires: {
        include: {
          auteur: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      fichiers: true, // <--- AJOUTEZ CETTE LIGNE pour inclure les fichiers
    },
    orderBy: {
      soumiseAt: "asc",
    },
  });

  const justificationsAValider = rawJustificationsAValider.map(
    (justification) => ({
      ...justification,
      fichiers: justification.fichiers.map((fichier) => ({
        ...fichier,

        url: `/api/files/${fichier.id}`,
      })),
    }),
  );

  const rawJustificationsEnDiscussion = await prisma.justification.findMany({
    where: {
      etapeId: etapeId,
      statut: "DEMANDE_PRECISION",
    },
    include: {
      chef: true,
      objectif: true,
      commentaires: {
        include: {
          auteur: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      fichiers: true, // <--- AJOUTEZ CETTE LIGNE
      _count: {
        select: {
          notifications: {
            where: {
              destinataireId: user.id,
              lue: false,
              type: "NOUVEAU_COMMENTAIRE",
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const justificationsEnDiscussion = rawJustificationsEnDiscussion.map(
    (justification) => ({
      ...justification,
      fichiers: justification.fichiers.map((fichier) => ({
        ...fichier,
        url: `/api/files/${fichier.id}`,
      })),
    }),
  );

  return (
    <ReferentDashboardClientV2
      chefsAReviser={chefsAReviser}
      justificationsAValider={justificationsAValider}
      justificationsEnDiscussion={justificationsEnDiscussion}
    />
  );
}
