import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// Initialisation du client Prisma
const prisma = new PrismaClient();

// Créer une instance de Better Auth sans le plugin Next.js pour le seed
const authForSeed = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
  },
  // Pas de plugin nextCookies() ici
});

// Mot de passe par défaut pour tous les utilisateurs de test
const defaultPassword = "password123";

async function main() {
  console.log("Start seeding...");

  // --- 1. Nettoyage de la base (dans le bon ordre) ---
  console.log("Cleaning database...");
  await prisma.etapeReferent.deleteMany();
  await prisma.etapeCommande.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.commentaire.deleteMany();
  await prisma.fichier.deleteMany();
  await prisma.justification.deleteMany();
  await prisma.objectif.deleteMany();
  await prisma.etape.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.troupe.deleteMany();
  console.log("Database cleaned.");

  // --- 2. Création de la Troupe ---
  const troupe = await prisma.troupe.create({
    data: {
      nom: "Troupe de Paris 11e",
    },
  });
  console.log(`Created troupe: ${troupe.nom}`);

  // --- 3. Création des Utilisateurs via Better Auth API ---

  // L'Admin (n'appartient à aucune troupe)
  const adminResult = await authForSeed.api.signUpEmail({
    body: {
      email: "admin@flambeau.dev",
      name: "Admin",
      password: defaultPassword,
    },
  });

  // Mettre à jour le rôle de l'admin
  const admin = await prisma.user.update({
    where: { id: adminResult.user.id },
    data: { role: "ADMIN" },
  });

  // Le Chef de Troupe (est aussi un CHEF)
  const chefDeTroupeResult = await authForSeed.api.signUpEmail({
    body: {
      email: "cheftroupe@flambeau.dev",
      name: "Sylvain Lavoue",
      password: defaultPassword,
    },
  });

  const chefDeTroupe = await prisma.user.update({
    where: { id: chefDeTroupeResult.user.id },
    data: {
      role: "CHEF",
      troupeId: troupe.id,
    },
  });

  // Mettre à jour la troupe avec son chef
  await prisma.troupe.update({
    where: { id: troupe.id },
    data: { chefDeTroupeId: chefDeTroupe.id },
  });

  // Un Chef simple
  const chef1Result = await authForSeed.api.signUpEmail({
    body: {
      email: "chef@flambeau.dev",
      name: "Timothé Chef",
      password: defaultPassword,
    },
  });

  const chef1 = await prisma.user.update({
    where: { id: chef1Result.user.id },
    data: {
      role: "CHEF",
      troupeId: troupe.id,
    },
  });

  // Un Référent
  const referentResult = await authForSeed.api.signUpEmail({
    body: {
      email: "referent@flambeau.dev",
      name: "Martin Référent",
      password: defaultPassword,
    },
  });

  const referent = await prisma.user.update({
    where: { id: referentResult.user.id },
    data: {
      role: "REFERENT",
      troupeId: troupe.id,
    },
  });

  console.log("Users created.");

  // --- 4. Création des etapes & Objectifs ---
  // (Section entièrement mise à jour avec tes 11 etapes)

  const etape2B = await prisma.etape.create({
    data: {
      number: "2b",
      name: "Branche Petits Flambeaux",
      description:
        "Cette spécialité s'adresse bien entendu aux Chefs de la branche Petits Flambeaux. C'est une étape indispensable pour être Chef de Troupe de cette branche...",
      image_src: "/etapes/2b-spe_PF.svg",
      ordre: 1,
      objectifs: {
        create: [
          {
            code: "B1",
            description: 'Acquérir et savoir utiliser le "Guide du Bois" (p. 9 à 11)',
            type: "COMPETENCE",
          },
          {
            code: "B2",
            description:
              "Se repérer dans le carnet et savoir expliquer l'ordre et le principe des différentes parties de chaque volume.",
            type: "COMPETENCE",
          },
          {
            code: "B3",
            description:
              'Lire le chapitre "L\'enfant à l\'âge PF" p.19 du Guide du Bois et animer une discussion...',
            type: "COMPETENCE",
          },
          {
            code: "B4",
            description:
              "Observer les jeunes de ta sizaine, noter pour chacun d'eux les domaines dans lesquels il peut progresser...",
            type: "COMPETENCE",
          },
          {
            code: "B5",
            description:
              "Connaître les grandes lignes de l'histoire des ABQS, le rôle des 5 personnages principaux...",
            type: "COMPETENCE",
          },
          {
            code: "B6",
            description:
              "Expliquer aux jeunes le sens des différents rituels (rassemblement, Grand Arbre...) et connaître la place des différents marqueurs sur l'uniforme.",
            type: "COMPETENCE",
          },
          {
            code: "B7",
            description: "Accompagner un ami du Bois dans toute la démarche de la Parole de PF.",
            type: "COMPETENCE",
          },
          {
            code: "B8",
            description:
              "Concevoir un jeu, un Cercle du Feu et un Grand Arbre en lien avec l'imaginaire des ABQS...",
            type: "REALISATION",
            fichiersRequis: true,
          },
          {
            code: "B9",
            description:
              'Proposer une ressource pédagogique (autre qu\'une fiche d\'animation) pour compléter la partie "Bois Tahouti" du "Guide du Bois"',
            type: "REALISATION",
            fichiersRequis: true,
          },
        ],
      },
    },
  });
  console.log(`Created etape: ${etape2B.name}`);

  const etape2C = await prisma.etape.create({
    data: {
      number: "2c",
      name: "Branche Flambeaux",
      description:
        "Cette spécialité s'adresse bien entendu aux Chefs de la branche Flambeaux. C'est une étape indispensable pour être Chef de Troupe de cette branche...",
      image_src: "/etapes/2c-spe_F.svg",
      ordre: 2,
      objectifs: {
        create: [
          {
            code: "C1",
            description:
              'Acquérir, savoir utiliser les ressources pour les jeunes et les Chefs... et savoir accompagner les jeunes dans l\'utilisation du carnet "Empreintes"',
            type: "COMPETENCE",
          },
          {
            code: "C2",
            description:
              "Etre capable d'expliquer la notion d'engagement et la Loi Flambeaux et accompagner un jeune tout au long de cette démarche...",
            type: "COMPETENCE",
          },
          {
            code: "C3",
            description:
              "Maîtriser le sens et les objectifs des étapes Flambeaux et être capable d'intégrer la progression...",
            type: "COMPETENCE",
          },
          {
            code: "C4",
            description:
              "Connaître le fonctionnement et les objectifs du système de patrouille. Mettre en place le cadre permettant une vie de patrouille...",
            type: "COMPETENCE",
          },
          {
            code: "C5",
            description:
              "Accompagner individuellement les membres de la HP dans leur responsabilités. Organiser 3 CDC au cours de l'année...",
            type: "COMPETENCE",
          },
          {
            code: "C6",
            description:
              "Suivre individuellement 4 à 6 jeunes de ton groupe, apprendre à les connaître, être capable de les écouter et les conseiller...",
            type: "COMPETENCE",
          },
          {
            code: "C7",
            description:
              "Connaître et rappeler le sens et l'objectif des différentes traditions (folklore national et de groupe).Encourager et accompagner le développement...",
            type: "COMPETENCE",
          },
          {
            code: "C8",
            description:
              "Accompagner les projets de patrouille pendant l'année ou le camp (initier les projets, veiller à la démarche...)",
            type: "REALISATION",
            fichiersRequis: true,
          },
          {
            code: "C9",
            description:
              "Réalise une fiche ressource pour les Chefs spécifique à la branche Flambeaux (fiche activité : jeu, CDF ... ou fiche technique : PA, formation HP ...)",
            type: "REALISATION",
            fichiersRequis: true,
          },
        ],
      },
    },
  });
  console.log(`Created etape: ${etape2C.name}`);

  const etape2E = await prisma.etape.create({
    data: {
      number: "2e",
      name: "Animation",
      description:
        "Qui parmi les Chefs n’est pas animateur? A tous de lancer un jeu impromptu et de savoir gérer une courbe de veillée...",
      image_src: "/etapes/2e-spe_animation.svg",
      ordre: 3,
      objectifs: {
        create: [
          {
            code: "E1",
            description:
              "Maîtriser les paramètres pour un temps d'animation réussi et organiser un temps d'échange libre en maîtrise...",
            type: "COMPETENCE",
          },
          {
            code: "E2",
            description:
              "Connaître les spécificités des différents styles de jeux (nuit/approche, plateau, capture, stratégie, ...)",
            type: "COMPETENCE",
          },
          {
            code: "E3",
            description:
              "Transmission aux jeunes: préparer une activité avec des jeunes volontaires ou les PA animation jeunes.",
            type: "COMPETENCE",
          },
          {
            code: "E4",
            description:
              "Maîtriser le folklore national et proposer un cadre propre au groupe pour les temps de rassemblement...",
            type: "COMPETENCE",
          },
          {
            code: "E5",
            description:
              "Prendre la responsabilité d’un temps de chant régulier à chaque rencontre.",
            type: "COMPETENCE",
          },
          {
            code: "E6",
            description:
              "Gérer le matériel pédagogique de la troupe en lien avec le PA matériel (matériel de jeu, bricolage ...)",
            type: "COMPETENCE",
          },
          {
            code: "E7",
            description: "Avoir validé le BAFA",
            type: "COMPETENCE",
          },
          {
            code: "E8",
            description:
              "Être chargé de l’imaginaire de groupe ou de camp, le faire vivre et le décliner dans les différents temps...",
            type: "REALISATION",
            fichiersRequis: true,
          },
          {
            code: "E9",
            description:
              "Inventer un jeu, et l'utiliser à plusieurs reprises en tenant compte des retours des jeunes et des Chefs pour l'améliorer...",
            type: "REALISATION",
            fichiersRequis: true,
          },
        ],
      },
    },
  });
  console.log(`Created etape: ${etape2E.name}`);

  const etape2F = await prisma.etape.create({
    data: {
      number: "2f",
      name: "Communication",
      description:
        "La communication est le système nerveux du groupe, qu’elle soit interne ou en lien avec les différents partenaires...",
      image_src: "/etapes/2f-spe_communication.svg",
      ordre: 4,
      objectifs: {
        create: [
          {
            code: "F1",
            description:
              "Savoir communiquer de manière pertinente avec les jeunes en fonction de leur âge...",
            type: "COMPETENCE",
          },
          {
            code: "F2",
            description:
              "Mettre en place et coordonner un temps d'échange et de prière régulier avec la maîtrise...",
            type: "COMPETENCE",
          },
          {
            code: "F3",
            description:
              "Veiller à l'information des partenaires (Eglise(s), partenaires locaux, Mouvement ..) en adaptant les moyens...",
            type: "COMPETENCE",
          },
          {
            code: "F4",
            description: "Garder un lien avec les parents par différents moyens (réunion de rentrée...)",
            type: "COMPETENCE",
          },
          {
            code: "F5",
            description:
              "Encourager la prise de photos régulières et l'utilisation des nouvelles technologies... en veillant au respect du droit à l'image...",
            type: "COMPETENCE",
          },
          {
            code: "F6",
            description:
              "Connaître le bon usage (net étiquette, réactivité ...) et les limites de la communication par courriel.",
            type: "COMPETENCE",
          },
          {
            code: "F7",
            description:
              "Savoir diriger une réunion d'équipe (...) et savoir rédiger un compte-rendu fidèle et synthétique.",
            type: "COMPETENCE",
          },
          {
            code: "F8",
            description:
              "Intervenir dans la préparation et l’animation d’un évènement lié à la promotion du groupe ou du Mouvement...",
            type: "REALISATION",
            fichiersRequis: true,
          },
          {
            code: "F9",
            description:
              "Développer un outil de communication (clip vidéo, blog ou site-web, prospectus ...) au profit des Flambeaux...",
            type: "REALISATION",
            fichiersRequis: true,
          },
        ],
      },
    },
  });
  console.log(`Created etape: ${etape2F.name}`);

  // J'assigne celui-ci à la variable `etapeConstruction` pour la fin du script
  const etapeConstruction = await prisma.etape.create({
    data: {
      number: "2g",
      name: "Construction",
      description:
        "Vivre dans la nature d'accord, mais pas à n'importe quelle condition ! La maîtrise des nœuds, des outils et des techniques...",
      image_src: "/etapes/2g-spe_construction.svg",
      ordre: 5,
      objectifs: {
        create: [
          {
            code: "G1",
            description:
              "Maîtriser l'utilisation des outils de ta troupe, connaître leur utilité et leur entretien...",
            type: "COMPETENCE",
          },
          {
            code: "G2",
            description:
              "Organiser une activité autour de l'apprentissage des nœuds avec les jeunes...",
            type: "COMPETENCE",
          },
          {
            code: "G3",
            description:
              "Maîtriser les techniques d'assemblage (brêlage, froissartage ...) et les notions assurant la solidité...",
            type: "COMPETENCE",
          },
          {
            code: "G4",
            description:
              "Utiliser de manière responsable les ressources naturelles pour les constructions...",
            type: "COMPETENCE",
          },
          {
            code: "G5",
            description:
              "Savoir tendre rapidement une bâche et prévoir le matériel nécessaire pour se protéger...",
            type: "COMPETENCE",
          },
          {
            code: "G6",
            description:
              "Accompagner les jeunes dans les différentes étapes (...) de la réalisation de leur construction d'équipe...",
            type: "COMPETENCE",
          },
          {
            code: "G7",
            description:
              "Lors de l'installation d'un camp, connaître tous les paramètres et la façon de les prendre en compte.",
            type: "COMPETENCE",
          },
          {
            code: "G8",
            description:
              "Participer activement à l'installation d'un camp en procédant un repérage du lieu en amont...",
            type: "REALISATION",
            fichiersRequis: true,
          },
          {
            code: "G9",
            description:
              "Concevoir le plan et réaliser une installation collective originale de camp en utilisant les différents techniques apprises...",
            type: "REALISATION",
            fichiersRequis: true,
          },
        ],
      },
    },
  });
  console.log(`Created etape: ${etapeConstruction.name}`);

  const etapeCuisine = await prisma.etape.create({
    data: {
      number: "2h",
      name: "Cuisine",
      description:
        "Savoir cuisiner est un art, un devoir lorsqu'on veut défendre la gastronomie française...",
      image_src: "/etapes/2h-spe_cuisine.svg",
      ordre: 6,
      objectifs: {
        create: [
          {
            code: "H1",
            description: "Réaliser un carnet de 30 recettes avec : 10 plats adaptés au plein air...",
            type: "COMPETENCE",
          },
          {
            code: "H2",
            description:
              "Veiller au respect des règles de base de l'hygiène en cuisine et mettre en place deux actions de sensibilisation...",
            type: "COMPETENCE",
          },
          {
            code: "H3",
            description:
              "Accompagner les jeunes dans la transmission d’une nouvelle technique de cuisine.",
            type: "COMPETENCE",
          },
          {
            code: "H4",
            description:
              "Être responsable de la disponibilité et de l’état du matériel de cuisine...",
            type: "COMPETENCE",
          },
          {
            code: "H5",
            description:
              "Connaître les portions théoriques individuelles et savoir les adapter en fonction du public...",
            type: "COMPETENCE",
          },
          {
            code: "H6",
            description:
              "Établir des menus équilibrés et adaptés au différents temps et contraintes... et savoir gérer les régimes alimentaires...",
            type: "COMPETENCE",
          },
          {
            code: "H7",
            description:
              "Savoir inclure une réflexion éthique dans l'élaboration des menus : utiliser des légumes de saison...",
            type: "COMPETENCE",
          },
          {
            code: "H8",
            description:
              "Lors d’un WE ou d’un camp, gérer l'installation de la cuisine et optimiser son agencement...",
            type: "REALISATION",
            fichiersRequis: true,
          },
          {
            code: "H9a",
            description:
              "Réaliser un menu complet pour un évènement particulier (...) et préparer le repas avec l’aide des jeunes.",
            type: "REALISATION",
            fichiersRequis: true,
          },
          {
            code: "H9b",
            description:
              "Organiser un concours cuisine de A à Z (constitution des équipes, critères d’évaluation...)",
            type: "REALISATION",
            fichiersRequis: true,
          },
        ],
      },
    },
  });
  console.log(`Created etape: ${etapeCuisine.name}`);

  const etape2I = await prisma.etape.create({
    data: {
      number: "2i",
      name: "Exploration",
      description:
        "Vous vous passionnez pour les cartes, boussoles et signes de piste car chaque voyage est une aventure...",
      image_src: "/etapes/2i-spe_explo.svg",
      ordre: 7,
      objectifs: {
        create: [
          {
            code: "I1",
            description:
              "Savoir créer un itinéraire de randonnée et adapter la difficulté en fonction du niveau des jeunes...",
            type: "COMPETENCE",
          },
          {
            code: "I2",
            description:
              "Maîtriser la lecture de cartes de randonnée (légendes, codes couleurs, dénivelés remarquables...)",
            type: "COMPETENCE",
          },
          {
            code: "I3",
            description:
              "Savoir s'orienter avec une boussole à visée, savoir utiliser les azimuts et connaître d’autres techniques...",
            type: "COMPETENCE",
          },
          {
            code: "I4",
            description:
              "Connaître et faire appliquer la réglementation et les consignes de sécurité : code la route...",
            type: "COMPETENCE",
          },
          {
            code: "I5",
            description:
              "Etre capable d'organiser rapidement un bivouac à un endroit autorisé et de monter un abri en bâche...",
            type: "COMPETENCE",
          },
          {
            code: "I6",
            description:
              "Présenter une exploration et organiser la répartition des groupes de façon attractive et ludique...",
            type: "COMPETENCE",
          },
          {
            code: "I7",
            description:
              "Développer une spécialité autour de la randonnée : rando sportive, course d'orientation...",
            type: "COMPETENCE",
          },
          {
            code: "I8",
            description:
              "Préparer et réaliser une activité d’orientation impliquant la manipulation de carte et boussole.",
            type: "REALISATION",
            fichiersRequis: true,
          },
          {
            code: "I9",
            description:
              "Concevoir avec les jeunes un projet de randonnée (sur 2 jours avec hébergement et repas)...",
            type: "REALISATION",
            fichiersRequis: true,
          },
        ],
      },
    },
  });
  console.log(`Created etape: ${etape2I.name}`);

  const etape2J = await prisma.etape.create({
    data: {
      number: "2j",
      name: "Intendance",
      description:
        "Le trésorier a une fonction stratégique. Même si la gestion des finances demande un peu de discipline...",
      image_src: "/etapes/2j-spe_intendance.svg",
      ordre: 8,
      objectifs: {
        create: [
          {
            code: "J1",
            description:
              "Etablir le budget d'un WE en anticipant un maximum les recettes et les dépenses...",
            type: "COMPETENCE",
          },
          {
            code: "J2",
            description:
              "Etre responsable de la caisse du groupe ou du camp et tenir le tableau (opérations) et le cahier (justificatifs)...",
            type: "COMPETENCE",
          },
          {
            code: "J3",
            description:
              "Collecter les inscriptions et les cotisations des jeunes, établir des reçus le cas échéant...",
            type: "COMPETENCE",
          },
          {
            code: "J5",
            description:
              "Accompagner les jeunes dans l'établissement d'une liste de courses à partir d'un menu...",
            type: "COMPETENCE",
          },
          {
            code: "J4",
            description:
              "Gérer le stock alimentaire du groupe (dates de péremption, relevé des t° du réfrigérateur ...)",
            type: "COMPETENCE",
          },
          {
            code: "J6",
            description:
              "Définir un plan de financement pour un investissement du groupe et suivre sa réalisation jusqu'à l'achat.",
            type: "COMPETENCE",
          },
          {
            code: "J7",
            description:
              "Mettre en place un fonctionnement permettant de prendre en compte les familles qui ont peu de ressources...",
            type: "COMPETENCE",
          },
          {
            code: "J8",
            description:
              "Assurer la fonction de trésorier pendant l'année ou un camp, depuis le budget jusqu'au bilan...",
            type: "REALISATION",
            fichiersRequis: true,
          },
          {
            code: "J9",
            description:
              "Coordonner une opération de collecte de fonds (choix du projet, communication, organisation...) au profit d’un projet...",
            type: "REALISATION",
            fichiersRequis: true,
          },
        ],
      },
    },
  });
  console.log(`Created etape: ${etape2J.name}`);

  const etape2K = await prisma.etape.create({
    data: {
      number: "2k",
      name: "Matériel",
      description:
        "En tant que responsable matériel, tu es le fournisseur de moyens de ton équipe...",
      image_src: "/etapes/2k-spe_materiel.svg",
      ordre: 9,
      objectifs: {
        create: [
          {
            code: "K1",
            description:
              "Réaliser un inventaire complet du matériel à disposition et de son état. Faire le tri, marquer le matériel...",
            type: "COMPETENCE",
          },
          {
            code: "K2",
            description:
              "Avec l'ensemble de l'équipe, faire la liste du matériel à acheter et définir les priorités...",
            type: "COMPETENCE",
          },
          {
            code: "K3",
            description:
              "Organiser un stockage fonctionnel du matériel (rangement par catégorie, identification...)",
            type: "COMPETENCE",
          },
          {
            code: "K4",
            description:
              "Connaître les bases de l'entretien du matériel et des outils (huilage outils, séchage tentes ...)",
            type: "COMPETENCE",
          },
          {
            code: "K5",
            description:
              "Réfléchir et mettre en œuvre des alternatives à l'achat de matériel neuf... : achat d'occasion, marchés aux puces...",
            type: "COMPETENCE",
          },
          {
            code: "K6",
            description:
              "Savoir évaluer le volume et la masse du matériel et maîtriser les contraintes du chargement...",
            type: "COMPETENCE",
          },
          {
            code: "K7",
            description:
              "Réaliser une liste de fournitures et de consommables (ficelle, bâche, recharge gaz ...) en indiquant leur prix...",
            type: "COMPETENCE",
          },
          {
            code: "K8",
            description:
              "Réalise une installation permettant d'optimiser le rangement et/ou la mise à disposition du matériel...",
            type: "REALISATION",
            fichiersRequis: true,
          },
          {
            code: "K9",
            description:
              "En lien avec les jeunes, identifier un besoin (malle de patrouille, malle d'activité...), définir le contenu type...",
            type: "REALISATION",
            fichiersRequis: true,
          },
        ],
      },
    },
  });
  console.log(`Created etape: ${etape2K.name}`);

  const etape2L = await prisma.etape.create({
    data: {
      number: "2l",
      name: "Nature",
      description:
        "Apprendre à connaître la nature c'est apprendre à l'aimer et donc à la protéger...",
      image_src: "/etapes/2l-spe_nature.svg",
      ordre: 10,
      objectifs: {
        create: [
          {
            code: "L1",
            description:
              "Réaliser un jeu à postes permettant de développer les connaissances des jeunes sur la nature environnante...",
            type: "COMPETENCE",
          },
          {
            code: "L2",
            description:
              "Reconnaître 5 formations nuageuses et savoir interpréter différents signes naturels...",
            type: "COMPETENCE",
          },
          {
            code: "L3",
            description:
              "Savoir aménager son campement, les installations et le coin du feu en respectant les lieux...",
            type: "COMPETENCE",
          },
          {
            code: "L4",
            description:
              "Connaître différents indicateurs d'impact (bilan carbone, quantité d'eau...) et sensibiliser le groupe...",
            type: "COMPETENCE",
          },
          {
            code: "L5",
            description:
              "Organiser une sortie avec un naturaliste ou un forestier pour découvrir la richesse d'un écosystème...",
            type: "COMPETENCE",
          },
          {
            code: "L6",
            description:
              "Organiser avec les jeunes la réalisation d'un objet utile ou décoratif à partir d'éléments naturels...",
            type: "COMPETENCE",
          },
          {
            code: "L7",
            description:
              "Développer une connaissance approfondie dans un domaine particulier (insectes, arbres...) ou une compétence...",
            type: "COMPETENCE",
          },
          {
            code: "L8",
            description:
              "Réaliser un carnet qui permet d'identifier les éléments naturels disponibles ayant une utilisation pratique...",
            type: "REALISATION",
            fichiersRequis: true,
          },
          {
            code: "L9",
            description:
              "Accompagner les jeunes dans la réalisation d'une action en faveur de la nature (nettoyage d'un terrain...)",
            type: "REALISATION",
            fichiersRequis: true,
          },
        ],
      },
    },
  });
  console.log(`Created etape: ${etape2L.name}`);

  const etape2M = await prisma.etape.create({
    data: {
      number: "2m",
      name: "Santé",
      description:
        "En camp ou au cours de l'année, l'assistant sanitaire joue un rôle indispensable...",
      image_src: "/etapes/2m-sante.svg",
      ordre: 11,
      objectifs: {
        create: [
          {
            code: "M0",
            description: "Passer le diplôme du PSC1",
            type: "COMPETENCE",
          },
          {
            code: "M1",
            description:
              "Connaître le contenu type d'une trousse de secours, savoir expliquer l'utilité...",
            type: "COMPETENCE",
          },
          {
            code: "M2",
            description:
              "Savoir prodiguer les soins de base (coupure/plaie, brûlure, tique, coup de chaud...)",
            type: "COMPETENCE",
          },
          {
            code: "M3",
            description:
              "Savoir évaluer la gravité d'une situation et agir en conséquence tout en connaissant ses limites...",
            type: "COMPETENCE",
          },
          {
            code: "M4",
            description:
              "Connaître et mettre à jour les affichages obligatoires en accueil de mineurs...",
            type: "COMPETENCE",
          },
          {
            code: "M5",
            description:
              "Veiller aux moyens et à la mise en œuvre des actions de prévention (casquette et boisson régulière...)",
            type: "COMPETENCE",
          },
          {
            code: "M6",
            description:
              "Avec un(e)Chef/taine de l'autre sexe, organiser et veiller au bon déroulement du temps de douche...",
            type: "COMPETENCE",
          },
          {
            code: "M7",
            description:
              "Encourager le rangement des affaires personnelles en organisant une inspection des tentes...",
            type: "COMPETENCE",
          },
          {
            code: "M8",
            description:
              "Assurer la fonction d'assistant sanitaire pendant l'année ou le camp, en veillant au contenu...",
            type: "REALISATION",
            fichiersRequis: true,
          },
          {
            code: "M9",
            description:
              "Mettre en place une action de sensibilisation à l'hygiène corporelle et une action de prévention aux accidents...",
            type: "REALISATION",
            fichiersRequis: true,
          },
        ],
      },
    },
  });
  console.log(`Created etape: ${etape2M.name}`);

  const etape2N = await prisma.etape.create({
    data: {
      number: "2n",
      name: "Vie Spirituelle",
      description:
        "Cercle du Feu, engagement spirituel, échanges personnels ... chaque Chef est concerné par la vie spirituelle du groupe...",
      image_src: "/etapes/2n-spe_vie_spi.svg",
      ordre: 12,
      objectifs: {
        create: [
          {
            code: "N1",
            description:
              "Etre capable de faire des canevas de Cercles du Feu et de méditations personnelles.",
            type: "COMPETENCE",
          },
          {
            code: "N2",
            description:
              "Lister les outils et les ressources permettant aux Chefs de renouveler les Cercle du Feu...",
            type: "COMPETENCE",
          },
          {
            code: "N3",
            description:
              "Encourager la prise d’initiative des jeunes dans l’expression de leur foi en les accompagnant...",
            type: "COMPETENCE",
          },
          {
            code: "N4",
            description:
              "Être capable de conduire d’autres formes de temps spi: culte Flambeaux, Veillée spi...",
            type: "COMPETENCE",
          },
          {
            code: "N5",
            description:
              "Veiller à laisser à chaque jeune un espace pour grandir spirituellement tout en forgeant ses propres convictions...",
            type: "COMPETENCE",
          },
          {
            code: "N6",
            description:
              "Mettre en place une action régulière pour sensibiliser l’Eglise et/ou les Amis Flambeaux aux défis spi du groupe.",
            type: "COMPETENCE",
          },
          {
            code: "N7",
            description:
              "Mettre en œuvre deux actions pour encourager les Chefs à mettre en place un suivi personnalisé de chaque jeune.",
            type: "COMPETENCE",
          },
          {
            code: "N8a",
            description:
              "Organiser un cycle cohérent de Cercle du Feu sur un camp ou un trimestre à partir d'un thème...",
            type: "REALISATION",
            fichiersRequis: true,
          },
          {
            code: "N8b",
            description: "Mettre en place un parrainage spi des Chefs par l'Eglise.",
            type: "REALISATION",
            fichiersRequis: true,
          },
          {
            code: "N8c",
            description:
              "Monter une journée d'action dans la ville (témoignage par les actes).",
            type: "REALISATION",
            fichiersRequis: true,
          },
        ],
      },
    },
  });
  console.log(`Created etape: ${etape2N.name}`);

  // --- 5. Assignation du Référent ---
  // On assigne 'Martin Référent' au etape 'Construction' (2G)
  await prisma.etapeReferent.create({
    data: {
      referentId: referent.id,
      etapeId: etapeConstruction.id, // 'etapeConstruction' est le etape 2G
      assignePar: admin.id,
    },
  });
  console.log("Assigned referent to etape.");

  console.log(
    `\nSeeding finished. \nDefault password for all users: "${defaultPassword}"`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });