/*
  Warnings:

  - You are about to drop the column `blockTitle` on the `objectifs` table. All the data in the column will be lost.
  - You are about to drop the column `ordre` on the `objectifs` table. All the data in the column will be lost.
  - You are about to drop the column `requiredCount` on the `objectifs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "objectifs" DROP COLUMN "blockTitle",
DROP COLUMN "ordre",
DROP COLUMN "requiredCount";
