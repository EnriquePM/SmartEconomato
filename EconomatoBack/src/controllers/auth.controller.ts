import { Request, Response } from 'express';
import { prisma } from '../prisma';
import bcrypt from 'bcryptjs';

// --- CONFIGURACIÓN ---
const PASSWORD_POR_DEFECTO = "Economato123"; // Contraseña incial para nuevos alumnos (obligatorio cambiar en el primer login)

// ==========================================
// 1. FUNCIONES AUXILIARES (Lógica interna)
// ==========================================
const limpiarTexto = (texto: string) => {
    if (!texto) return "";
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");
};

// Genera un usuario único, basado en el nombre y apellidos, y verifica que no exista en la base de datos. Si existe, añade números al final.
const generarUsernameDisponible = async (nombre: string, ape1: string, ape2: string | null) => {
    const n = limpiarTexto(nombre).substring(0, 1);
    const a1 = limpiarTexto(ape1).substring(0, 3);
    const a2 = ape2 ? limpiarTexto(ape2).substring(0, 3) : '';

    let baseUsername = `${n}${a1}${a2}`;
    if (baseUsername.length < 3) baseUsername = "usuario";

    let candidato = baseUsername;
    let contador = 1;

    // Bucle hasta encontrar uno libre
    while (true) {
        const existe = await prisma.usuario.findUnique({
            where: { username: candidato }
        });
        if (!existe) return candidato;

        candidato = `${baseUsername}${contador}`;
        contador++;
    }
};

// ==========================================
// 2. CONTROLADORES (Rutas)
// ==========================================

// REGISTRO ALUMNO
export const registerAlumno = async (req: Request, res: Response) => {
    const { nombre, apellido1, apellido2, email, curso } = req.body;
    try {
        // 1. Limpieza de Email (Vacío -> Null)
        const emailAProcesar = (email && email.trim() !== "") ? email : null;

        // 2. Comprobación de Email duplicado (solo si existe)
        if (emailAProcesar) {
            const existeEmail = await prisma.usuario.findUnique({ where: { email: emailAProcesar } });
            if (existeEmail) {
                res.status(400).json({ error: 'El email ya está registrado' });
                return;
            }
        }

        // 3. Generamos Username y Hasheamos la Password por defecto
        const usernameGenerado = await generarUsernameDisponible(nombre, apellido1, apellido2);
        const hashedPassword = await bcrypt.hash(PASSWORD_POR_DEFECTO, 10);

        // 4. Guardamos todo en la Base de Datos
        const resultado = await prisma.$transaction(async (tx) => {
            // Crear Rol
            const nuevoRol = await tx.rol.create({
                data: { nombre: 'Alumno', tipo: 'ALUMNADO' }
            });

            // Crear Alumno
            await tx.alumnado.create({
                data: { id_rol: nuevoRol.id_rol, curso: curso || '1º Curso' }
            });

            // Crear Usuario
            const nuevoUsuario = await tx.usuario.create({
                data: {
                    username: usernameGenerado,
                    nombre,
                    apellido1,
                    apellido2,
                    email: emailAProcesar,
                    contrasenya: hashedPassword,
                    id_rol: nuevoRol.id_rol,
                    primer_login: true
                }
            });

            const { contrasenya: _, ...usuarioSinPass } = nuevoUsuario;
            return usuarioSinPass;
        });

        res.json(resultado);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error registrando alumno' });
    }
};

// --- B. LOGIN (Detecta si es la primera vez) ---
export const login = async (req: Request, res: Response) => {
    const { username, contrasenya } = req.body;

    try {
        const usuario = await prisma.usuario.findUnique({ where: { username } });

        if (!usuario) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }

        const passwordValida = await bcrypt.compare(contrasenya, usuario.contrasenya);

        if (!passwordValida) {
            res.status(401).json({ error: 'Contraseña incorrecta' });
            return;
        }

        // LOGIN DE PRIMERA VEZ
        if (usuario.primer_login) {
            res.json({
                mensaje: 'Debe cambiar su contraseña',
                requiereCambioPass: true,
                usuario: { username: usuario.username }
            });
            return;
        }

        // Login Normal
        res.json({
            mensaje: 'Login exitoso',
            requiereCambioPass: false,
            usuario: {
                id: usuario.id_usuario,
                username: usuario.username,
                nombre: usuario.nombre,
                rol: usuario.id_rol
            }
        });

    } catch (error) {
        res.status(500).json({ error: 'Error en el login' });
    }
};

// CAMBIAR CONTRASEÑA Primer Login
export const changePassword = async (req: Request, res: Response) => {
    const { username, oldPassword, newPassword } = req.body;

    try {
        const usuario = await prisma.usuario.findUnique({ where: { username } });
        if (!usuario) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }

        // Verificar la contraseña anterior (Economato123)
        const valida = await bcrypt.compare(oldPassword, usuario.contrasenya);
        if (!valida) {
            res.status(401).json({ error: 'La contraseña actual no es correcta' });
            return;
        }

        // Encriptar la nueva
        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar y quitar la "bandera" de cambio obligatorio
        await prisma.usuario.update({
            where: { id_usuario: usuario.id_usuario },
            data: {
                contrasenya: newHashedPassword,
                primer_login: false
            }
        });

        res.json({ mensaje: 'Contraseña actualizada correctamente' });

    } catch (error) {
        res.status(500).json({ error: 'Error cambiando contraseña' });
    }
};