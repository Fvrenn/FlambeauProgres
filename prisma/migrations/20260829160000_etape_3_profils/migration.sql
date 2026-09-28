-- Les descriptions du livret depassent 191 caracteres, et admin.actions.ts valide deja
-- jusqu'a 2000 caracteres.
ALTER TABLE `etapes` MODIFY `description` TEXT NOT NULL;
ALTER TABLE `objectifs` MODIFY `description` TEXT NOT NULL;

-- Etape 3 « Servir » : profils Formateur et Leader.
-- Le profil Expert (wpValue 301, ordre 1) sera ajoute plus tard : il se decline par
-- specialite et demande un parcours a part.
INSERT INTO `etapes`
  (`id`, `number`, `name`, `description`, `image_src`, `ordre`, `actif`, `createdAt`, `updatedAt`, `couleur`, `niveau`, `type`, `wpValue`)
VALUES
  ('etape_3b_formateur', '3b', 'Formateur',
   'L’étape 3 « Formateur » apprend à former, c’est-à-dire à transmettre, accompagner et évaluer. On peut former dans un domaine quand on a validé la ou les spécialités correspondantes.',
   '/etapes/3b-profil_formateur.png', 2, 1, NOW(3), NOW(3), '#26bebc', 3, 'BADGE', '302'),
  ('etape_3c_leader', '3c', 'Leader',
   'L’étape 3 « Leader » est liée à un engagement dans une équipe (maîtrise, équipe régionale, commission) et accompagne l’acquisition de compétences d’organisation, de gestion d’équipe et de projets.',
   '/etapes/3c-profil_leader.png', 3, 1, NOW(3), NOW(3), '#71b747', 3, 'BADGE', '303');

INSERT INTO `objectifs`
  (`id`, `etapeId`, `code`, `description`, `type`, `fichiersRequis`, `texteRequis`, `createdAt`, `updatedAt`)
VALUES
  ('obj_3b_f0', 'etape_3b_formateur', 'F0', 'Passer une spé au choix. Précise laquelle dans ta justification.', 'COMPETENCE', 0, 1, NOW(3), NOW(3)),
  ('obj_3b_f1', 'etape_3b_formateur', 'F1', 'Définir les objectifs à atteindre et les moyens adaptés en concevant un plan de formation détaillé.', 'COMPETENCE', 0, 1, NOW(3), NOW(3)),
  ('obj_3b_f2', 'etape_3b_formateur', 'F2', 'Définir et utiliser une ou plusieurs méthodes pédagogiques dans le cadre de formations.', 'COMPETENCE', 0, 1, NOW(3), NOW(3)),
  ('obj_3b_f3', 'etape_3b_formateur', 'F3', 'Savoir animer un temps de formation.', 'COMPETENCE', 0, 1, NOW(3), NOW(3)),
  ('obj_3b_f4', 'etape_3b_formateur', 'F4', 'Gérer le groupe et savoir s’adapter au public.', 'COMPETENCE', 0, 1, NOW(3), NOW(3)),
  ('obj_3b_f5', 'etape_3b_formateur', 'F5', 'Savoir animer et rédiger un bilan.', 'COMPETENCE', 0, 1, NOW(3), NOW(3)),
  ('obj_3b_f7', 'etape_3b_formateur', 'F7', 'Créer un support de formation pour le Mouvement et le présenter.', 'REALISATION', 1, 1, NOW(3), NOW(3)),
  ('obj_3b_f8', 'etape_3b_formateur', 'F8', 'Concevoir et animer des formations de groupe d’une durée minimale totale de 10h sur au moins 2 formations. Faire le bilan de ces formations en mettant en évidence les compétences ci-dessus. Les formations peuvent être effectuées hors du cadre des Flambeaux.', 'REALISATION', 1, 1, NOW(3), NOW(3)),

  ('obj_3c_l0', 'etape_3c_leader', 'L0', 'Passer une spé au choix. Précise laquelle dans ta justification.', 'COMPETENCE', 0, 1, NOW(3), NOW(3)),
  ('obj_3c_l1', 'etape_3c_leader', 'L1', 'Savoir faire émerger une vision et être fédérateur, avec dynamisme et ouverture.', 'COMPETENCE', 0, 1, NOW(3), NOW(3)),
  ('obj_3c_l2', 'etape_3c_leader', 'L2', 'Déléguer aux équipiers les missions en discernant leurs compétences.', 'COMPETENCE', 0, 1, NOW(3), NOW(3)),
  ('obj_3c_l3', 'etape_3c_leader', 'L3', 'Savoir travailler en équipe : écoute et remise en question, prendre en compte les idées et avis de tous les équipiers.', 'COMPETENCE', 0, 1, NOW(3), NOW(3)),
  ('obj_3c_l4', 'etape_3c_leader', 'L4', 'Connaître des techniques de médiation et savoir les mettre en œuvre entre les équipiers.', 'COMPETENCE', 0, 1, NOW(3), NOW(3)),
  ('obj_3c_l5', 'etape_3c_leader', 'L5', 'Gérer un projet en listant les objectifs et les moyens nécessaires. Élaborer un planning. Animer au travers de réunions l’avancement du projet. Rédiger un bilan.', 'COMPETENCE', 0, 1, NOW(3), NOW(3)),
  ('obj_3c_l6', 'etape_3c_leader', 'L6', 'Être capable de s’adapter et trouver des solutions aux difficultés rencontrées.', 'COMPETENCE', 0, 1, NOW(3), NOW(3)),
  ('obj_3c_l7', 'etape_3c_leader', 'L7', 'Veiller à l’information des partenaires (Églises, Mouvement, Parents, ...) en adaptant les moyens et messages tout en ayant conscience des enjeux.', 'COMPETENCE', 0, 1, NOW(3), NOW(3)),
  ('obj_3c_l8', 'etape_3c_leader', 'L8', 'Gérer une équipe de travail sur 2 années ou 2 camps. Cette réalisation peut être effectuée en dehors du cadre Flambeaux.', 'REALISATION', 1, 1, NOW(3), NOW(3)),
  ('obj_3c_l9', 'etape_3c_leader', 'L9', 'Présenter un rapport de projet Flambeaux mettant en évidence les compétences ci-dessus, à l’écrit ou sous forme de vidéo/audio.', 'REALISATION', 1, 1, NOW(3), NOW(3));
