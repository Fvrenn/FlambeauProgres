/*
  Warnings:

  - A unique constraint covering the columns `[wpUserId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `wpUserId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_wpUserId_key` ON `users`(`wpUserId`);
