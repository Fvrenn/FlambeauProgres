/*
  Warnings:

  - You are about to drop the column `parentId` on the `objectifs` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "objectifs" DROP CONSTRAINT "objectifs_parentId_fkey";

-- AlterTable
ALTER TABLE "objectifs" DROP COLUMN "parentId";
