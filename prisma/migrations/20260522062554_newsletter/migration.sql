/*
  Warnings:

  - Made the column `price` on table `ProductVariant` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `Product_sku_key` ON `Product`;

-- AlterTable
ALTER TABLE `Product` MODIFY `description` VARCHAR(191) NULL,
    MODIFY `sku` VARCHAR(191) NULL,
    ALTER COLUMN `stock` DROP DEFAULT;

-- AlterTable
ALTER TABLE `ProductVariant` MODIFY `price` DOUBLE NOT NULL,
    ALTER COLUMN `stock` DROP DEFAULT;

-- CreateTable
CREATE TABLE `NewsletterSubscriber` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `NewsletterSubscriber_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
