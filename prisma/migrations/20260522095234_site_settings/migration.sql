/*
  Warnings:

  - You are about to drop the column `metaDescription` on the `SiteSetting` table. All the data in the column will be lost.
  - You are about to drop the column `metaKeywords` on the `SiteSetting` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `SiteSetting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `SiteSetting` DROP COLUMN `metaDescription`,
    DROP COLUMN `metaKeywords`,
    DROP COLUMN `metaTitle`,
    ADD COLUMN `businessHours` VARCHAR(191) NULL,
    ADD COLUMN `heroButtonLink` VARCHAR(191) NULL,
    ADD COLUMN `heroButtonText` VARCHAR(191) NULL,
    ADD COLUMN `seoDescription` TEXT NULL,
    ADD COLUMN `seoKeywords` VARCHAR(191) NULL,
    ADD COLUMN `seoTitle` VARCHAR(191) NULL,
    ADD COLUMN `siteDescription` TEXT NULL,
    ADD COLUMN `whatsapp` VARCHAR(191) NULL;
