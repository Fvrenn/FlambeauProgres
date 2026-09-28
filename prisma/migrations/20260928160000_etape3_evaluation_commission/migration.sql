-- AlterEnum
ALTER TABLE `notifications` MODIFY `type` ENUM('NOUVELLE_JUSTIFICATION', 'JUSTIFICATION_VALIDEE', 'JUSTIFICATION_REFUSEE', 'DEMANDE_PRECISION', 'REPONSE_PRECISION', 'ETAPE_COMPLETE', 'JUSTIFICATION_URGENTE', 'NOUVEAU_COMMENTAIRE', 'DOSSIER_A_VALIDER') NOT NULL;

-- Les jalons et l'étape 3 ne se gèrent plus par assignation
DELETE `er` FROM `etape_referents` AS `er`
INNER JOIN `etapes` AS `e` ON `e`.`id` = `er`.`etapeId`
WHERE `e`.`type` = 'JALON' OR `e`.`niveau` >= 3;

-- Les compétences de l'étape 3 déjà auto-validées repartent en évaluation auprès de la commission
INSERT INTO `messages` (`id`, `justificationId`, `auteurId`, `contenu`, `type`, `createdAt`)
SELECT UUID(), `j`.`id`, `j`.`chefId`, `j`.`contenu`, 'USER', COALESCE(`j`.`valideeAt`, `j`.`updatedAt`)
FROM `justifications` AS `j`
INNER JOIN `etapes` AS `e` ON `e`.`id` = `j`.`etapeId`
INNER JOIN `objectifs` AS `o` ON `o`.`id` = `j`.`objectifId`
WHERE `e`.`niveau` >= 3 AND `e`.`type` = 'BADGE' AND `o`.`type` = 'COMPETENCE' AND `j`.`statut` = 'AUTO_VALIDEE';

UPDATE `justifications` AS `j`
INNER JOIN `etapes` AS `e` ON `e`.`id` = `j`.`etapeId`
INNER JOIN `objectifs` AS `o` ON `o`.`id` = `j`.`objectifId`
SET `j`.`statut` = 'SOUMISE',
    `j`.`soumiseAt` = COALESCE(`j`.`valideeAt`, `j`.`updatedAt`),
    `j`.`valideeAt` = NULL
WHERE `e`.`niveau` >= 3 AND `e`.`type` = 'BADGE' AND `o`.`type` = 'COMPETENCE' AND `j`.`statut` = 'AUTO_VALIDEE';
