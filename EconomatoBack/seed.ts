import { PrismaClient, estado_pedido, tipo_movimiento_enum } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Limpiando base de datos (Borrando rastro anterior)...');

  // EL ORDEN ES CRÍTICO: Primero borramos las tablas que dependen de otras (hijas)
  await prisma.pedido_ingrediente.deleteMany();
  await prisma.pedido_material.deleteMany();
  await prisma.receta_ingrediente.deleteMany();
  await prisma.escandallo_detalle.deleteMany();
  await prisma.movimiento.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.receta.deleteMany();
  await prisma.escandallo.deleteMany();
  await prisma.ingrediente.deleteMany();
  await prisma.material.deleteMany();
  await prisma.profesorado.deleteMany();
  await prisma.alumnado.deleteMany();
  await prisma.jefe_economato.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.proveedor.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.rol.deleteMany();

  console.log('🌱 Sembrando datos nuevos...');

  // 1. ROLES
  const rolAdmin = await prisma.rol.create({ data: { nombre: 'Administrador', tipo: 'ADMIN' } });
  const rolProfe = await prisma.rol.create({ data: { nombre: 'Profesor', tipo: 'PROFESOR' } });
  const rolAlumno = await prisma.rol.create({ data: { nombre: 'Alumno', tipo: 'ALUMNO' } });

  // 2. USUARIOS (Login: admin / 1234)
  const userAdmin = await prisma.usuario.create({
    data: {
      username: 'admin',
      nombre: 'Jefe',
      apellido1: 'Economato',
      contrasenya: '1234', // Texto plano para prueba rápida
      email: 'admin@escuela.com',
      id_rol: rolAdmin.id_rol
    }
  });

  // 3. CATEGORÍAS
  const catFrescos = await prisma.categoria.create({ data: { nombre: 'Frescos' } });
  const catSecos = await prisma.categoria.create({ data: { nombre: 'Secos' } });
  const catHerramientas = await prisma.categoria.create({ data: { nombre: 'Herramientas' } });

  // 4. PROVEEDORES
  const provMakro = await prisma.proveedor.create({ data: { nombre: 'Makro S.A.' } });
  const provLocal = await prisma.proveedor.create({ data: { nombre: 'Frutería del Barrio' } });

  // 5. INGREDIENTES (Para tu Inventario)
  await prisma.ingrediente.createMany({
    data: [
      { 
        nombre: 'Tomate Pera', 
        stock: 50.5, 
        unidad_medida: 'kg', 
        precio_unidad: 1.20, 
        id_categoria: catFrescos.id_categoria, 
        id_proveedor: provLocal.id_proveedor 
      },
      { 
        nombre: 'Aceite de Oliva', 
        stock: 20, 
        unidad_medida: 'l', 
        precio_unidad: 8.50, 
        id_categoria: catSecos.id_categoria, 
        id_proveedor: provMakro.id_proveedor 
      },
      { 
        nombre: 'Harina de Trigo', 
        stock: 100, 
        unidad_medida: 'kg', 
        precio_unidad: 0.90, 
        id_categoria: catSecos.id_categoria, 
        id_proveedor: provMakro.id_proveedor 
      }
    ]
  });

  // 6. MATERIALES
  await prisma.material.createMany({
    data: [
      { nombre: 'Cuchillo Cebollero', stock: 10, unidad_medida: 'u', precio_unidad: 15.00, id_categoria: catHerramientas.id_categoria },
      { nombre: 'Sartén Antiadherente', stock: 5, unidad_medida: 'u', precio_unidad: 25.00, id_categoria: catHerramientas.id_categoria }
    ]
  });

  console.log('✅ Base de Datos reseteada y cargada con éxito.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
  