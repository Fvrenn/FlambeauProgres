-- Profil Expert : une étape de niveau 3 par spécialité, reliée à sa spécialité de niveau 2.
-- Le livret autorise plusieurs Experts par chef ; la contrainte d'unicité (chef, étape) impose donc
-- une étape par spécialité. etapeEstAccessible (src/lib/parcours.ts) exige la spécialité validée.
ALTER TABLE `etapes` ADD COLUMN `specialiteId` VARCHAR(191) NULL;

CREATE INDEX `etapes_specialiteId_idx` ON `etapes`(`specialiteId`);

ALTER TABLE `etapes` ADD CONSTRAINT `etapes_specialiteId_fkey` FOREIGN KEY (`specialiteId`) REFERENCES `etapes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

INSERT IGNORE INTO `etapes`
  (`id`, `number`, `name`, `description`, `image_src`, `ordre`, `actif`, `createdAt`, `updatedAt`, `couleur`, `niveau`, `type`, `wpValue`, `specialiteId`)
SELECT 'etape_3a_2b', '3a-2b', CONCAT('Expert ', `name`), 'Étape 3 « Expert » : progresser et servir davantage dans la spécialité pour être reconnu expert du domaine. Chaque Expert est marqué par sa réalisation finale, qui apporte un nouvel outil ou savoir-faire utile au Mouvement.', NULL, 4, 1, NOW(3), NOW(3), `couleur`, 3, 'BADGE', NULL, `id`
FROM `etapes` WHERE `number` = '2b';

INSERT IGNORE INTO `objectifs`
  (`id`, `etapeId`, `code`, `description`, `type`, `fichiersRequis`, `texteRequis`, `createdAt`, `updatedAt`)
SELECT v.`id`, 'etape_3a_2b', v.`code`, v.`description`, v.`type`, v.`fichiersRequis`, 1, NOW(3), NOW(3)
FROM (
  SELECT 'obj_3a_2b_E1' AS `id`, 'E1' AS `code`, 'Connaissance technique fine et documentée du domaine.' AS `description`, 'COMPETENCE' AS `type`, 0 AS `fichiersRequis`
  UNION ALL SELECT 'obj_3a_2b_E2', 'E2', 'Analyse pointue et reconnue des réalisations dans le domaine.', 'COMPETENCE', 0
  UNION ALL SELECT 'obj_3a_2b_E3', 'E3', 'Savoir transmettre son expertise ou participer à l’enrichissement du domaine en s’adaptant au public concerné.', 'COMPETENCE', 0
  UNION ALL SELECT 'obj_3a_2b_E4', 'E4', 'Réalisation de qualité de grande ampleur ou sur une durée importante pour le Mouvement en mettant en évidence les compétences ci-dessus. Cette réalisation est à valider avec la commission Formation, si possible en amont de sa mise en œuvre.', 'REALISATION', 1
  UNION ALL SELECT 'obj_3a_2b_E5', 'E5', 'Analyser un projet, un groupe ou une activité en lien avec le domaine.', 'REALISATION', 1
) AS v
WHERE EXISTS (SELECT 1 FROM `etapes` WHERE `id` = 'etape_3a_2b');

INSERT IGNORE INTO `etapes`
  (`id`, `number`, `name`, `description`, `image_src`, `ordre`, `actif`, `createdAt`, `updatedAt`, `couleur`, `niveau`, `type`, `wpValue`, `specialiteId`)
SELECT 'etape_3a_2c', '3a-2c', CONCAT('Expert ', `name`), 'Étape 3 « Expert » : progresser et servir davantage dans la spécialité pour être reconnu expert du domaine. Chaque Expert est marqué par sa réalisation finale, qui apporte un nouvel outil ou savoir-faire utile au Mouvement.', NULL, 5, 1, NOW(3), NOW(3), `couleur`, 3, 'BADGE', NULL, `id`
FROM `etapes` WHERE `number` = '2c';

INSERT IGNORE INTO `objectifs`
  (`id`, `etapeId`, `code`, `description`, `type`, `fichiersRequis`, `texteRequis`, `createdAt`, `updatedAt`)
SELECT v.`id`, 'etape_3a_2c', v.`code`, v.`description`, v.`type`, v.`fichiersRequis`, 1, NOW(3), NOW(3)
FROM (
  SELECT 'obj_3a_2c_E1' AS `id`, 'E1' AS `code`, 'Connaissance technique fine et documentée du domaine.' AS `description`, 'COMPETENCE' AS `type`, 0 AS `fichiersRequis`
  UNION ALL SELECT 'obj_3a_2c_E2', 'E2', 'Analyse pointue et reconnue des réalisations dans le domaine.', 'COMPETENCE', 0
  UNION ALL SELECT 'obj_3a_2c_E3', 'E3', 'Savoir transmettre son expertise ou participer à l’enrichissement du domaine en s’adaptant au public concerné.', 'COMPETENCE', 0
  UNION ALL SELECT 'obj_3a_2c_E4', 'E4', 'Réalisation de qualité de grande ampleur ou sur une durée importante pour le Mouvement en mettant en évidence les compétences ci-dessus. Cette réalisation est à valider avec la commission Formation, si possible en amont de sa mise en œuvre.', 'REALISATION', 1
  UNION ALL SELECT 'obj_3a_2c_E5', 'E5', 'Analyser un projet, un groupe ou une activité en lien avec le domaine.', 'REALISATION', 1
) AS v
WHERE EXISTS (SELECT 1 FROM `etapes` WHERE `id` = 'etape_3a_2c');

INSERT IGNORE INTO `etapes`
  (`id`, `number`, `name`, `description`, `image_src`, `ordre`, `actif`, `createdAt`, `updatedAt`, `couleur`, `niveau`, `type`, `wpValue`, `specialiteId`)
SELECT 'etape_3a_2e', '3a-2e', CONCAT('Expert ', `name`), 'Étape 3 « Expert » : progresser et servir davantage dans la spécialité pour être reconnu expert du domaine. Chaque Expert est marqué par sa réalisation finale, qui apporte un nouvel outil ou savoir-faire utile au Mouvement.', NULL, 6, 1, NOW(3), NOW(3), `couleur`, 3, 'BADGE', NULL, `id`
FROM `etapes` WHERE `number` = '2e';

INSERT IGNORE INTO `objectifs`
  (`id`, `etapeId`, `code`, `description`, `type`, `fichiersRequis`, `texteRequis`, `createdAt`, `updatedAt`)
SELECT v.`id`, 'etape_3a_2e', v.`code`, v.`description`, v.`type`, v.`fichiersRequis`, 1, NOW(3), NOW(3)
FROM (
  SELECT 'obj_3a_2e_E1' AS `id`, 'E1' AS `code`, 'Connaissance technique fine et documentée du domaine.' AS `description`, 'COMPETENCE' AS `type`, 0 AS `fichiersRequis`
  UNION ALL SELECT 'obj_3a_2e_E2', 'E2', 'Analyse pointue et reconnue des réalisations dans le domaine.', 'COMPETENCE', 0
  UNION ALL SELECT 'obj_3a_2e_E3', 'E3', 'Savoir transmettre son expertise ou participer à l’enrichissement du domaine en s’adaptant au public concerné.', 'COMPETENCE', 0
  UNION ALL SELECT 'obj_3a_2e_E4', 'E4', 'Réalisation de qualité de grande ampleur ou sur une durée importante pour le Mouvement en mettant en évidence les compétences ci-dessus. Cette réalisation est à valider avec la commission Formation, si possible en amont de sa mise en œuvre.', 'REALISATION', 1
  UNION ALL SELECT 'obj_3a_2e_E5', 'E5', 'Analyser un projet, un groupe ou une activité en lien avec le domaine.', 'REALISATION', 1
) AS v
WHERE EXISTS (SELECT 1 FROM `etapes` WHERE `id` = 'etape_3a_2e');

INSERT IGNORE INTO `etapes`
  (`id`, `number`, `name`, `description`, `image_src`, `ordre`, `actif`, `createdAt`, `updatedAt`, `couleur`, `niveau`, `type`, `wpValue`, `specialiteId`)
SELECT 'etape_3a_2f', '3a-2f', CONCAT('Expert ', `name`), 'Étape 3 « Expert » : progresser et servir davantage dans la spécialité pour être reconnu expert du domaine. Chaque Expert est marqué par sa réalisation finale, qui apporte un nouvel outil ou savoir-faire utile au Mouvement.', NULL, 7, 1, NOW(3), NOW(3), `couleur`, 3, 'BADGE', NULL, `id`
FROM `etapes` WHERE `number` = '2f';

INSERT IGNORE INTO `objectifs`
  (`id`, `etapeId`, `code`, `description`, `type`, `fichiersRequis`, `texteRequis`, `createdAt`, `updatedAt`)
SELECT v.`id`, 'etape_3a_2f', v.`code`, v.`description`, v.`type`, v.`fichiersRequis`, 1, NOW(3), NOW(3)
FROM (
  SELECT 'obj_3a_2f_E1' AS `id`, 'E1' AS `code`, 'Connaissance technique fine et documentée du domaine.' AS `description`, 'COMPETENCE' AS `type`, 0 AS `fichiersRequis`
  UNION ALL SELECT 'obj_3a_2f_E2', 'E2', 'Analyse pointue et reconnue des réalisations dans le domaine.', 'COMPETENCE', 0
  UNION ALL SELECT 'obj_3a_2f_E3', 'E3', 'Savoir transmettre son expertise ou participer à l’enrichissement du domaine en s’adaptant au public concerné.', 'COMPETENCE', 0
  UNION ALL SELECT 'obj_3a_2f_E4', 'E4', 'Réalisation de qualité de grande ampleur ou sur une durée importante pour le Mouvement en mettant en évidence les compétences ci-dessus. Cette réalisation est à valider avec la commission Formation, si possible en amont de sa mise en œuvre.', 'REALISATION', 1
  UNION ALL SELECT 'obj_3a_2f_E5', 'E5', 'Analyser un projet, un groupe ou une activité en lien avec le domaine.', 'REALISATION', 1
) AS v
WHERE EXISTS (SELECT 1 FROM `etapes` WHERE `id` = 'etape_3a_2f');

INSERT IGNORE INTO `etapes`
  (`id`, `number`, `name`, `description`, `image_src`, `ordre`, `actif`, `createdAt`, `updatedAt`, `couleur`, `niveau`, `type`, `wpValue`, `specialiteId`)
SELECT 'etape_3a_2g', '3a-2g', CONCAT('Expert ', `name`), 'Étape 3 « Expert » : progresser et servir davantage dans la spécialité pour être reconnu expert du domaine. Chaque Expert est marqué par sa réalisation finale, qui apporte un nouvel outil ou savoir-faire utile au Mouvement.', NULL, 8, 1, NOW(3), NOW(3), `couleur`, 3, 'BADGE', NULL, `id`
FROM `etapes` WHERE `number` = '2g';

INSERT IGNORE INTO `objectifs`
  (`id`, `etapeId`, `code`, `description`, `type`, `fichiersRequis`, `texteRequis`, `createdAt`, `updatedAt`)
SELECT v.`id`, 'etape_3a_2g', v.`code`, v.`description`, v.`type`, v.`fichiersRequis`, 1, NOW(3), NOW(3)
FROM (
  SELECT 'obj_3a_2g_E1' AS `id`, 'E1' AS `code`, 'Connaissance technique fine et documentée du domaine.' AS `description`, 'COMPETENCE' AS `type`, 0 AS `fichiersRequis`
  UNION ALL SELECT 'obj_3a_2g_E2', 'E2', 'Analyse pointue et reconnue des réalisations dans le domaine.', 'COMPETENCE', 0
  UNION ALL SELECT 'obj_3a_2g_E3', 'E3', 'Savoir transmettre son expertise ou participer à l’enrichissement du domaine en s’adaptant au public concerné.', 'COMPETENCE', 0
  UNION ALL SELECT 'obj_3a_2g_E4', 'E4', 'Réalisation de qualité de grande ampleur ou sur une durée importante pour le Mouvement en mettant en évidence les compétences ci-dessus. Cette réalisation est à valider avec la commission Formation, si possible en amont de sa mise en œuvre.', 'REALISATION', 1
  UNION ALL SELECT 'obj_3a_2g_E5', 'E5', 'Analyser un projet, un groupe ou une activité en lien avec le domaine.', 'REALISATION', 1
) AS v
WHERE EXISTS (SELECT 1 FROM `etapes` WHERE `id` = 'etape_3a_2g');

INSERT IGNORE INTO `etapes`
  (`id`, `number`, `name`, `description`, `image_src`, `ordre`, `actif`, `createdAt`, `updatedAt`, `couleur`, `niveau`, `type`, `wpValue`, `specialiteId`)
SELECT 'etape_3a_2h', '3a-2h', CONCAT('Expert ', `name`), 'Étape 3 « Expert » : progresser et servir davantage dans la spécialité pour être reconnu expert du domaine. Chaque Expert est marqué par sa réalisation finale, qui apporte un nouvel outil ou savoir-faire utile au Mouvement.', NULL, 9, 1, NOW(3), NOW(3), `couleur`, 3, 'BADGE', NULL, `id`
FROM `etapes` WHERE `number` = '2h';

INSERT IGNORE INTO `objectifs`
  (`id`, `etapeId`, `code`, `description`, `type`, `fichiersRequis`, `texteRequis`, `createdAt`, `updatedAt`)
SELECT v.`id`, 'etape_3a_2h', v.`code`, v.`description`, v.`type`, v.`fichiersRequis`, 1, NOW(3), NOW(3)
FROM (
  SELECT 'obj_3a_2h_E1' AS `id`, 'E1' AS `code`, 'Connaissance technique fine et documentée du domaine.' AS `description`, 'COMPETENCE' AS `type`, 0 AS `fichiersRequis`
  UNION ALL SELECT 'obj_3a_2h_E2', 'E2', 'Analyse pointue et reconnue des réalisations dans le domaine.', 'COMPETENCE', 0
  UNION ALL SELECT 'obj_3a_2h_E3', 'E3', 'Savoir transmettre son expertise ou participer à l’enrichissement du domaine en s’adaptant au public concerné.', 'COMPETENCE', 0
  UNION ALL SELECT 'obj_3a_2h_E4', 'E4', 'Réalisation de qualité de grande ampleur ou sur une durée importante pour le Mouvement en mettant en évidence les compétences ci-dessus. Cette réalisation est à valider avec la commission Formation, si possible en amont de sa mise en œuvre.', 'REALISATION', 1
  UNION ALL SELECT 'obj_3a_2h_E5', 'E5', 'Analyser un projet, un groupe ou une activité en lien avec le domaine.', 'REALISATION', 1
) AS v
WHERE EXISTS (SELECT 1 FROM `etapes` WHERE `id` = 'etape_3a_2h');

INSERT IGNORE INTO `etapes`
  (`id`, `number`, `name`, `description`, `image_src`, `ordre`, `actif`, `createdAt`, `updatedAt`, `couleur`, `niveau`, `type`, `wpValue`, `specialiteId`)
SELECT 'etape_3a_2i', '3a-2i', CONCAT('Expert ', `name`), 'Étape 3 « Expert » : progresser et servir davantage dans la spécialité pour être reconnu expert du domaine. Chaque Expert est marqué par sa réalisation finale, qui apporte un nouvel outil ou savoir-faire utile au Mouvement.', NULL, 10, 1, NOW(3), NOW(3), `couleur`, 3, 'BADGE', NULL, `id`
FROM `etapes` WHERE `number` = '2i';

INSERT IGNORE INTO `objectifs`
  (`id`, `etapeId`, `code`, `description`, `type`, `fichiersRequis`, `texteRequis`, `createdAt`, `updatedAt`)
SELECT v.`id`, 'etape_3a_2i', v.`code`, v.`description`, v.`type`, v.`fichiersRequis`, 1, NOW(3), NOW(3)
FROM (
  SELECT 'obj_3a_2i_E1' AS `id`, 'E1' AS `code`, 'Connaissance technique fine et documentée du domaine.' AS `description`, 'COMPETENCE' AS `type`, 0 AS `fichiersRequis`
  UNION ALL SELECT 'obj_3a_2i_E2', 'E2', 'Analyse pointue et reconnue des réalisations dans le domaine.', 'COMPETENCE', 0
  UNION ALL SELECT 'obj_3a_2i_E3', 'E3', 'Savoir transmettre son expertise ou participer à l’enrichissement du domaine en s’adaptant au public concerné.', 'COMPETENCE', 0
  UNION ALL SELECT 'obj_3a_2i_E4', 'E4', 'Réalisation de qualité de grande ampleur ou sur une durée importante pour le Mouvement en mettant en évidence les compétences ci-dessus. Cette réalisation est à valider avec la commission Formation, si possible en amont de sa mise en œuvre.', 'REALISATION', 1
  UNION ALL SELECT 'obj_3a_2i_E5', 'E5', 'Analyser un projet, un groupe ou une activité en lien avec le domaine.', 'REALISATION', 1
) AS v
WHERE EXISTS (SELECT 1 FROM `etapes` WHERE `id` = 'etape_3a_2i');

INSERT IGNORE INTO `etapes`
  (`id`, `number`, `name`, `description`, `image_src`, `ordre`, `actif`, `createdAt`, `updatedAt`, `couleur`, `niveau`, `type`, `wpValue`, `specialiteId`)
SELECT 'etape_3a_2j', '3a-2j', CONCAT('Expert ', `name`), 'Étape 3 « Expert » : progresser et servir davantage dans la spécialité pour être reconnu expert du domaine. Chaque Expert est marqué par sa réalisation finale, qui apporte un nouvel outil ou savoir-faire utile au Mouvement.', NULL, 11, 1, NOW(3), NOW(3), `couleur`, 3, 'BADGE', NULL, `id`
FROM `etapes` WHERE `number` = '2j';

INSERT IGNORE INTO `objectifs`
  (`id`, `etapeId`, `code`, `description`, `type`, `fichiersRequis`, `texteRequis`, `createdAt`, `updatedAt`)
SELECT v.`id`, 'etape_3a_2j', v.`code`, v.`description`, v.`type`, v.`fichiersRequis`, 1, NOW(3), NOW(3)
FROM (
  SELECT 'obj_3a_2j_E1' AS `id`, 'E1' AS `code`, 'Connaissance technique fine et documentée du domaine.' AS `description`, 'COMPETENCE' AS `type`, 0 AS `fichiersRequis`
  UNION ALL SELECT 'obj_3a_2j_E2', 'E2', 'Analyse pointue et reconnue des réalisations dans le domaine.', 'COMPETENCE', 0
  UNION ALL SELECT 'obj_3a_2j_E3', 'E3', 'Savoir transmettre son expertise ou participer à l’enrichissement du domaine en s’adaptant au public concerné.', 'COMPETENCE', 0
  UNION ALL SELECT 'obj_3a_2j_E4', 'E4', 'Réalisation de qualité de grande ampleur ou sur une durée importante pour le Mouvement en mettant en évidence les compétences ci-dessus. Cette réalisation est à valider avec la commission Formation, si possible en amont de sa mise en œuvre.', 'REALISATION', 1
  UNION ALL SELECT 'obj_3a_2j_E5', 'E5', 'Analyser un projet, un groupe ou une activité en lien avec le domaine.', 'REALISATION', 1
) AS v
WHERE EXISTS (SELECT 1 FROM `etapes` WHERE `id` = 'etape_3a_2j');

INSERT IGNORE INTO `etapes`
  (`id`, `number`, `name`, `description`, `image_src`, `ordre`, `actif`, `createdAt`, `updatedAt`, `couleur`, `niveau`, `type`, `wpValue`, `specialiteId`)
SELECT 'etape_3a_2k', '3a-2k', CONCAT('Expert ', `name`), 'Étape 3 « Expert » : progresser et servir davantage dans la spécialité pour être reconnu expert du domaine. Chaque Expert est marqué par sa réalisation finale, qui apporte un nouvel outil ou savoir-faire utile au Mouvement.', NULL, 12, 1, NOW(3), NOW(3), `couleur`, 3, 'BADGE', NULL, `id`
FROM `etapes` WHERE `number` = '2k';

INSERT IGNORE INTO `objectifs`
  (`id`, `etapeId`, `code`, `description`, `type`, `fichiersRequis`, `texteRequis`, `createdAt`, `updatedAt`)
SELECT v.`id`, 'etape_3a_2k', v.`code`, v.`description`, v.`type`, v.`fichiersRequis`, 1, NOW(3), NOW(3)
FROM (
  SELECT 'obj_3a_2k_E1' AS `id`, 'E1' AS `code`, 'Connaissance technique fine et documentée du domaine.' AS `description`, 'COMPETENCE' AS `type`, 0 AS `fichiersRequis`
  UNION ALL SELECT 'obj_3a_2k_E2', 'E2', 'Analyse pointue et reconnue des réalisations dans le domaine.', 'COMPETENCE', 0
  UNION ALL SELECT 'obj_3a_2k_E3', 'E3', 'Savoir transmettre son expertise ou participer à l’enrichissement du domaine en s’adaptant au public concerné.', 'COMPETENCE', 0
  UNION ALL SELECT 'obj_3a_2k_E4', 'E4', 'Réalisation de qualité de grande ampleur ou sur une durée importante pour le Mouvement en mettant en évidence les compétences ci-dessus. Cette réalisation est à valider avec la commission Formation, si possible en amont de sa mise en œuvre.', 'REALISATION', 1
  UNION ALL SELECT 'obj_3a_2k_E5', 'E5', 'Analyser un projet, un groupe ou une activité en lien avec le domaine.', 'REALISATION', 1
) AS v
WHERE EXISTS (SELECT 1 FROM `etapes` WHERE `id` = 'etape_3a_2k');

INSERT IGNORE INTO `etapes`
  (`id`, `number`, `name`, `description`, `image_src`, `ordre`, `actif`, `createdAt`, `updatedAt`, `couleur`, `niveau`, `type`, `wpValue`, `specialiteId`)
SELECT 'etape_3a_2l', '3a-2l', CONCAT('Expert ', `name`), 'Étape 3 « Expert » : progresser et servir davantage dans la spécialité pour être reconnu expert du domaine. Chaque Expert est marqué par sa réalisation finale, qui apporte un nouvel outil ou savoir-faire utile au Mouvement.', NULL, 13, 1, NOW(3), NOW(3), `couleur`, 3, 'BADGE', NULL, `id`
FROM `etapes` WHERE `number` = '2l';

INSERT IGNORE INTO `objectifs`
  (`id`, `etapeId`, `code`, `description`, `type`, `fichiersRequis`, `texteRequis`, `createdAt`, `updatedAt`)
SELECT v.`id`, 'etape_3a_2l', v.`code`, v.`description`, v.`type`, v.`fichiersRequis`, 1, NOW(3), NOW(3)
FROM (
  SELECT 'obj_3a_2l_E1' AS `id`, 'E1' AS `code`, 'Connaissance technique fine et documentée du domaine.' AS `description`, 'COMPETENCE' AS `type`, 0 AS `fichiersRequis`
  UNION ALL SELECT 'obj_3a_2l_E2', 'E2', 'Analyse pointue et reconnue des réalisations dans le domaine.', 'COMPETENCE', 0
  UNION ALL SELECT 'obj_3a_2l_E3', 'E3', 'Savoir transmettre son expertise ou participer à l’enrichissement du domaine en s’adaptant au public concerné.', 'COMPETENCE', 0
  UNION ALL SELECT 'obj_3a_2l_E4', 'E4', 'Réalisation de qualité de grande ampleur ou sur une durée importante pour le Mouvement en mettant en évidence les compétences ci-dessus. Cette réalisation est à valider avec la commission Formation, si possible en amont de sa mise en œuvre.', 'REALISATION', 1
  UNION ALL SELECT 'obj_3a_2l_E5', 'E5', 'Analyser un projet, un groupe ou une activité en lien avec le domaine.', 'REALISATION', 1
) AS v
WHERE EXISTS (SELECT 1 FROM `etapes` WHERE `id` = 'etape_3a_2l');

INSERT IGNORE INTO `etapes`
  (`id`, `number`, `name`, `description`, `image_src`, `ordre`, `actif`, `createdAt`, `updatedAt`, `couleur`, `niveau`, `type`, `wpValue`, `specialiteId`)
SELECT 'etape_3a_2m', '3a-2m', CONCAT('Expert ', `name`), 'Étape 3 « Expert » : progresser et servir davantage dans la spécialité pour être reconnu expert du domaine. Chaque Expert est marqué par sa réalisation finale, qui apporte un nouvel outil ou savoir-faire utile au Mouvement.', NULL, 14, 1, NOW(3), NOW(3), `couleur`, 3, 'BADGE', NULL, `id`
FROM `etapes` WHERE `number` = '2m';

INSERT IGNORE INTO `objectifs`
  (`id`, `etapeId`, `code`, `description`, `type`, `fichiersRequis`, `texteRequis`, `createdAt`, `updatedAt`)
SELECT v.`id`, 'etape_3a_2m', v.`code`, v.`description`, v.`type`, v.`fichiersRequis`, 1, NOW(3), NOW(3)
FROM (
  SELECT 'obj_3a_2m_E1' AS `id`, 'E1' AS `code`, 'Connaissance technique fine et documentée du domaine.' AS `description`, 'COMPETENCE' AS `type`, 0 AS `fichiersRequis`
  UNION ALL SELECT 'obj_3a_2m_E2', 'E2', 'Analyse pointue et reconnue des réalisations dans le domaine.', 'COMPETENCE', 0
  UNION ALL SELECT 'obj_3a_2m_E3', 'E3', 'Savoir transmettre son expertise ou participer à l’enrichissement du domaine en s’adaptant au public concerné.', 'COMPETENCE', 0
  UNION ALL SELECT 'obj_3a_2m_E4', 'E4', 'Réalisation de qualité de grande ampleur ou sur une durée importante pour le Mouvement en mettant en évidence les compétences ci-dessus. Cette réalisation est à valider avec la commission Formation, si possible en amont de sa mise en œuvre.', 'REALISATION', 1
  UNION ALL SELECT 'obj_3a_2m_E5', 'E5', 'Analyser un projet, un groupe ou une activité en lien avec le domaine.', 'REALISATION', 1
) AS v
WHERE EXISTS (SELECT 1 FROM `etapes` WHERE `id` = 'etape_3a_2m');

INSERT IGNORE INTO `etapes`
  (`id`, `number`, `name`, `description`, `image_src`, `ordre`, `actif`, `createdAt`, `updatedAt`, `couleur`, `niveau`, `type`, `wpValue`, `specialiteId`)
SELECT 'etape_3a_2n', '3a-2n', CONCAT('Expert ', `name`), 'Étape 3 « Expert » : progresser et servir davantage dans la spécialité pour être reconnu expert du domaine. Chaque Expert est marqué par sa réalisation finale, qui apporte un nouvel outil ou savoir-faire utile au Mouvement.', NULL, 15, 1, NOW(3), NOW(3), `couleur`, 3, 'BADGE', NULL, `id`
FROM `etapes` WHERE `number` = '2n';

INSERT IGNORE INTO `objectifs`
  (`id`, `etapeId`, `code`, `description`, `type`, `fichiersRequis`, `texteRequis`, `createdAt`, `updatedAt`)
SELECT v.`id`, 'etape_3a_2n', v.`code`, v.`description`, v.`type`, v.`fichiersRequis`, 1, NOW(3), NOW(3)
FROM (
  SELECT 'obj_3a_2n_E1' AS `id`, 'E1' AS `code`, 'Connaissance technique fine et documentée du domaine.' AS `description`, 'COMPETENCE' AS `type`, 0 AS `fichiersRequis`
  UNION ALL SELECT 'obj_3a_2n_E2', 'E2', 'Analyse pointue et reconnue des réalisations dans le domaine.', 'COMPETENCE', 0
  UNION ALL SELECT 'obj_3a_2n_E3', 'E3', 'Savoir transmettre son expertise ou participer à l’enrichissement du domaine en s’adaptant au public concerné.', 'COMPETENCE', 0
  UNION ALL SELECT 'obj_3a_2n_E4', 'E4', 'Réalisation de qualité de grande ampleur ou sur une durée importante pour le Mouvement en mettant en évidence les compétences ci-dessus. Cette réalisation est à valider avec la commission Formation, si possible en amont de sa mise en œuvre.', 'REALISATION', 1
  UNION ALL SELECT 'obj_3a_2n_E5', 'E5', 'Analyser un projet, un groupe ou une activité en lien avec le domaine.', 'REALISATION', 1
) AS v
WHERE EXISTS (SELECT 1 FROM `etapes` WHERE `id` = 'etape_3a_2n');
