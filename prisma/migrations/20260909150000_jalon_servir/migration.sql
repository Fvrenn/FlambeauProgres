-- Jalon « Servir » : comme l'Allume-feu et l'Étape 1 « Découvrir », il faut avoir ouvert le
-- livret pour débloquer ce qui suit — ici les profils Formateur et Leader.
-- Il vit au niveau 3 comme les profils : le déblocage par niveau ne peut donc pas l'exprimer,
-- c'est etapeEstAccessible (src/lib/parcours.ts) qui l'applique.
INSERT IGNORE INTO `etapes`
  (`id`, `number`, `name`, `description`, `image_src`, `ordre`, `actif`, `createdAt`, `updatedAt`, `couleur`, `niveau`, `type`, `wpValue`)
VALUES
  ('etape_3_servir', '3', 'Servir',
   'Étape 3 du Parcours du Chef. Lis le livret « Servir » pour débloquer les profils Formateur et Leader.',
   NULL, 0, 1, NOW(3), NOW(3), '#71b747', 3, 'JALON', NULL);
