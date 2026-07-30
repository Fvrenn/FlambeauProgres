-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_troupeId_fkey`;

-- DropColumn
ALTER TABLE `users` DROP COLUMN `troupeId`;

-- DropTable
DROP TABLE `troupes`;
