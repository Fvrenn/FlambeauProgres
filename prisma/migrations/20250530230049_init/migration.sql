-- CreateTable
CREATE TABLE "badges" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "number" TEXT,
    "description" TEXT,
    "image_src" TEXT,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competences" (
    "id" SERIAL NOT NULL,
    "badge_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "competences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "realisations" (
    "id" SERIAL NOT NULL,
    "badge_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "realisations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "competences" ADD CONSTRAINT "competences_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "realisations" ADD CONSTRAINT "realisations_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
