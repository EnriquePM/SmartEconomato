import { spawn, ChildProcess } from 'child_process';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

const prisma = new PrismaClient();

// Helper para fetch simple (Node 18+)
const fetch = global.fetch || require('node-fetch');

const TEST_EMAIL = 'test_profesor@escuela.com';
const TEST_PASS = '123456';
const PORT = 3002;
const BASE_URL = `http://localhost:${PORT}/api`;

let server: ChildProcess | null = null;

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function cleanup() {
    if (server) {
        console.log('   Deteniendo servidor...');
        
        // Windows kill
        if (process.platform === 'win32') {
             try {
                if (server.pid) process.kill(server.pid);
                spawn('taskkill', ['/pid', server.pid!.toString(), '/f', '/t']);
             } catch(e) {}
        } else {
             server.kill();
        }
    }
    await prisma.$disconnect();
}

async function main() {
    console.log('--- Iniciando Verificación Completa del Sistema (Login + Pedidos) ---');

    try {
        // 1. Asegurar que existe el usuario y rol en la BD
        console.log('1. Preparando base de datos...');
        
        // Asegurar Rol 2 (PROFESORADO)
        try {
            await prisma.rol.upsert({
                where: { id_rol: 2 },
                update: {},
                create: {
                    id_rol: 2,
                    nombre: 'Profesorado',
                    tipo: 'PROFESORADO'
                }
            });
        } catch (e) {
            console.log('   Nota: Error al insertar Rol. Continuando...');
        }

        // Crear/Actualizar usuario
        const usuario = await prisma.usuario.upsert({
            where: { email: TEST_EMAIL },
            update: {
                contrasenya: TEST_PASS,
                id_rol: 2,
                username: 'profesor_test'
            },
            create: {
                nombre: 'Profesor',
                apellido1: 'Test',
                username: 'profesor_test',
                email: TEST_EMAIL,
                contrasenya: TEST_PASS,
                id_rol: 2
            }
        });
        console.log(`   Usuario de prueba listo: ${usuario.email} (ID: ${usuario.id_usuario})`);

        // Asegurar un ingrediente de prueba
        const ingrediente = await prisma.ingrediente.upsert({
            where: { id_ingrediente: 1 }, 
            update: {},
            create: {
                nombre: 'Ingrediente Prueba',
                stock: 100,
                stock_minimo: 10
            }
        });
        console.log(`   Ingrediente de prueba listo: ${ingrediente.nombre} (ID: ${ingrediente.id_ingrediente})`);


        // 2. Iniciar el servidor
        console.log(`2. Iniciando servidor backend en puerto ${PORT}...`);
        
        // Inject PORT into env
        const env = { ...process.env, PORT: PORT.toString() };
        
        server = spawn('npx', ['ts-node', 'src/index.ts'], {
            shell: true,
            env: env,
            cwd: join(__dirname, '..') // Run from parent dir
        });

        let serverReady = false;

        server.stdout?.on('data', (data) => {
            const output = data.toString();
            // console.log(`[SERVER-LOG]: ${output.trim()}`);
            if (output.includes('Backend corriendo')) {
                serverReady = true;
            }
        });
        
        server.stderr?.on('data', (data) => {
            console.error(`[SERVER-ERR]: ${data.toString()}`);
        });

        // Esperar hasta que esté listo (max 30s)
        let attempts = 0;
        while (!serverReady && attempts < 60) {
            await sleep(500);
            attempts++;
            if (attempts % 5 === 0) process.stdout.write('.');
        }
        console.log(''); // Newline

        if (!serverReady) {
            console.warn('   ADVERTENCIA: Timeout esperando al servidor. Ver logs arriba.');
        } else {
            console.log('   Servidor detectado en línea.');
        }

        // 3. Intentar Login
        console.log(`3. Probando Login en ${BASE_URL}/auth/login...`);
        
        let loginRes;
        try {
             loginRes = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: 'profesor_test',
                    contrasenya: TEST_PASS
                })
            });
        } catch (e: any) {
             throw new Error(`No se pudo conectar al servidor: ${e.message}`);
        }

        if (!loginRes.ok) {
            const text = await loginRes.text();
            throw new Error(`Login falló con status: ${loginRes.status} - ${text}`);
        }

        const loginData = await loginRes.json() as any;
        console.log('   Login exitoso!');
        
        const token = loginData.token;
        if (!token) throw new Error('No se recibió token en la respuesta de login');
        console.log('   Token recibido correctamente.');

        // 4. Intentar acceder a ruta protegida (Profile)
        console.log(`4. Probando ruta protegida ${BASE_URL}/auth/profile...`);
        const profileRes = await fetch(`${BASE_URL}/auth/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!profileRes.ok) {
            const text = await profileRes.text();
            throw new Error(`Acceso a profile falló con status: ${profileRes.status} - ${text}`);
        }

        const profileData = await profileRes.json() as any;
        console.log('   Acceso a perfil exitoso!');

        if (profileData.email === TEST_EMAIL) {
            console.log('   VERIFICACIÓN LOGIN: CORRECTA.');
        } else {
            console.error(`   ERROR: El email del perfil no coincide.`);
        }

        // 5. Crear un Pedido
        console.log(`5. Probando CREAR Pedido en ${BASE_URL}/pedidos...`);
        const pedidoRes = await fetch(`${BASE_URL}/pedidos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                ingredientes: [
                    { id_ingrediente: ingrediente.id_ingrediente, cantidad: 5 }
                ]
            })
        });

        if (!pedidoRes.ok) {
            const text = await pedidoRes.text();
            throw new Error(`Crear pedido falló: ${pedidoRes.status} - ${text}`);
        }
        const pedidoData = await pedidoRes.json() as any;
        console.log(`   Pedido creado ID: ${pedidoData.id_pedido}, Estado: ${pedidoData.estado}`);

        // 6. Listar Pedidos (Verificar que aparece)
        console.log(`6. Probando LISTAR Pedidos en ${BASE_URL}/pedidos...`);
        const listRes = await fetch(`${BASE_URL}/pedidos`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!listRes.ok) throw new Error(`Listar pedidos falló: ${listRes.status}`);
        const listData = await listRes.json() as any;
        
        const found = listData.find((p: any) => p.id_pedido === pedidoData.id_pedido);
        if (found) {
            console.log('   Pedido encontrado en el listado.');
        } else {
            throw new Error('   ERROR: El pedido creado no aparece en el listado.');
        }

        // 7. Validar Pedido
        console.log(`7. Probando VALIDAR Pedido ${pedidoData.id_pedido}...`);
        const valRes = await fetch(`${BASE_URL}/pedidos/${pedidoData.id_pedido}/validar`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!valRes.ok) throw new Error(`Validar pedido falló: ${valRes.status}`);
        const valData = await valRes.json() as any;
        
        if ((valData as any).estado === 'VALIDADO') {
            console.log('   Pedido validado correctamente.');
        } else {
            throw new Error(`   ERROR: El estado del pedido no cambió a VALIDADO. Estado actual: ${(valData as any).estado}`);
        }

        // 8. Borrar Pedido (Limpieza)
        console.log(`8. Probando ELIMINAR Pedido ${pedidoData.id_pedido}...`);
        const delRes = await fetch(`${BASE_URL}/pedidos/${pedidoData.id_pedido}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!delRes.ok) throw new Error(`Eliminar pedido falló: ${delRes.status}`);
        console.log('   Pedido eliminado correctamente.');

        console.log('\n--- VERIFICACIÓN COMPLETA EXITOSA ---');

    } catch (error: any) {
        console.error('\n ERROR CRÍTICO EN LA VERIFICACIÓN:', error.message);
        const fs = require('fs');
        fs.writeFileSync('verification_error.log', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        process.exit(1);
    } finally {
        await cleanup();
        if (process.exitCode === undefined) {
             process.exit(0);
        }
    }
}

main();
