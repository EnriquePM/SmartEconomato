/*
  Warnings:

  - You are about to drop the column `tipo` on the `ingrediente` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ingrediente" DROP COLUMN "tipo",
ADD COLUMN     "precio_unidad" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "unidad_medida" VARCHAR(50);
