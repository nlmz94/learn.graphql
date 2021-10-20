/*
  Warnings:

  - You are about to drop the column `createdAt` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `post` table. All the data in the column will be lost.
  - Added the required column `createdat` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedat` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `post` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `createdat` DATETIME(3) NOT NULL,
    ADD COLUMN `updatedat` DATETIME(3) NOT NULL;
