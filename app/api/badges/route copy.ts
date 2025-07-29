// // app/api/badges/route.ts
// import { badgeSchema } from "@/schemas/badgeSchema";
// import { prisma } from "@/src/lib/prisma";
// import { z } from "zod";
// import { TypeObjectif } from "@prisma/client";

// // GET /api/badges : Liste tous les badges avec leurs objectifs
// export async function GET(request: Request) {
//   try {
//     const badges = await prisma.badge.findMany({
//       include: {
//         objectifs: { orderBy: { code: "asc" } },
//       },
//       orderBy: { ordre: "asc" },
//     });

//     const data = badges.map((badge) => {
//       const competences = badge.objectifs
//         .filter((obj) => obj.type === TypeObjectif.COMPETENCE)
//         .map((obj) => ({
//           code: obj.code,
//           description: obj.description,
//         }));

//       const realisations = badge.objectifs
//         .filter((obj) => obj.type === TypeObjectif.REALISATION)
//         .map((obj) => ({
//           code: obj.code,
//           description: obj.description,
//         }));

//       return {
//         id: badge.id,
//         number: badge.number,
//         name: badge.name,
//         description: badge.description,
//         image_src: badge.image_src,
//         ordre: badge.ordre,
//         actif: badge.actif,
//         competences,
//         realisations,
//       };
//     });

//     return Response.json(data, { status: 200 });
//   } catch (error) {
//     console.error("Erreur récupération badges:", error);
//     return Response.json({ error: "Erreur serveur" }, { status: 500 });
//   }
// }

// // POST /api/badges : Création d’un badge avec compétences et réalisations
// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const validatedData = badgeSchema.parse(body);

//     const result = await prisma.$transaction(async (tx) => {
//       const newBadge = await tx.badge.create({
//         data: {
//           number: validatedData.number,
//           name: validatedData.name,
//           description: validatedData.description,
//           image_src: validatedData.image_src,
//           ordre: validatedData.ordre,
//           actif: validatedData.actif,
//         },
//       });

//       const badgeLetter = newBadge.number.replace(/^\d+/, "");
//       let currentCodeNumber = 1;

//       // Compétences
//       let competencesCount = 0;
//       if (validatedData.competences.length > 0) {
//         const competencesData = validatedData.competences.map((comp, index) => ({
//           badgeId: newBadge.id,
//           code: `${badgeLetter}${currentCodeNumber + index}`,
//           description: comp.description,
//           type: TypeObjectif.COMPETENCE,
//           fichiersRequis: false,
//         }));
//         await tx.objectif.createMany({ data: competencesData });
//         competencesCount = competencesData.length;
//         currentCodeNumber += competencesCount;
//       }

//       // Réalisations
//       let realisationsCount = 0;
//       if (validatedData.realisations.length > 0) {
//         const realisationsData = validatedData.realisations.map((realisation, index) => ({
//           badgeId: newBadge.id,
//           code: `${badgeLetter}${currentCodeNumber + index}`,
//           description: realisation.description,
//           type: TypeObjectif.REALISATION,
//           fichiersRequis: true,
//         }));
//         await tx.objectif.createMany({ data: realisationsData });
//         realisationsCount = realisationsData.length;
//       }

//       return { badge: newBadge, competencesCount, realisationsCount };
//     });

//     return Response.json(
//       {
//         id: result.badge.id,
//         number: result.badge.number,
//         name: result.badge.name,
//         description: result.badge.description,
//         image_src: result.badge.image_src,
//         actif: result.badge.actif,
//         createdAt: result.badge.createdAt.toISOString(),
//         updatedAt: result.badge.updatedAt.toISOString(),
//         competencesCount: result.competencesCount,
//         realisationsCount: result.realisationsCount,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return Response.json(
//         { error: "Données invalides", details: error.issues },
//         { status: 400 }
//       );
//     }
//     console.error("Erreur création badge:", error);
//     return Response.json({ error: "Erreur serveur" }, { status: 500 });
//   }
// }
