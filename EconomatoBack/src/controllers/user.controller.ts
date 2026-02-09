import { Request, Response } from 'express';
import { prisma } from '../prisma';

// OBTENER TODOS LOS USUARIOS (Para el panel de admin)
export const getUsers = async (req: Request, res: Response) => {
    try {
        const usuarios = await prisma.usuario.findMany({
            select: {
                id_usuario: true,
                nombre: true,
                apellido1: true,
                email: true,
                rol: true
            }
        });
        res.json(usuarios);
    } catch (error) {
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