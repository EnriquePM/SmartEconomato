-- AlterTable
ALTER TABLE "receta" ALTER COLUMN "descripcion" SET DATA TYPE TEXT,
ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(255);

-- CreateTable
CREATE TABLE "_alergenoToingrediente" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_alergenoToingrediente_AB_unique" ON "_alergenoToingrediente"("A", "B");

-- CreateIndex
CREATE INDEX "_alergenoToingrediente_B_index" ON "_alergenoToingrediente"("B");

-- AddForeignKey
ALTER TABLE "_alergenoToingrediente" ADD CONSTRAINT "_alergenoToingrediente_A_fkey" FOREIGN KEY ("A") REFERENCES "alergeno"("id_alergeno") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_alergenoToingrediente" ADD CONSTRAINT "_alergenoToingrediente_B_fkey" FOREIGN KEY ("B") REFERENCES "ingrediente"("id_ingrediente") ON DELETE CASCADE ON UPDATE CASCADE;
