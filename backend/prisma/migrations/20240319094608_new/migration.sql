/*
  Warnings:

  - You are about to drop the column `clientCode` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `visitCode` on the `visit` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[taxCode]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Client_clientCode_key` ON `client`;

-- DropIndex
DROP INDEX `Visit_visitCode_key` ON `visit`;

-- AlterTable
ALTER TABLE `client` DROP COLUMN `clientCode`;

-- AlterTable
ALTER TABLE `visit` DROP COLUMN `visitCode`;

-- CreateIndex
CREATE UNIQUE INDEX `Client_taxCode_key` ON `Client`(`taxCode`);
