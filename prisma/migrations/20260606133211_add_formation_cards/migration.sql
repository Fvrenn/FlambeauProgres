-- CreateTable
CREATE TABLE `formation_cards` (
    `id` VARCHAR(191) NOT NULL,
    `etapeId` VARCHAR(191) NOT NULL,
    `titre` VARCHAR(191) NOT NULL,
    `imageUrl` TEXT NOT NULL,
    `lien` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `formation_cards_etapeId_idx`(`etapeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `formation_cards` ADD CONSTRAINT `formation_cards_etapeId_fkey` FOREIGN KEY (`etapeId`) REFERENCES `etapes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
