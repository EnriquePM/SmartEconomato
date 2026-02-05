import { Request, Response } from 'express';
import { prisma } from '../prisma';

// CREAR USUARIO (Ejemplo para un ALUMNO)
export const createAlumno = async (req: Request, res: Response) => {
    const { nombre, apellido1, apellido2, email, contrasenya, curso } = req.body;

    try {
        // $transaction asegura que todas las operaciones se hagan o ninguna
        const resultado = await prisma.$transaction(async (tx) => {

            // 1. Crear el ROL genérico
            const nuevoRol = await tx.rol.create({
                data: {
                    nombre: 'Alumno',
                    tipo: 'ALUMNADO'
                }
            });

            // 2. Crear el detalle en la tabla ALUMNADO
            await tx.alumnado.create({
                data: {
                    id_rol: nuevoRol.id_rol,
                    curso: curso
                }
            });

            // 3. Crear el USUARIO vinculado al ROL
            const nuevoUsuario = await tx.usuario.create({
                data: {
                    nombre,
                    apellido1,
                    apellido2,
                    email,
                    contrasenya, // Nota: En un proyecto real, encripta esto con bcrypt
                    id_rol: nuevoRol.id_rol
                }
            });

            return nuevoUsuario;
        });

        res.json(resultado);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creando usuario alumno' });
    }
};

// MODIFICAR USUARIO
export const updateUsuario = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nombre, apellido1, email } = req.body;

    try {
        const usuarioEditado = await prisma.usuario.update({
            where: { id_usuario: Number(id) },
            data: { nombre, apellido1, email }
        });
        res.json(usuarioEditado);
    } catch (error) {
        res.status(500).json({ error: 'No se pudo editar' });
    }
}