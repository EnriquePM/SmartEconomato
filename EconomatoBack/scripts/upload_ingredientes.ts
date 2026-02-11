import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const fileName = 'ESCANDALLO 24-25 MENÚ 20 DE MARZO.xlsx';
    const filePath = path.join(__dirname, '..', fileName);
    const targetSheetName = "LISTA DE PRECIOS INGREDIENTES";

    console.log(`📂 Buscando archivo en: ${filePath}`);

    if (!fs.existsSync(filePath)) {
        console.error(`❌ Error: No encuentro el archivo.`);
        process.exit(1);
    }

    const workbook = XLSX.readFile(filePath);
    let sheetName = workbook.SheetNames.find(n => n.trim().toUpperCase() === targetSheetName.trim().toUpperCase());

    if (!sheetName) {
        sheetName = workbook.SheetNames.find(n => n.toUpperCase().includes("PRECIO") || n.toUpperCase().includes("LISTA"));
    }

    if (!sheetName) {
        console.error(`❌ No pude encontrar la hoja de precios.`);
        process.exit(1);
    }

    console.log(`📄 Leyendo hoja: "${sheetName}"`);
    const sheet = workbook.Sheets[sheetName];
    const data: any[] = XLSX.utils.sheet_to_json(sheet);

    console.log(`📊 Encontradas ${data.length} filas de datos.`);

    let createdCount = 0;
    let updatedCount = 0;

    for (const row of data) {
        const nombreIngrediente = row['INGREDIENTES'];
        const unidad = row['UND'];
        const precioRaw = row['PRECIO / unidad']; 
        const nombreCategoria = row['CATEGORÍA'];
        
        if (!nombreIngrediente || !nombreCategoria) {
            continue;
        }

        let precio = 0;
        if (typeof precioRaw === 'string') {
            const cleanPrice = precioRaw.replace('€', '').replace(',', '.').trim();
            precio = parseFloat(cleanPrice);
        } else if (typeof precioRaw === 'number') {
            precio = precioRaw;
        }

        if (isNaN(precio)) precio = 0;

        try {
            // 1. Categoría
            let categoria = await prisma.categoria.findFirst({
                where: { nombre: nombreCategoria }
            });

            if (!categoria) {
                categoria = await prisma.categoria.create({
                    data: { nombre: nombreCategoria }
                });
            }

            // 2. Ingrediente
            let ingrediente = await prisma.ingrediente.findFirst({
                where: { nombre: nombreIngrediente }
            });

            if (ingrediente) {
                // Actualizar
                await prisma.ingrediente.update({
                    where: { id_ingrediente: ingrediente.id_ingrediente },
                    data: {
                        // Si 'unidad' tiene valor, lo actualizamos. Si es null/undefined/vacío, pasamos 'undefined' para que Prisma NO lo toque.
                        unidad_medida: unidad ? String(unidad) : undefined,
                        precio_unidad: precio,
                        id_categoria: categoria.id_categoria, 
                    }
                });
                updatedCount++;
                console.log(`✏️ [Actualizado] ${nombreIngrediente}: ${precio}€${unidad ? ', ' + unidad : ''}`);
            } else {
                // Crear
                await prisma.ingrediente.create({
                    data: {
                        nombre: nombreIngrediente,
                        // Al crear, si no hay unidad, la guardamos como null (o string vacío si prefieres, pero schema permite null)
                        unidad_medida: unidad ? String(unidad) : null,
                        precio_unidad: precio,
                        id_categoria: categoria.id_categoria,
                        stock: 0,
                        stock_minimo: 0,
                    }
                });
                createdCount++;
                console.log(`✅ [Creado] ${nombreIngrediente}: ${precio}€`);
            }

        } catch (error) {
            console.error(`❌ Error con ${nombreIngrediente}:`, error);
        }
    }

    console.log(`\n🎉 Resumen:`);
    console.log(`   - Creados: ${createdCount}`);
    console.log(`   - Actualizados: ${updatedCount}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
