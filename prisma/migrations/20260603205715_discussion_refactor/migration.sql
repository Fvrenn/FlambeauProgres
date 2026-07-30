/*
  Warnings:

  - You are about to drop the column `version` on the `justifications` table. All the data in the column will be lost.
  - The values [EN_COURS,REFUSEE] on the enum `justifications_statut` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `commentaires` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[messageId]` on the table `fichiers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `messageId` to the `fichiers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `commentaires` DROP FOREIGN KEY `commentaires_auteurId_fkey`;

-- DropForeignKey
ALTER TABLE `commentaires` DROP FOREIGN KEY `commentaires_justificationId_fkey`;

-- AlterTable
ALTER TABLE `fichiers` ADD COLUMN `messageId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `justifications` DROP COLUMN `version`,
    MODIFY `statut` ENUM('BROUILLON', 'AUTO_VALIDEE', 'SOUMISE', 'DEMANDE_PRECISION', 'VALIDEE') NOT NULL DEFAULT 'BROUILLON';

-- DropTable
DROP TABLE `commentaires`;

-- CreateTable
CREATE TABLE `messages` (
    `id` VARCHAR(191) NOT NULL,
    `justificationId` VARCHAR(191) NOT NULL,
    `auteurId` VARCHAR(191) NOT NULL,
    `contenu` VARCHAR(191) NULL,
    `type` ENUM('USER', 'SYSTEM') NOT NULL DEFAULT 'USER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `fichiers_messageId_key` ON `fichiers`(`messageId`);

-- AddForeignKey
ALTER TABLE `fichiers` ADD CONSTRAINT `fichiers_messageId_fkey` FOREIGN KEY (`messageId`) REFERENCES `messages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_justificationId_fkey` FOREIGN KEY (`justificationId`) REFERENCES `justifications`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_auteurId_fkey` FOREIGN KEY (`auteurId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
