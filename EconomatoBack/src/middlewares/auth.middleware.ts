import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

// Extender la interfaz Request para incluir los datos del usuario
interface AuthRequest extends Request {
    user?: any;
}
// Exportamos la funcion authenticateToken que recibe un request, response y next
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

    if (!token) {
        res.status(401).json({ error: 'Acceso denegado: Token no proporcionado' });
        return;
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Token inválido o expirado' });
        return;
    }
};
// Exportamos la funcion requireRole que recibe un array de roles permitidos
export const requireRole = (allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        const userRole = req.user?.role; // Asumimos que el token tiene el campo "role"

        if (!userRole || !allowedRoles.includes(userRole)) {
            res.status(403).json({ error: 'Acceso prohibido: No tienes permisos suficientes' });
            return;
        }

        next();
    };
};
