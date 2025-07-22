/*
  Warnings:

  - You are about to drop the column `code` on the `badges` table. All the data in the column will be lost.
  - You are about to drop the column `icone` on the `badges` table. All the data in the column will be lost.
  - You are about to drop the column `nom` on the `badges` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[number]` on the table `badges` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `badges` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `badges` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `badges` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "badges_code_key";

-- AlterTable
ALTER TABLE "badges" DROP COLUMN "code",
DROP COLUMN "icone",
DROP COLUMN "nom",
ADD COLUMN     "image_src" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "number" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "objectifs" ADD COLUMN     "blockTitle" TEXT,
ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "requiredCount" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "badges_number_key" ON "badges"("number");

-- AddForeignKey
ALTER TABLE "objectifs" ADD CONSTRAINT "objectifs_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "objectifs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
