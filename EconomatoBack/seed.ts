import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const PASSWORD_POR_DEFECTO = 'Economato123';

async function hashPassword() {
  return bcrypt.hash(PASSWORD_POR_DEFECTO, 10);
}

async function main() {
  console.log('🗑️  Limpiando base de datos (Borrando rastro anterior)...');

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
  await prisma.alergeno.deleteMany();

  console.log('🌱 Sembrando datos nuevos...');

  const hashedPassword = await hashPassword();

  const rolAdmin = await prisma.rol.create({ data: { nombre: 'Administrador', tipo: 'ADMIN' } });
  const rolProfe = await prisma.rol.create({ data: { nombre: 'Profesor', tipo: 'PROFESOR' } });
  const rolAlumno = await prisma.rol.create({ data: { nombre: 'Alumno', tipo: 'ALUMNO' } });

  await prisma.jefe_economato.create({
    data: {
      id_rol: rolAdmin.id_rol,
      permisos: 'GESTION_USUARIOS,GESTION_INVENTARIO,GESTION_PEDIDOS'
    }
  });

  const userAdmin = await prisma.usuario.create({
    data: {
      username: 'admin',
      nombre: 'Jefe',
      apellido1: 'Economato',
      apellido2: 'Centro',
      contrasenya: hashedPassword,
      primer_login: false,
      email: 'admin@escuela.com',
      id_rol: rolAdmin.id_rol
    }
  });

  const userProfesor = await prisma.usuario.create({
    data: {
      username: 'prof.cocina',
      nombre: 'Marta',
      apellido1: 'Ruiz',
      apellido2: 'Santos',
      contrasenya: hashedPassword,
      primer_login: true,
      email: 'marta.ruiz@escuela.com',
      id_rol: rolProfe.id_rol
    }
  });

  const userAlumno = await prisma.usuario.create({
    data: {
      username: 'alu.cocina',
      nombre: 'Diego',
      apellido1: 'Navarro',
      apellido2: 'Gil',
      contrasenya: hashedPassword,
      primer_login: true,
      email: 'diego.navarro@escuela.com',
      id_rol: rolAlumno.id_rol
    }
  });

  await prisma.profesorado.create({
    data: {
      id_usuario: userProfesor.id_usuario,
      asignaturas: 'Procesos Básicos de Pastelería, Cocina'
    }
  });

  await prisma.alumnado.create({
    data: {
      id_usuario: userAlumno.id_usuario,
      curso: '2º Cocina'
    }
  });

  const provMakro = await prisma.proveedor.create({ data: { nombre: 'Makro S.A.' } });
  const provLocal = await prisma.proveedor.create({ data: { nombre: 'Frutería del Barrio' } });
  const provDistribucion = await prisma.proveedor.create({ data: { nombre: 'Distribuciones Hosteleras Sur' } });

  const categoriasMap = new Map<string, number>();
  const categoriasUnicas = new Set<string>();
  const productosAImportar: any[] = [];
  const materialesAImportar: any[] = [];

  const csvIngredientesPath = path.join(__dirname, 'ingredientes.csv');
  const csvMaterialesPath = path.join(__dirname, 'materiales.csv');

  if (fs.existsSync(csvIngredientesPath)) {
    const lineas = fs.readFileSync(csvIngredientesPath, 'utf-8').split('\n').filter(line => line.trim() !== '');
    for (let i = 1; i < lineas.length; i++) {
      const cols = lineas[i].split(',');
      if (cols.length < 3) continue; // Si la línea está medio vacía, la saltamos

      const nombre = cols[0]?.trim();
      const unidad = cols[1]?.trim() || 'kg';
      const precioRaw = cols[2]?.replace('€', '').trim() || '0';
      const precio = parseFloat(precioRaw.replace(',', '.')); // Por si viene con coma decimal
      const categoria = cols[4]?.trim() || 'Sin Categoría';

      categoriasUnicas.add(categoria);
      productosAImportar.push({
        nombre: nombre,
        categoria: categoria,
        unidad: unidad,
        precio: precio
      });
    }
  }

  if (fs.existsSync(csvMaterialesPath)) {
    const lineas = fs.readFileSync(csvMaterialesPath, 'utf-8').split('\n').filter(line => line.trim() !== '');
    for (let i = 1; i < lineas.length; i++) {
      const cols = lineas[i].split(',');
      if (cols.length < 3) continue;

      const nombre = cols[0]?.trim();
      const unidad = cols[1]?.trim() || 'u';
      const precioRaw = cols[2]?.replace('€', '').trim() || '0';
      const precio = parseFloat(precioRaw.replace(',', '.'));
      // Si materiales no tiene 5 columnas, usamos una categoría por defecto
      const categoria = cols[4]?.trim() || 'Herramientas';

      categoriasUnicas.add(categoria);
      materialesAImportar.push({
        nombre: nombre,
        categoria: categoria,
        unidad: unidad,
        precio: precio
      });
    }
  }

  for (const catNombre of categoriasUnicas) {
    const nuevaCat = await prisma.categoria.create({ data: { nombre: catNombre } });
    categoriasMap.set(catNombre, nuevaCat.id_categoria);
  }

  for (const prod of productosAImportar) {
    await prisma.ingrediente.create({
      data: {
        nombre: prod.nombre,
        tipo: prod.categoria,
        unidad_medida: prod.unidad,
        precio_unidad: prod.precio,
        stock: 0,
        stock_minimo: 5,
        id_categoria: categoriasMap.get(prod.categoria)!,
        id_proveedor: provMakro.id_proveedor
      }
    });
  }

  for (const mat of materialesAImportar) {
    await prisma.material.create({
      data: {
        nombre: mat.nombre,
        unidad_medida: mat.unidad,
        precio_unidad: mat.precio,
        stock: 0,
        stock_minimo: 2,
        id_categoria: categoriasMap.get(mat.categoria)!
      }
    });
  }

  console.log(`👤 Usuarios creados: ${userAdmin.username}, ${userProfesor.username}, ${userAlumno.username}`);
  console.log(`📦 Importados ${productosAImportar.length} ingredientes y ${materialesAImportar.length} materiales.`);

  console.log('🥜 Sembrando alérgenos...');
  const alergenosData = [
    { nombre: 'Altramuces', icono: 'altramuces.png' },
    { nombre: 'Apio', icono: 'apio.png' },
    { nombre: 'Cacahuetes', icono: 'cacahuetes.png' },
    { nombre: 'Crustáceos', icono: 'crustaceos.png' },
    { nombre: 'Frutos de cáscara', icono: 'frutosecos.png' },
    { nombre: 'Gluten', icono: 'gluten.png' },
    { nombre: 'Huevos', icono: 'huevos.png' },
    { nombre: 'Lácteos', icono: 'lactosa.png' },
    { nombre: 'Moluscos', icono: 'moluscos.png' },
    { nombre: 'Mostaza', icono: 'mostaza.png' },
    { nombre: 'Pescado', icono: 'pescado.png' },
    { nombre: 'Sésamo', icono: 'sesamo.png' },
    { nombre: 'Soja', icono: 'soja.png' },
    { nombre: 'Sulfitos', icono: 'sulfito.png' }
  ];

  for (const alg of alergenosData) {
    await prisma.alergeno.create({ data: alg });
  }

  console.log('✅ Base de Datos reseteada y cargada con éxito.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });