-- AlterTable
ALTER TABLE `users` ADD COLUMN `wpProgressionSyncAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `etapes` ADD COLUMN `wpValue` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `etapes_wpValue_key` ON `etapes`(`wpValue`);

-- AlterTable
ALTER TABLE `chef_etape_statuts` ADD COLUMN `origine` ENUM('APP', 'PLATEFORME') NOT NULL DEFAULT 'APP';

-- Correspondances connues avec la taxonomie progression de la plateforme
UPDATE `etapes` SET `wpValue` = '101' WHERE `number` = '1' AND `wpValue` IS NULL;
UPDATE `etapes` SET `wpValue` = '203' WHERE `number` = '2c' AND `wpValue` IS NULL;
UPDATE `etapes` SET `wpValue` = '206' WHERE `number` = '2f' AND `wpValue` IS NULL;
UPDATE `etapes` SET `wpValue` = '208' WHERE `number` = '2h' AND `wpValue` IS NULL;
