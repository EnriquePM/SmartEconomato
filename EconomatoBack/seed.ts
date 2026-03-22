import { PrismaClient, estado_pedido } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const PASSWORD_POR_DEFECTO = 'Economato123';

async function hashPassword() {
  return bcrypt.hash(PASSWORD_POR_DEFECTO, 10);
}

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

  const hashedPassword = await hashPassword();

  // 1. ROLES
  const rolAdmin = await prisma.rol.create({ data: { nombre: 'Administrador', tipo: 'ADMIN' } });
  const rolProfe = await prisma.rol.create({ data: { nombre: 'Profesor', tipo: 'PROFESOR' } });
  const rolAlumno = await prisma.rol.create({ data: { nombre: 'Alumno', tipo: 'ALUMNO' } });

  await prisma.jefe_economato.create({
    data: {
      id_rol: rolAdmin.id_rol,
      permisos: 'GESTION_USUARIOS,GESTION_INVENTARIO,GESTION_PEDIDOS'
    }
  });

  // 2. USUARIOS Y PERFILES
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

  // 3. CATEGORÍAS
  const catFrescos = await prisma.categoria.create({ data: { nombre: 'Frescos' } });
  const catSecos = await prisma.categoria.create({ data: { nombre: 'Secos' } });
  const catConservas = await prisma.categoria.create({ data: { nombre: 'Conservas' } });
  const catLimpieza = await prisma.categoria.create({ data: { nombre: 'Limpieza' } });
  const catHerramientas = await prisma.categoria.create({ data: { nombre: 'Herramientas' } });

  // 4. PROVEEDORES
  const provMakro = await prisma.proveedor.create({ data: { nombre: 'Makro S.A.' } });
  const provLocal = await prisma.proveedor.create({ data: { nombre: 'Frutería del Barrio' } });
  const provDistribucion = await prisma.proveedor.create({ data: { nombre: 'Distribuciones Hosteleras Sur' } });

  // 5. INGREDIENTES
  const tomatePera = await prisma.ingrediente.create({
    data: {
      nombre: 'Tomate Pera',
      imagen: '/images/ingredientes/tomate-pera.jpg',
      stock: 50.5,
      stock_minimo: 12,
      tipo: 'Verdura',
      unidad_medida: 'kg',
      precio_unidad: 1.2,
      id_categoria: catFrescos.id_categoria,
      id_proveedor: provLocal.id_proveedor
    }
  });

  const aceiteOliva = await prisma.ingrediente.create({
    data: {
      nombre: 'Aceite de Oliva Virgen Extra',
      imagen: '/images/ingredientes/aceite-oliva.jpg',
      stock: 20,
      stock_minimo: 6,
      tipo: 'Aceite',
      unidad_medida: 'l',
      precio_unidad: 8.5,
      id_categoria: catSecos.id_categoria,
      id_proveedor: provMakro.id_proveedor
    }
  });

  const harinaTrigo = await prisma.ingrediente.create({
    data: {
      nombre: 'Harina de Trigo',
      imagen: '/images/ingredientes/harina-trigo.jpg',
      stock: 100,
      stock_minimo: 25,
      tipo: 'Harina',
      unidad_medida: 'kg',
      precio_unidad: 0.9,
      id_categoria: catSecos.id_categoria,
      id_proveedor: provMakro.id_proveedor
    }
  });

  const tomateTriturado = await prisma.ingrediente.create({
    data: {
      nombre: 'Tomate Triturado',
      imagen: '/images/ingredientes/tomate-triturado.jpg',
      stock: 30,
      stock_minimo: 8,
      tipo: 'Conserva',
      unidad_medida: 'u',
      precio_unidad: 1.75,
      id_categoria: catConservas.id_categoria,
      id_proveedor: provDistribucion.id_proveedor
    }
  });

  const huevos = await prisma.ingrediente.create({
    data: {
      nombre: 'Huevos Camperos L',
      imagen: '/images/ingredientes/huevos-camperos.jpg',
      stock: 180,
      stock_minimo: 60,
      tipo: 'Huevos',
      unidad_medida: 'u',
      precio_unidad: 0.23,
      id_categoria: catFrescos.id_categoria,
      id_proveedor: provDistribucion.id_proveedor
    }
  });

  const arrozBomba = await prisma.ingrediente.create({
    data: {
      nombre: 'Arroz Bomba',
      imagen: '/images/ingredientes/arroz-bomba.jpg',
      stock: 40,
      stock_minimo: 10,
      tipo: 'Arroz',
      unidad_medida: 'kg',
      precio_unidad: 3.9,
      id_categoria: catSecos.id_categoria,
      id_proveedor: provMakro.id_proveedor
    }
  });

  // 6. MATERIALES
  const cuchillo = await prisma.material.create({
    data: {
      nombre: 'Cuchillo Cebollero',
      stock: 10,
      stock_minimo: 4,
      unidad_medida: 'u',
      precio_unidad: 15,
      id_categoria: catHerramientas.id_categoria
    }
  });

  const sarten = await prisma.material.create({
    data: {
      nombre: 'Sarten Antiadherente',
      stock: 5,
      stock_minimo: 2,
      unidad_medida: 'u',
      precio_unidad: 25,
      id_categoria: catHerramientas.id_categoria
    }
  });

  const delantal = await prisma.material.create({
    data: {
      nombre: 'Delantal de Cocina',
      stock: 24,
      stock_minimo: 8,
      unidad_medida: 'u',
      precio_unidad: 9.5,
      id_categoria: catLimpieza.id_categoria
    }
  });

  const guantes = await prisma.material.create({
    data: {
      nombre: 'Caja de Guantes de Nitrilo',
      stock: 12,
      stock_minimo: 4,
      unidad_medida: 'caja',
      precio_unidad: 7.8,
      id_categoria: catLimpieza.id_categoria
    }
  });

  // 7. PEDIDOS DE EJEMPLO
  const pedidoBorrador = await prisma.pedido.create({
    data: {
      id_usuario: userProfesor.id_usuario,
      fecha_pedido: new Date('2026-03-18T09:00:00Z'),
      estado: estado_pedido.BORRADOR,
      proveedor: provMakro.nombre,
      observaciones: 'Pendiente de revision del jefe de economato.',
      total_estimado: 54.8,
      tipo_pedido: 'productos',
      pedido_ingrediente: {
        create: [
          {
            id_ingrediente: harinaTrigo.id_ingrediente,
            cantidad_solicitada: 20,
            cantidad_recibida: 0
          },
          {
            id_ingrediente: aceiteOliva.id_ingrediente,
            cantidad_solicitada: 4,
            cantidad_recibida: 0
          }
        ]
      }
    }
  });

  const pedidoPendiente = await prisma.pedido.create({
    data: {
      id_usuario: userAdmin.id_usuario,
      fecha_pedido: new Date('2026-03-19T08:30:00Z'),
      estado: estado_pedido.PENDIENTE,
      proveedor: provDistribucion.nombre,
      observaciones: 'Reposicion para practicas del turno de manana.',
      total_estimado: 99.9,
      tipo_pedido: 'productos',
      pedido_ingrediente: {
        create: [
          {
            id_ingrediente: tomatePera.id_ingrediente,
            cantidad_solicitada: 25,
            cantidad_recibida: 10
          },
          {
            id_ingrediente: huevos.id_ingrediente,
            cantidad_solicitada: 120,
            cantidad_recibida: 60
          },
          {
            id_ingrediente: tomateTriturado.id_ingrediente,
            cantidad_solicitada: 8,
            cantidad_recibida: 0
          }
        ]
      }
    }
  });

  const pedidoUtensilios = await prisma.pedido.create({
    data: {
      id_usuario: userProfesor.id_usuario,
      fecha_pedido: new Date('2026-03-20T11:15:00Z'),
      estado: estado_pedido.CONFIRMADO,
      proveedor: provDistribucion.nombre,
      observaciones: 'Material recibido para el nuevo taller.',
      total_estimado: 76.2,
      tipo_pedido: 'utensilios',
      pedido_material: {
        create: [
          {
            id_material: cuchillo.id_material,
            cantidad_solicitada: 2,
            cantidad_recibida: 2
          },
          {
            id_material: delantal.id_material,
            cantidad_solicitada: 4,
            cantidad_recibida: 4
          },
          {
            id_material: guantes.id_material,
            cantidad_solicitada: 1,
            cantidad_recibida: 1
          }
        ]
      }
    }
  });

  console.log(`👤 Usuarios creados: ${userAdmin.username}, ${userProfesor.username}, ${userAlumno.username}`);
  console.log(`📦 Pedidos creados: ${pedidoBorrador.id_pedido}, ${pedidoPendiente.id_pedido}, ${pedidoUtensilios.id_pedido}`);

  console.log('✅ Base de Datos reseteada y cargada con éxito.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
