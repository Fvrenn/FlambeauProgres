-- CreateTable
CREATE TABLE `troupes` (
    `id` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `emailVerified` BOOLEAN NULL,
    `role` ENUM('CHEF', 'REFERENT', 'ADMIN') NOT NULL DEFAULT 'CHEF',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `troupeId` VARCHAR(191) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `etapes` (
    `id` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `image_src` VARCHAR(191) NULL,
    `ordre` INTEGER NOT NULL,
    `actif` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `etapes_number_key`(`number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chef_etape_statuts` (
    `id` VARCHAR(191) NOT NULL,
    `chefId` VARCHAR(191) NOT NULL,
    `etapeId` VARCHAR(191) NOT NULL,
    `statut` ENUM('NON_COMMENCE', 'EN_COURS', 'EN_REVISION', 'VALIDE') NOT NULL DEFAULT 'EN_COURS',
    `valideeAt` DATETIME(3) NULL,
    `valideeParId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `chef_etape_statuts_chefId_etapeId_key`(`chefId`, `etapeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `objectifs` (
    `id` VARCHAR(191) NOT NULL,
    `etapeId` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `type` ENUM('COMPETENCE', 'REALISATION') NOT NULL,
    `fichiersRequis` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `objectifs_etapeId_code_key`(`etapeId`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `justifications` (
    `id` VARCHAR(191) NOT NULL,
    `chefId` VARCHAR(191) NOT NULL,
    `objectifId` VARCHAR(191) NOT NULL,
    `etapeId` VARCHAR(191) NOT NULL,
    `contenu` VARCHAR(191) NULL,
    `statut` ENUM('BROUILLON', 'AUTO_VALIDEE', 'SOUMISE', 'EN_COURS', 'DEMANDE_PRECISION', 'VALIDEE', 'REFUSEE') NOT NULL DEFAULT 'BROUILLON',
    `version` INTEGER NOT NULL DEFAULT 1,
    `soumiseAt` DATETIME(3) NULL,
    `valideeAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `justifications_chefId_objectifId_key`(`chefId`, `objectifId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fichiers` (
    `id` VARCHAR(191) NOT NULL,
    `justificationId` VARCHAR(191) NOT NULL,
    `nomOriginal` VARCHAR(191) NOT NULL,
    `nomStockage` VARCHAR(191) NOT NULL,
    `cheminFichier` VARCHAR(191) NOT NULL,
    `type` ENUM('IMAGE', 'DOCUMENT', 'AUTRE') NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `taille` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `commentaires` (
    `id` VARCHAR(191) NOT NULL,
    `justificationId` VARCHAR(191) NOT NULL,
    `auteurId` VARCHAR(191) NOT NULL,
    `contenu` VARCHAR(191) NOT NULL,
    `type` ENUM('CHEF_REPONSE', 'REFERENT_QUESTION', 'REFERENT_FEEDBACK', 'SYSTEM') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `etape_referents` (
    `id` VARCHAR(191) NOT NULL,
    `referentId` VARCHAR(191) NOT NULL,
    `etapeId` VARCHAR(191) NOT NULL,
    `assigneAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `assignePar` VARCHAR(191) NULL,

    UNIQUE INDEX `etape_referents_referentId_etapeId_key`(`referentId`, `etapeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` VARCHAR(191) NOT NULL,
    `destinataireId` VARCHAR(191) NOT NULL,
    `justificationId` VARCHAR(191) NULL,
    `type` ENUM('NOUVELLE_JUSTIFICATION', 'JUSTIFICATION_VALIDEE', 'JUSTIFICATION_REFUSEE', 'DEMANDE_PRECISION', 'REPONSE_PRECISION', 'ETAPE_COMPLETE', 'JUSTIFICATION_URGENTE', 'NOUVEAU_COMMENTAIRE') NOT NULL,
    `titre` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `lue` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lueAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session` (
    `id` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `session_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account` (
    `id` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `providerId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `accessToken` VARCHAR(191) NULL,
    `refreshToken` VARCHAR(191) NULL,
    `idToken` VARCHAR(191) NULL,
    `accessTokenExpiresAt` DATETIME(3) NULL,
    `refreshTokenExpiresAt` DATETIME(3) NULL,
    `scope` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verification` (
    `id` VARCHAR(191) NOT NULL,
    `identifier` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NULL,
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_troupeId_fkey` FOREIGN KEY (`troupeId`) REFERENCES `troupes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chef_etape_statuts` ADD CONSTRAINT `chef_etape_statuts_chefId_fkey` FOREIGN KEY (`chefId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chef_etape_statuts` ADD CONSTRAINT `chef_etape_statuts_etapeId_fkey` FOREIGN KEY (`etapeId`) REFERENCES `etapes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chef_etape_statuts` ADD CONSTRAINT `chef_etape_statuts_valideeParId_fkey` FOREIGN KEY (`valideeParId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `objectifs` ADD CONSTRAINT `objectifs_etapeId_fkey` FOREIGN KEY (`etapeId`) REFERENCES `etapes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `justifications` ADD CONSTRAINT `justifications_chefId_fkey` FOREIGN KEY (`chefId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `justifications` ADD CONSTRAINT `justifications_objectifId_fkey` FOREIGN KEY (`objectifId`) REFERENCES `objectifs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `justifications` ADD CONSTRAINT `justifications_etapeId_fkey` FOREIGN KEY (`etapeId`) REFERENCES `etapes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fichiers` ADD CONSTRAINT `fichiers_justificationId_fkey` FOREIGN KEY (`justificationId`) REFERENCES `justifications`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `commentaires` ADD CONSTRAINT `commentaires_justificationId_fkey` FOREIGN KEY (`justificationId`) REFERENCES `justifications`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `commentaires` ADD CONSTRAINT `commentaires_auteurId_fkey` FOREIGN KEY (`auteurId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `etape_referents` ADD CONSTRAINT `etape_referents_referentId_fkey` FOREIGN KEY (`referentId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `etape_referents` ADD CONSTRAINT `etape_referents_etapeId_fkey` FOREIGN KEY (`etapeId`) REFERENCES `etapes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_destinataireId_fkey` FOREIGN KEY (`destinataireId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_justificationId_fkey` FOREIGN KEY (`justificationId`) REFERENCES `justifications`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `session` ADD CONSTRAINT `session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
