-- AlterTable
ALTER TABLE `etapes` ADD COLUMN `couleur` VARCHAR(191) NULL;

-- Backfill couleur par numéro d'étape
UPDATE `etapes` SET `couleur` = '#ece835' WHERE `number` = '2b';
UPDATE `etapes` SET `couleur` = '#2357a7' WHERE `number` = '2c';
UPDATE `etapes` SET `couleur` = '#eabf2c' WHERE `number` = '2e';
UPDATE `etapes` SET `couleur` = '#f37b61' WHERE `number` = '2f';
UPDATE `etapes` SET `couleur` = '#cc7b4d' WHERE `number` = '2g';
UPDATE `etapes` SET `couleur` = '#e07f31' WHERE `number` = '2h';
UPDATE `etapes` SET `couleur` = '#3a7155' WHERE `number` = '2i';
UPDATE `etapes` SET `couleur` = '#733d8a' WHERE `number` = '2j';
UPDATE `etapes` SET `couleur` = '#333333' WHERE `number` = '2k';
UPDATE `etapes` SET `couleur` = '#4bbe97' WHERE `number` = '2l';
UPDATE `etapes` SET `couleur` = '#9a1622' WHERE `number` = '2m';
UPDATE `etapes` SET `couleur` = '#9d57a2' WHERE `number` = '2n';
