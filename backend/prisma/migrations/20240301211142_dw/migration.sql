-- CreateTable
CREATE TABLE `VisitRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `salesAgentId` INTEGER NOT NULL,
    `clientId` INTEGER NOT NULL,
    `visitDate` DATETIME(3) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pending',

    INDEX `salesAgentId`(`salesAgentId`),
    INDEX `clientId`(`clientId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VisitRequest` ADD CONSTRAINT `VisitRequest_salesAgentId_fkey` FOREIGN KEY (`salesAgentId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VisitRequest` ADD CONSTRAINT `VisitRequest_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
