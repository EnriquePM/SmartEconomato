// EconomatoBack/clear.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function clear() {
  console.log('🧹 Vaciando todas las tablas...');
  const tables = ['pedido_ingrediente', 'pedido_material', 'receta_ingrediente', 'escandallo_detalle', 'movimiento', 'pedido', 'receta', 'escandallo', 'ingrediente', 'material', 'profesorado', 'alumnado', 'jefe_economato', 'usuario', 'proveedor', 'categoria', 'rol'];
  
  for (const table of tables) {
    await (prisma as any)[table].deleteMany();
  }
  console.log('✨ Base de datos limpia.');
}
clear().finally(() => prisma.$disconnect());