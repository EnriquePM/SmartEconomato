import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { generateToken } from '../utils/jwt';
// import bcrypt from 'bcryptjs'; // Descomentar cuando usemos encriptación

export const login = async (req: Request, res: Response) => {
    const { email, contrasenya } = req.body;

    try {
        // 1. Buscar usuario
        const usuario = await prisma.usuario.findUnique({
            where: { email },
            include: { rol: true } // Traer el rol para saber si es PROFE o ADMIN
        });

        if (!usuario) {
            res.status(401).json({ error: 'Credenciales inválidas (Usuario no encontrado)' });
            return;
        }

        // 2. Comprobar contraseña (TEXTO PLANO POR AHORA, como se pidió)
        if (usuario.contrasenya !== contrasenya) {
            res.status(401).json({ error: 'Credenciales inválidas (Contraseña incorrecta)' });
            return;
        }

        // 3. Generar Token
        const token = generateToken({
            id_usuario: usuario.id_usuario,
            role: usuario.rol.tipo // Usamos el campo 'tipo' del Rol (ej: 'ALUMNADO', 'PROFESORADO', 'JEFE_ECONOMATO')
        });

        res.json({ token, usuario: { nombre: usuario.nombre, rol: usuario.rol.tipo } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor al intentar iniciar sesión' });
    }
};

export const profile = async (req: any, res: Response) => {
    try {
        console.log('--- ENTRANDO EN PROFILE ---');
        const id_usuario = req.user.id_usuario;
        const usuario = await prisma.usuario.findUnique({
            where: { id_usuario },
            include: { rol: true }
        });

        if (!usuario) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }

        // Devolver datos seguros (sin contraseña)
        const { contrasenya, ...datosUsuario } = usuario;
        res.json(datosUsuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener perfil' });
    }
};
