-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'REFERENT', 'CHEF');

-- CreateEnum
CREATE TYPE "ValidationStatus" AS ENUM ('PENDING', 'VALIDATED', 'REJECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CHEF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badges" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_src" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competences" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,

    CONSTRAINT "competences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competence_progressions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "competenceId" TEXT NOT NULL,
    "checked" BOOLEAN NOT NULL DEFAULT false,
    "explanation" TEXT,
    "explanationRequested" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "competence_progressions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "explanation_requests" (
    "id" TEXT NOT NULL,
    "referentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "competenceProgressionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "explanation_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "realisation_requirements" (
    "id" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "required_count" INTEGER,

    CONSTRAINT "realisation_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "realisation_options" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirementId" TEXT NOT NULL,

    CONSTRAINT "realisation_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "realisations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "status" "ValidationStatus" NOT NULL DEFAULT 'PENDING',
    "validatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "realisations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ReferentsAssignedBadges" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ReferentsAssignedBadges_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "competence_progressions_userId_competenceId_key" ON "competence_progressions"("userId", "competenceId");

-- CreateIndex
CREATE INDEX "_ReferentsAssignedBadges_B_index" ON "_ReferentsAssignedBadges"("B");

-- AddForeignKey
ALTER TABLE "competences" ADD CONSTRAINT "competences_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "badges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competence_progressions" ADD CONSTRAINT "competence_progressions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competence_progressions" ADD CONSTRAINT "competence_progressions_competenceId_fkey" FOREIGN KEY ("competenceId") REFERENCES "competences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "explanation_requests" ADD CONSTRAINT "explanation_requests_referentId_fkey" FOREIGN KEY ("referentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "explanation_requests" ADD CONSTRAINT "explanation_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "explanation_requests" ADD CONSTRAINT "explanation_requests_competenceProgressionId_fkey" FOREIGN KEY ("competenceProgressionId") REFERENCES "competence_progressions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "realisation_requirements" ADD CONSTRAINT "realisation_requirements_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "badges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "realisation_options" ADD CONSTRAINT "realisation_options_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "realisation_requirements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "realisations" ADD CONSTRAINT "realisations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "realisations" ADD CONSTRAINT "realisations_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "realisation_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "realisations" ADD CONSTRAINT "realisations_validatedById_fkey" FOREIGN KEY ("validatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReferentsAssignedBadges" ADD CONSTRAINT "_ReferentsAssignedBadges_A_fkey" FOREIGN KEY ("A") REFERENCES "badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReferentsAssignedBadges" ADD CONSTRAINT "_ReferentsAssignedBadges_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
