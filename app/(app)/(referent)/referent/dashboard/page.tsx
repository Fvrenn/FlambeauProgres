import React from "react";
import prisma from "@/src/lib/prisma";
import ReferentDashboardClientV2 from "./ReferentDashboardClientV2";
import { getUser } from "@/src/lib/auth-server";
import { type User } from "@prisma/client";

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

  console.log("ID de l'étape active (côté serveur) :", etapeId);

  if (!etapeId) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-lg text-default-500">
          Veuillez sélectionner une étape dans le menu de gauche pour commencer.
        </p>
      </div>
    );
  }

  // --- DÉBUT DES AJOUTS ---

  // 1. Récupérer les totaux d'objectifs pour l'étape
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

  // 2. Récupérer la progression de tous les chefs pour cette étape
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

  // --- DÉBUT DE LA MODIFICATION ---

  // 4. Récupérer les IDs des chefs dont le badge a déjà été validé
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

  // 5. Filtrer la liste pour ne garder que les chefs qui attendent une révision
  const chefsEnAttenteDeRevisionIds = chefsCompletsIds.filter(
    (id) => !chefsDejaValidesIds.includes(id)
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

  // 6. Récupérer l'utilisateur connecté pour compter les notifications non lues
  const user = await getUser();
  if (!user || !("role" in user) || user.role !== "REFERENT") {
    return <div>Accès refusé</div>;
  }

  // 7. Fetch justifications à valider (SOUMISE)
  const justificationsAValider = await prisma.justification.findMany({
    where: {
      etapeId: etapeId,
      statut: "SOUMISE",
    },
    include: {
      chef: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      objectif: {
        select: {
          id: true,
          code: true,
          description: true,
        },
      },
    },
    orderBy: {
      soumiseAt: "asc",
    },
  });

  // 8. Fetch justifications en discussion (DEMANDE_PRECISION) avec count notif non lues
  const justificationsEnDiscussion = await prisma.justification.findMany({
    where: {
      etapeId: etapeId,
      statut: "DEMANDE_PRECISION",
    },
    include: {
      chef: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      objectif: {
        select: {
          id: true,
          code: true,
          description: true,
        },
      },
      commentaires: {
        include: {
          auteur: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      _count: {
        select: {
          notifications: {
            where: {
              destinataireId: user.id,
              lue: false,
              type: { in: ["NOUVEAU_COMMENTAIRE", "REPONSE_PRECISION"] },
            },
          },
        },
      },
    },
    orderBy: {
      soumiseAt: "asc",
    },
  });

  return (
    <ReferentDashboardClientV2
      justificationsAValider={justificationsAValider}
      justificationsEnDiscussion={justificationsEnDiscussion}
      chefsAReviser={chefsAReviser}
    />
  );
}