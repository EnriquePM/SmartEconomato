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

// CAMBIAR ROL DE UN USUARIO (Para ascender a Jefe, por ejemplo)
export const updateUserRole = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { id_rol } = req.body;

    try {
        if (!id_rol) {
            res.status(400).json({ error: 'El id_rol es obligatorio' });
            return;
        }

        const usuarioEditado = await prisma.usuario.update({
            where: { id_usuario: Number(id) },
            data: { id_rol: Number(id_rol) },
            include: { rol: true } // Para devolver el nombre del nuevo rol
        });

        res.json({
            mensaje: `Rol actualizado correctamente a ${usuarioEditado.rol.nombre}`,
            usuario: usuarioEditado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error actualizando el rol del usuario' });
    }
};

// ELIMINAR USUARIO (Y sus dependencias en cascada gracias al Schema)
export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const userId = Number(id);

        // Primero verificamos que exista, para dar un mensaje útil
        const existe = await prisma.usuario.findUnique({
            where: { id_usuario: userId }
        });

        if (!existe) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }

        // Eliminamos el usuario. Las tablas relacionadas (profesorado, alumnado, jefe_economato) tienen onDelete: Cascade, así que se limpiarán solas (igual que pedido, movimiento si se configura, pero hay que tener cuidado. En el schema actual: pedidos (No Action), movimientos (No Action), escandallos... Si el usuario tiene operaciones, fallará por clave foránea si no están en Cascade).
        // NOTA: Para no romper el historial de inventario, lo correcto sería un borrado lógico o reasignar las operaciones, pero si es un usuario que no tiene movimientos, se borrará.
        await prisma.usuario.delete({
            where: { id_usuario: userId }
        });

        res.json({ mensaje: `Usuario ${existe.username} eliminado correctamente` });
    } catch (error: any) {
        console.error(error);

        // Manejo específico del error de base de datos cuando hay restricciones de clave foránea (P2003 en Prisma)
        if (error.code === 'P2003') {
            res.status(400).json({ error: 'No se puede eliminar el usuario porque tiene pedidos, movimientos o escandallos asociados. Considere desactivarlo en lugar de borrarlo.' });
            return;
        }

        res.status(500).json({ error: 'Error eliminando el usuario' });
    }
};