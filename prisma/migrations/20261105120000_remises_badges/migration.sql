-- AlterTable
ALTER TABLE `chef_etape_statuts` ADD COLUMN `remiseId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `remises_badges` (
    `id` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `creeParId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `remises_badges_creeParId_idx`(`creeParId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `chef_etape_statuts_remiseId_idx` ON `chef_etape_statuts`(`remiseId`);

-- AddForeignKey
ALTER TABLE `chef_etape_statuts` ADD CONSTRAINT `chef_etape_statuts_remiseId_fkey` FOREIGN KEY (`remiseId`) REFERENCES `remises_badges`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `remises_badges` ADD CONSTRAINT `remises_badges_creeParId_fkey` FOREIGN KEY (`creeParId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

