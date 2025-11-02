/*
  Warnings:

  - The values [etape_COMPLETE] on the enum `TypeNotification` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `chefDeTroupeId` on the `troupes` table. All the data in the column will be lost.
  - You are about to drop the `etape_commandes` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "StatutChefEtape" AS ENUM ('NON_COMMENCE', 'EN_COURS', 'EN_REVISION', 'VALIDE');

-- AlterEnum
BEGIN;
CREATE TYPE "TypeNotification_new" AS ENUM ('NOUVELLE_JUSTIFICATION', 'JUSTIFICATION_VALIDEE', 'JUSTIFICATION_REFUSEE', 'DEMANDE_PRECISION', 'REPONSE_PRECISION', 'ETAPE_COMPLETE', 'JUSTIFICATION_URGENTE', 'NOUVEAU_COMMENTAIRE');
ALTER TABLE "notifications" ALTER COLUMN "type" TYPE "TypeNotification_new" USING ("type"::text::"TypeNotification_new");
ALTER TYPE "TypeNotification" RENAME TO "TypeNotification_old";
ALTER TYPE "TypeNotification_new" RENAME TO "TypeNotification";
DROP TYPE "public"."TypeNotification_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."etape_commandes" DROP CONSTRAINT "etape_commandes_chefDeTroupeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."etape_commandes" DROP CONSTRAINT "etape_commandes_chefId_fkey";

-- DropForeignKey
ALTER TABLE "public"."etape_commandes" DROP CONSTRAINT "etape_commandes_etapeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."troupes" DROP CONSTRAINT "troupes_chefDeTroupeId_fkey";

-- DropIndex
DROP INDEX "public"."troupes_chefDeTroupeId_key";

-- AlterTable
ALTER TABLE "troupes" DROP COLUMN "chefDeTroupeId";

-- DropTable
DROP TABLE "public"."etape_commandes";

-- CreateTable
CREATE TABLE "chef_etape_statuts" (
    "id" TEXT NOT NULL,
    "chefId" TEXT NOT NULL,
    "etapeId" TEXT NOT NULL,
    "statut" "StatutChefEtape" NOT NULL DEFAULT 'EN_COURS',
    "valideeAt" TIMESTAMP(3),
    "valideeParId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chef_etape_statuts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "chef_etape_statuts_chefId_etapeId_key" ON "chef_etape_statuts"("chefId", "etapeId");

-- AddForeignKey
ALTER TABLE "chef_etape_statuts" ADD CONSTRAINT "chef_etape_statuts_chefId_fkey" FOREIGN KEY ("chefId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chef_etape_statuts" ADD CONSTRAINT "chef_etape_statuts_etapeId_fkey" FOREIGN KEY ("etapeId") REFERENCES "etapes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chef_etape_statuts" ADD CONSTRAINT "chef_etape_statuts_valideeParId_fkey" FOREIGN KEY ("valideeParId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
