/*
  Warnings:

  - You are about to drop the column `date` on the `clipboarditem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `clipboarditem` DROP COLUMN `date`,
    ADD COLUMN `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);
