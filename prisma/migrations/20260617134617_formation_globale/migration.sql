-- DropForeignKey
ALTER TABLE `formation_cards` DROP FOREIGN KEY `formation_cards_etapeId_fkey`;

-- DropIndex
DROP INDEX `formation_cards_etapeId_idx` ON `formation_cards`;

-- AlterTable
ALTER TABLE `formation_cards` DROP COLUMN `etapeId`;
