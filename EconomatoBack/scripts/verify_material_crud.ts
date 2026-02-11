import { spawn, ChildProcess } from 'child_process';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

const prisma = new PrismaClient();
const fetch = global.fetch || require('node-fetch');

const TEST_EMAIL = 'admin_material@escuela.com';
const TEST_PASS = '123456';
const PORT = 3004;
const BASE_URL = `http://localhost:${PORT}/api`;

let server: ChildProcess | null = null;

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function cleanup() {
    if (server) {
        console.log('   Deteniendo servidor...');
        if (process.platform === 'win32') {
             try {
                if (server.pid) {
                    process.kill(server.pid);
                    spawn('taskkill', ['/pid', server.pid.toString(), '/f', '/t']);
                }
             } catch(e) {}
        } else {
             server.kill();
        }
    }
    await prisma.$disconnect();
}

async function main() {
    console.log('--- Iniciando Verificación CRUD Materiales ---');

    try {
        // 1. Preparar Datos (Usuario Admin/Profe)
        console.log('1. Preparando usuario admin...');
        await prisma.rol.upsert({
            where: { id_rol: 2 },
            update: {},
            create: { id_rol: 2, nombre: 'Profesorado', tipo: 'PROFESORADO' }
        });

        const usuario = await prisma.usuario.upsert({
            where: { email: TEST_EMAIL },
            update: { contrasenya: TEST_PASS, id_rol: 2 },
            create: {
                nombre: 'AdminMaterial',
                apellido1: 'Test',
                username: 'admin_material',
                email: TEST_EMAIL,
                contrasenya: TEST_PASS,
                id_rol: 2
            }
        });

        // Asegurar categoría 'Menaje' existe
        const categoria = await prisma.categoria.upsert({
            where: { id_categoria: 100 },
            update: {},
            create: { id_categoria: 100, nombre: 'Test Menaje' }
        });

        // 2. Iniciar Servidor
        console.log(`2. Iniciando servidor en puerto ${PORT}...`);
        const env = { ...process.env, PORT: PORT.toString() };
        server = spawn('npx', ['ts-node', 'src/index.ts'], {
            shell: true, env, cwd: join(__dirname, '..')
        });

        let serverReady = false;
        server.stdout?.on('data', (data) => {
            if (data.toString().includes('Backend corriendo')) serverReady = true;
        });

        let attempts = 0;
        while (!serverReady && attempts < 60) {
            await sleep(500);
            attempts++;
        }
        if (!serverReady) throw new Error('Timeout esperando al servidor');
        console.log('   Servidor listo.');

        // 3. Login
        console.log('3. Logueando...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin_material', contrasenya: TEST_PASS })
        });
        const loginData = await loginRes.json() as any;
        const token = loginData.token;
        if (!token) throw new Error('Login fallido');

        // 4. CREAR Material
        console.log('4. Creando Material...');
        const createRes = await fetch(`${BASE_URL}/materiales`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                nombre: 'Cuchara de Palo Test',
                unidad_medida: 'unidad',
                precio_unidad: 1.50,
                id_categoria: 100
            })
        });
        const createdMat = await createRes.json() as any;
        if (!createdMat.id_material) throw new Error(`Fallo al crear: ${JSON.stringify(createdMat)}`);
        console.log(`   Material creado ID: ${createdMat.id_material}`);

        // 5. LISTAR Materiales
        console.log('5. Listando Materiales...');
        const listRes = await fetch(`${BASE_URL}/materiales`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const listData = await listRes.json() as any;
        const found = listData.find((m: any) => m.id_material === createdMat.id_material);
        if (!found) throw new Error('El material creado no aparece en el listado.');
        console.log('   Material encontrado en lista.');

        // 6. MODIFICAR Material
        console.log('6. Modificando Precio...');
        const updateRes = await fetch(`${BASE_URL}/materiales/${createdMat.id_material}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ precio_unidad: 2.99 })
        });
        const updatedMat = await updateRes.json() as any;
        if (Number(updatedMat.precio_unidad) !== 2.99) throw new Error('El precio no se actualizó.');
        console.log('   Precio actualizado correctamente.');

        // 7. ELIMINAR Material
        console.log('7. Eliminando Material...');
        const deleteRes = await fetch(`${BASE_URL}/materiales/${createdMat.id_material}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!deleteRes.ok) throw new Error('Fallo al eliminar.');
        console.log('   Material eliminado.');

        // Verificar que ya no existe (Opcional, pero recomendado)
        const checkRes = await fetch(`${BASE_URL}/materiales`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const checkData = await checkRes.json() as any;
        const stillExists = checkData.find((m: any) => m.id_material === createdMat.id_material);
        if (stillExists) throw new Error('El material sigue apareciendo tras borrarlo.');

        console.log('✅ PRUEBA CRUD MATERIALES EXITOSA');

    } catch (error: any) {
        console.error('❌ ERROR:', error.message);
        process.exit(1);
    } finally {
        await cleanup();
    }
}

main();
