-- L'Expert n'a pas d'écusson propre : le livret remet une étoile à poser sur le badge de la
-- spécialité. L'étape Expert reprend donc l'écusson de sa spécialité.
UPDATE `etapes` AS `expert`
JOIN `etapes` AS `specialite` ON `expert`.`specialiteId` = `specialite`.`id`
SET `expert`.`image_src` = `specialite`.`image_src`;
