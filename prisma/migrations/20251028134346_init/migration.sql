-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CHEF', 'REFERENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "TypeObjectif" AS ENUM ('COMPETENCE', 'REALISATION');

-- CreateEnum
CREATE TYPE "StatutJustification" AS ENUM ('BROUILLON', 'AUTO_VALIDEE', 'SOUMISE', 'EN_COURS', 'DEMANDE_PRECISION', 'VALIDEE', 'REFUSEE');

-- CreateEnum
CREATE TYPE "TypeFichier" AS ENUM ('IMAGE', 'DOCUMENT', 'AUTRE');

-- CreateEnum
CREATE TYPE "TypeCommentaire" AS ENUM ('CHEF_REPONSE', 'REFERENT_QUESTION', 'REFERENT_FEEDBACK', 'SYSTEM');

-- CreateEnum
CREATE TYPE "TypeNotification" AS ENUM ('NOUVELLE_JUSTIFICATION', 'JUSTIFICATION_VALIDEE', 'JUSTIFICATION_REFUSEE', 'DEMANDE_PRECISION', 'REPONSE_PRECISION', 'BADGE_COMPLETE', 'JUSTIFICATION_URGENTE', 'NOUVEAU_COMMENTAIRE');

-- CreateTable
CREATE TABLE "troupes" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "chefDeTroupeId" TEXT,

    CONSTRAINT "troupes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "emailVerified" BOOLEAN,
    "role" "UserRole" NOT NULL DEFAULT 'CHEF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "troupeId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badges" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_src" TEXT,
    "ordre" INTEGER NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "objectifs" (
    "id" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "TypeObjectif" NOT NULL,
    "fichiersRequis" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "objectifs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "justifications" (
    "id" TEXT NOT NULL,
    "chefId" TEXT NOT NULL,
    "objectifId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "contenu" TEXT,
    "statut" "StatutJustification" NOT NULL DEFAULT 'BROUILLON',
    "version" INTEGER NOT NULL DEFAULT 1,
    "soumiseAt" TIMESTAMP(3),
    "valideeAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "justifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badge_commandes" (
    "id" TEXT NOT NULL,
    "chefId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "chefDeTroupeId" TEXT NOT NULL,
    "completeAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commandeAt" TIMESTAMP(3),

    CONSTRAINT "badge_commandes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fichiers" (
    "id" TEXT NOT NULL,
    "justificationId" TEXT NOT NULL,
    "nomOriginal" TEXT NOT NULL,
    "nomStockage" TEXT NOT NULL,
    "cheminFichier" TEXT NOT NULL,
    "type" "TypeFichier" NOT NULL,
    "mimeType" TEXT NOT NULL,
    "taille" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fichiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commentaires" (
    "id" TEXT NOT NULL,
    "justificationId" TEXT NOT NULL,
    "auteurId" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "type" "TypeCommentaire" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commentaires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badge_referents" (
    "id" TEXT NOT NULL,
    "referentId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "assigneAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignePar" TEXT,

    CONSTRAINT "badge_referents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "destinataireId" TEXT NOT NULL,
    "justificationId" TEXT,
    "type" "TypeNotification" NOT NULL,
    "titre" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "lue" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lueAt" TIMESTAMP(3),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "troupes_chefDeTroupeId_key" ON "troupes"("chefDeTroupeId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "badges_number_key" ON "badges"("number");

-- CreateIndex
CREATE UNIQUE INDEX "objectifs_badgeId_code_key" ON "objectifs"("badgeId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "justifications_chefId_objectifId_key" ON "justifications"("chefId", "objectifId");

-- CreateIndex
CREATE UNIQUE INDEX "badge_commandes_chefId_badgeId_key" ON "badge_commandes"("chefId", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "badge_referents_referentId_badgeId_key" ON "badge_referents"("referentId", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- AddForeignKey
ALTER TABLE "troupes" ADD CONSTRAINT "troupes_chefDeTroupeId_fkey" FOREIGN KEY ("chefDeTroupeId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_troupeId_fkey" FOREIGN KEY ("troupeId") REFERENCES "troupes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objectifs" ADD CONSTRAINT "objectifs_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "justifications" ADD CONSTRAINT "justifications_chefId_fkey" FOREIGN KEY ("chefId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "justifications" ADD CONSTRAINT "justifications_objectifId_fkey" FOREIGN KEY ("objectifId") REFERENCES "objectifs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "justifications" ADD CONSTRAINT "justifications_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "badge_commandes" ADD CONSTRAINT "badge_commandes_chefId_fkey" FOREIGN KEY ("chefId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "badge_commandes" ADD CONSTRAINT "badge_commandes_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "badge_commandes" ADD CONSTRAINT "badge_commandes_chefDeTroupeId_fkey" FOREIGN KEY ("chefDeTroupeId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fichiers" ADD CONSTRAINT "fichiers_justificationId_fkey" FOREIGN KEY ("justificationId") REFERENCES "justifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentaires" ADD CONSTRAINT "commentaires_justificationId_fkey" FOREIGN KEY ("justificationId") REFERENCES "justifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentaires" ADD CONSTRAINT "commentaires_auteurId_fkey" FOREIGN KEY ("auteurId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "badge_referents" ADD CONSTRAINT "badge_referents_referentId_fkey" FOREIGN KEY ("referentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "badge_referents" ADD CONSTRAINT "badge_referents_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_destinataireId_fkey" FOREIGN KEY ("destinataireId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_justificationId_fkey" FOREIGN KEY ("justificationId") REFERENCES "justifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
