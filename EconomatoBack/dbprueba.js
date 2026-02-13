import { PrismaClient, estado_pedido, tipo_movimiento_enum } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Empezando el sembrado de datos...')

  // 1. CREAR ROLES
  const rolAdmin = await prisma.rol.upsert({
    where: { id_rol: 1 },
    update: {},
    create: {
      nombre: 'Administrador',
      tipo: 'ADMIN',
    },
  })

  const rolProfesor = await prisma.rol.upsert({
    where: { id_rol: 2 },
    update: {},
    create: {
      nombre: 'Profesor',
      tipo: 'STAFF',
    },
  })

  // 2. CREAR CATEGORÍAS
  const catPerecederos = await prisma.categoria.create({
    data: { nombre: 'Perecederos' },
  })

  const catLimpieza = await prisma.categoria.create({
    data: { nombre: 'Limpieza' },
  })

  // 3. CREAR PROVEEDOR
  const proveedorGlobal = await prisma.proveedor.create({
    data: { nombre: 'Suministros Hostelería S.L.' },
  })

  // 4. CREAR USUARIO (Admin)
  // Nota: En un proyecto real, la contraseña debería estar hasheada (ej. con bcrypt)
  const adminUser = await prisma.usuario.upsert({
    where: { username: 'admin_user' },
    update: {},
    create: {
      username: 'admin_user',
      nombre: 'Juan',
      apellido1: 'Pérez',
      email: 'admin@escuela.com',
      contrasenya: 'password123', // ¡Cifrar en producción!
      id_rol: rolAdmin.id_rol,
      profesorado: {
        create: {
          asignaturas: 'Cocina Internacional, Gestión de Stocks'
        }
      }
    },
  })

  // 5. CREAR INGREDIENTES
  const harina = await prisma.ingrediente.create({
    data: {
      nombre: 'Harina de Trigo',
      stock: 50.0,
      stock_minimo: 10.0,
      unidad_medida: 'kg',
      precio_unidad: 1.20,
      id_categoria: catPerecederos.id_categoria,
      id_proveedor: proveedorGlobal.id_proveedor
    }
  })

  // 6. CREAR UN MOVIMIENTO DE PRUEBA
  await prisma.movimiento.create({
    data: {
      id_ingrediente: harina.id_ingrediente,
      id_usuario: adminUser.id_usuario,
      tipo_movimiento: tipo_movimiento_enum.ENTRADA,
      cantidad: 50.0,
      observaciones: 'Stock inicial carga masiva'
    }
  })

  console.log('✅ Sembrado completado con éxito.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })