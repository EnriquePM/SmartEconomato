import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    // Usamos el nombre corto que sabemos que funciona
    const fileName = 'ESCANDALLO 24-25 MENÚ 20 DE MARZO.xlsx';
    const filePath = path.join(__dirname, '..', fileName);
    const targetSheetName = "LISTA DE PRECIOS MATERIALES";

    console.log(`📂 Buscando archivo en: ${filePath}`);

    if (!fs.existsSync(filePath)) {
        console.error(`❌ Error: No encuentro el archivo.`);
        process.exit(1);
    }

    const workbook = XLSX.readFile(filePath);
    let sheetName = workbook.SheetNames.find(n => n.trim().toUpperCase() === targetSheetName.trim().toUpperCase());

    if (!sheetName) {
        sheetName = workbook.SheetNames.find(n => n.toUpperCase().includes("MATERIAL"));
    }

    if (!sheetName) {
        console.error(`❌ No pude encontrar la hoja de materiales.`);
        process.exit(1);
    }

    console.log(`📄 Leyendo hoja: "${sheetName}"`);
    const sheet = workbook.Sheets[sheetName];
    // Leemos como array de arrays porque NO HAY CABECERAS
    const data: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    console.log(`📊 Encontradas ${data.length} filas de datos.`);

    // 1. Asegurar categoría "Materiales"
    const nombreCategoria = "Materiales";
    let categoria = await prisma.categoria.findFirst({
        where: { nombre: nombreCategoria }
    });

    if (!categoria) {
        categoria = await prisma.categoria.create({
            data: { nombre: nombreCategoria }
        });
        console.log(`➕ Categoría creada: ${nombreCategoria}`);
    } else {
        console.log(`ℹ️ Usando categoría existente: ${nombreCategoria} (ID: ${categoria.id_categoria})`);
    }

    let createdCount = 0;
    let updatedCount = 0;

    for (const rawRow of data) {
        // Estructura detectada: [Nombre, Unidad, Precio]
        // Ejemplo: ["Alfileres", "caja", "1.49 €"]
        // Cortamos para asegurar que solo leemos lo que nos interesa y no las 1000 columnas vacías
        const row = rawRow.slice(0, 3); 
        
        if (row.length === 0) continue;

        const nombreMaterial = row[0];
        const unidad = row[1];
        const precioRaw = row[2];

        // Validar que exista nombre y que no sea solo espacios
        if (!nombreMaterial || typeof nombreMaterial !== 'string' || nombreMaterial.trim() === '') {
            continue; 
        }

        let precio = 0;
        if (typeof precioRaw === 'string') {
             const cleanPrice = precioRaw
                .replace(/€/g, '')
                .replace(/'/g, '.') 
                .replace(/´/g, '.') 
                .replace(/,/g, '.') 
                .trim();
             precio = parseFloat(cleanPrice);
        } else if (typeof precioRaw === 'number') {
            precio = precioRaw;
        }

        if (isNaN(precio)) precio = 0;

        try {
            // Buscar o crear en tabla MATERIAL
            let material = await prisma.material.findFirst({
                where: { nombre: nombreMaterial }
            });

            if (material) {
                // Actualizar
                await prisma.material.update({
                    where: { id_material: material.id_material },
                    data: {
                        unidad_medida: unidad ? String(unidad) : undefined,
                        precio_unidad: precio,
                        id_categoria: categoria.id_categoria
                    }
                });
                updatedCount++;
                // console.log(`✏️ [Actualizado] ${nombreMaterial}`);
            } else {
                // Crear
                await prisma.material.create({
                    data: {
                        nombre: nombreMaterial,
                        unidad_medida: unidad ? String(unidad) : null,
                        precio_unidad: precio,
                        id_categoria: categoria.id_categoria
                    }
                });
                createdCount++;
                console.log(`✅ [Creado] ${nombreMaterial}: ${precio}€`);
            }

        } catch (error) {
            console.error(`❌ Error con ${nombreMaterial}:`, error);
        }
    }

    console.log(`\n🎉 Resumen Materiales:`);
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
