import { Router } from 'express';
import { getUsers, resetPassword, updateUser, deleteUser, updateUserRole } from '../controllers/user.controller';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// Rutas protegidas (todas requieren token)
router.use(authenticateToken); // Opcional: aplicar a todas las de abajo de golpe

router.get('/', requireRole(['Jefe_Economato', 'Administrador', 'Profesor']), getUsers);             // Ver todos (Admin / Profesor)
router.put('/:id', updateUser);                                            // Editar uno
router.put('/:id/reset-password', requireRole(['Jefe_Economato', 'Administrador', 'Profesor']), resetPassword); // Solo Jefe puede resetear contraseña
router.put('/:id/role', requireRole(['Jefe_Economato', 'Administrador', 'Profesor']), updateUserRole);          // Editar rol (Solo Jefe)
router.delete('/:id', requireRole(['Jefe_Economato', 'Administrador']), deleteUser);                // Eliminar usuario (Solo Jefe)

export default router;