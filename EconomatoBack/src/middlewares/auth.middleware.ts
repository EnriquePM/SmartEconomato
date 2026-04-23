import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

const normalizeRole = (role: string) =>
    role
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[\s_-]+/g, '');

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
        const userRole = req.user?.role as string | undefined; // Asumimos que el token tiene el campo "role"
        const normalizedAllowed = allowedRoles.map(normalizeRole);
        const normalizedUserRole = userRole ? normalizeRole(userRole) : null;

        if (!normalizedUserRole || !normalizedAllowed.includes(normalizedUserRole)) {
            res.status(403).json({ error: 'Acceso prohibido: No tienes permisos suficientes' });
            return;
        }

        next();
    };
};
