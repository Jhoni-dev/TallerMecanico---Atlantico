/*
  Warnings:

  - You are about to drop the column `extra` on the `InvoiceDetail` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `ClientContact` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `ClientContact` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[plates]` on the table `ClientVehicle` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `plates` to the `ClientVehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionId` to the `VehicleChecklist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChecklistItem" DROP CONSTRAINT "ChecklistItem_checklistId_fkey";

-- DropForeignKey
ALTER TABLE "ClientVehicle" DROP CONSTRAINT "ClientVehicle_clientId_fkey";

-- DropForeignKey
ALTER TABLE "VehicleChecklist" DROP CONSTRAINT "VehicleChecklist_appointmentId_fkey";

-- AlterTable
ALTER TABLE "ClientVehicle" ADD COLUMN     "plates" VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE "InvoiceDetail" DROP COLUMN "extra",
ADD COLUMN     "pieceExtra" DECIMAL(15,2),
ADD COLUMN     "serviceExtra" DECIMAL(15,2);

-- AlterTable
ALTER TABLE "VehicleChecklist" ADD COLUMN     "clientId" INTEGER,
ADD COLUMN     "mechanicId" INTEGER,
ADD COLUMN     "sessionId" INTEGER NOT NULL,
ALTER COLUMN "appointmentId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ServicesImages" (
    "id" SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "description" TEXT,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServicesImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PiecesImages" (
    "id" SERIAL NOT NULL,
    "pieceId" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "description" TEXT,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PiecesImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleImage" (
    "id" SERIAL NOT NULL,
    "checkList_id" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "description" TEXT,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VehicleImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServicesImages_serviceId_key" ON "ServicesImages"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "PiecesImages_pieceId_key" ON "PiecesImages"("pieceId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientContact_phoneNumber_key" ON "ClientContact"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ClientContact_email_key" ON "ClientContact"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ClientVehicle_plates_key" ON "ClientVehicle"("plates");

-- AddForeignKey
ALTER TABLE "ClientVehicle" ADD CONSTRAINT "ClientVehicle_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicesImages" ADD CONSTRAINT "ServicesImages_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PiecesImages" ADD CONSTRAINT "PiecesImages_pieceId_fkey" FOREIGN KEY ("pieceId") REFERENCES "Pieces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleChecklist" ADD CONSTRAINT "VehicleChecklist_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "AppointmentScheduling"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleChecklist" ADD CONSTRAINT "VehicleChecklist_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleChecklist" ADD CONSTRAINT "VehicleChecklist_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleImage" ADD CONSTRAINT "VehicleImage_checkList_id_fkey" FOREIGN KEY ("checkList_id") REFERENCES "VehicleChecklist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistItem" ADD CONSTRAINT "ChecklistItem_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "VehicleChecklist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
