import { Request, Response } from 'express';
import { prisma } from '../prisma';
import bcrypt from 'bcryptjs';

const PASSWORD_POR_DEFECTO = "Economato123";

// OBTENER TODOS LOS USUARIOS (Para el panel de admin)
export const getUsers = async (req: Request, res: Response) => {
    try {
        const usuarios = await prisma.usuario.findMany({
            orderBy: { id_usuario: 'desc' },
            select: {
                id_usuario: true,
                username: true,
                nombre: true,
                apellido1: true,
                apellido2: true,
                email: true,
                rol: true
            }
        });
        res.json(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error obteniendo usuarios' });
    }
};

// ACTUALIZAR DATOS BÁSICOS
export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nombre, apellido1, email } = req.body;

    try {
        const usuario = await prisma.usuario.update({
            where: { id_usuario: Number(id) },
            data: { nombre, apellido1, email }
        });

        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Error actualizando usuario' });
    }
};

// RESTABLECER LA CONTRASEÑA (Solo para admin)
export const resetPassword = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const hashedPassword = await bcrypt.hash(PASSWORD_POR_DEFECTO, 10);
        const usuario = await prisma.usuario.update({
            where: { id_usuario: Number(id) },
            data: {
                contrasenya: hashedPassword, // Volvemos a poner 'Economato123'
                primer_login: true
            }
        });
        res.json({
            mensaje: `Contraseña restablecida a '${PASSWORD_POR_DEFECTO}' para el usuario ${usuario.username}`
        });

    } catch (error) {
        res.status(500).json({ error: 'Error restableciendo la contraseña' });
    }
};