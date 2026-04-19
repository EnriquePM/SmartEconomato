import { Router } from 'express';
import { getUsers, resetPassword, updateUser, deleteUser, updateUserRole } from '../controllers/user.controller';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// Rutas protegidas (todas requieren token)
router.use(authenticateToken);

// Gestión de usuarios: Administrador y Profesor pueden gestionar todo.
router.get('/', requireRole(['Administrador', 'Profesor']), getUsers);
router.put('/:id', requireRole(['Administrador', 'Profesor']), updateUser);
router.put('/:id/reset-password', requireRole(['Administrador', 'Profesor']), resetPassword);
router.put('/:id/role', requireRole(['Administrador', 'Profesor']), updateUserRole);
router.delete('/:id', requireRole(['Administrador', 'Profesor']), deleteUser);

export default router;