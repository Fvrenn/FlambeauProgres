/*
  Warnings:

  - You are about to drop the `badge_referents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `badges` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `commentaires` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fichiers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `justifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `objectifs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "badge_referents" DROP CONSTRAINT "badge_referents_badgeId_fkey";

-- DropForeignKey
ALTER TABLE "badge_referents" DROP CONSTRAINT "badge_referents_referentId_fkey";

-- DropForeignKey
ALTER TABLE "commentaires" DROP CONSTRAINT "commentaires_auteurId_fkey";

-- DropForeignKey
ALTER TABLE "commentaires" DROP CONSTRAINT "commentaires_justificationId_fkey";

-- DropForeignKey
ALTER TABLE "fichiers" DROP CONSTRAINT "fichiers_justificationId_fkey";

-- DropForeignKey
ALTER TABLE "justifications" DROP CONSTRAINT "justifications_badgeId_fkey";

-- DropForeignKey
ALTER TABLE "justifications" DROP CONSTRAINT "justifications_chefId_fkey";

-- DropForeignKey
ALTER TABLE "justifications" DROP CONSTRAINT "justifications_objectifId_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_destinataireId_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_justificationId_fkey";

-- DropForeignKey
ALTER TABLE "objectifs" DROP CONSTRAINT "objectifs_badgeId_fkey";

-- DropTable
DROP TABLE "badge_referents";

-- DropTable
DROP TABLE "badges";

-- DropTable
DROP TABLE "commentaires";

-- DropTable
DROP TABLE "fichiers";

-- DropTable
DROP TABLE "justifications";

-- DropTable
DROP TABLE "notifications";

-- DropTable
DROP TABLE "objectifs";

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "StatutJustification";

-- DropEnum
DROP TYPE "TypeCommentaire";

-- DropEnum
DROP TYPE "TypeFichier";

-- DropEnum
DROP TYPE "TypeNotification";

-- DropEnum
DROP TYPE "TypeObjectif";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
