/*
  Warnings:

  - You are about to drop the column `postId` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_postId_fkey`;

-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_userId_fkey`;

-- AlterTable
ALTER TABLE `post` DROP COLUMN `postId`,
    DROP COLUMN `userId`,
    ADD COLUMN `postid` INTEGER NULL,
    ADD COLUMN `userid` INTEGER NOT NULL DEFAULT 2;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_postid_fkey` FOREIGN KEY (`postid`) REFERENCES `Post`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
