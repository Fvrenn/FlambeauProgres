-- AlterTable
ALTER TABLE `justifications` ADD COLUMN `valideeParId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `justifications` ADD CONSTRAINT `justifications_valideeParId_fkey` FOREIGN KEY (`valideeParId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Backfill
UPDATE `justifications` `j`
SET `j`.`valideeParId` = (
  SELECT `m`.`auteurId`
  FROM `messages` `m`
  WHERE `m`.`justificationId` = `j`.`id` AND `m`.`type` = 'SYSTEM'
  ORDER BY `m`.`createdAt` DESC
  LIMIT 1
)
WHERE `j`.`statut` = 'VALIDEE'
  AND `j`.`valideeParId` IS NULL
  AND EXISTS (
    SELECT 1 FROM `messages` `m2`
    WHERE `m2`.`justificationId` = `j`.`id` AND `m2`.`type` = 'SYSTEM'
  );
