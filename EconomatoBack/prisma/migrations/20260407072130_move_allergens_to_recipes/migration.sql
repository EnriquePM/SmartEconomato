/*
  Warnings:

  - The primary key for the `alumnado` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_rol` on the `alumnado` table. All the data in the column will be lost.
  - The primary key for the `profesorado` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_rol` on the `profesorado` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_creacion` on the `usuario` table. All the data in the column will be lost.
  - You are about to alter the column `nombre` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.
  - You are about to alter the column `apellido1` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.
  - You are about to alter the column `apellido2` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.
  - You are about to alter the column `username` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `email` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(150)` to `VarChar(100)`.
  - Added the required column `id_usuario` to the `alumnado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_usuario` to the `profesorado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `receta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "estado_pedido" ADD VALUE 'BORRADOR';
ALTER TYPE "estado_pedido" ADD VALUE 'INCOMPLETO';
ALTER TYPE "estado_pedido" ADD VALUE 'CONFIRMADO';
ALTER TYPE "estado_pedido" ADD VALUE 'RECHAZADO';

-- DropForeignKey
ALTER TABLE "alumnado" DROP CONSTRAINT "fk_alumno_rol";

-- DropForeignKey
ALTER TABLE "profesorado" DROP CONSTRAINT "fk_profesor_rol";

-- DropForeignKey
ALTER TABLE "usuario" DROP CONSTRAINT "fk_usuario_rol";

-- AlterTable
ALTER TABLE "alumnado" DROP CONSTRAINT "alumnado_pkey",
DROP COLUMN "id_rol",
ADD COLUMN     "id_usuario" INTEGER NOT NULL,
ADD CONSTRAINT "alumnado_pkey" PRIMARY KEY ("id_usuario");

-- AlterTable
ALTER TABLE "escandallo" ADD COLUMN     "id_receta" INTEGER,
ADD COLUMN     "id_usuario" INTEGER;

-- AlterTable
ALTER TABLE "ingrediente" ADD COLUMN     "tipo" VARCHAR(50);

-- AlterTable
ALTER TABLE "pedido" ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "proveedor" VARCHAR(150),
ADD COLUMN     "tipo_pedido" VARCHAR(50),
ADD COLUMN     "total_estimado" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "pedido_ingrediente" ADD COLUMN     "cantidad_recibida" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "profesorado" DROP CONSTRAINT "profesorado_pkey",
DROP COLUMN "id_rol",
ADD COLUMN     "id_usuario" INTEGER NOT NULL,
ADD CONSTRAINT "profesorado_pkey" PRIMARY KEY ("id_usuario");

-- AlterTable
ALTER TABLE "receta" ADD COLUMN     "descripcion" VARCHAR(255),
ADD COLUMN     "nombre" VARCHAR(150) NOT NULL;

-- AlterTable
ALTER TABLE "usuario" DROP COLUMN "fecha_creacion",
ADD COLUMN     "primer_login" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "apellido1" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "apellido2" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "username" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(100);

-- CreateTable
CREATE TABLE "alergeno" (
    "id_alergeno" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "icono" VARCHAR(255),

    CONSTRAINT "alergeno_pkey" PRIMARY KEY ("id_alergeno")
);

-- CreateTable
CREATE TABLE "receta_alergeno" (
    "id_receta" INTEGER NOT NULL,
    "id_alergeno" INTEGER NOT NULL,

    CONSTRAINT "receta_alergeno_pkey" PRIMARY KEY ("id_receta","id_alergeno")
);

-- CreateTable
CREATE TABLE "material" (
    "id_material" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "unidad_medida" VARCHAR(50),
    "precio_unidad" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "stock_minimo" INTEGER NOT NULL DEFAULT 0,
    "id_categoria" INTEGER,

    CONSTRAINT "material_pkey" PRIMARY KEY ("id_material")
);

-- CreateTable
CREATE TABLE "pedido_material" (
    "id_pedido" INTEGER NOT NULL,
    "id_material" INTEGER NOT NULL,
    "cantidad_solicitada" INTEGER NOT NULL,
    "cantidad_recibida" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "pedido_material_pkey" PRIMARY KEY ("id_pedido","id_material")
);

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "rol"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alumnado" ADD CONSTRAINT "alumnado_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profesorado" ADD CONSTRAINT "profesorado_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receta_alergeno" ADD CONSTRAINT "receta_alergeno_id_receta_fkey" FOREIGN KEY ("id_receta") REFERENCES "receta"("id_receta") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "receta_alergeno" ADD CONSTRAINT "receta_alergeno_id_alergeno_fkey" FOREIGN KEY ("id_alergeno") REFERENCES "alergeno"("id_alergeno") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material" ADD CONSTRAINT "fk_material_categoria" FOREIGN KEY ("id_categoria") REFERENCES "categoria"("id_categoria") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pedido_material" ADD CONSTRAINT "pedido_material_id_material_fkey" FOREIGN KEY ("id_material") REFERENCES "material"("id_material") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pedido_material" ADD CONSTRAINT "pedido_material_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedido"("id_pedido") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "escandallo" ADD CONSTRAINT "fk_escandallo_receta" FOREIGN KEY ("id_receta") REFERENCES "receta"("id_receta") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "escandallo" ADD CONSTRAINT "fk_escandallo_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;
