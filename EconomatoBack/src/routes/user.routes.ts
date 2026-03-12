import { Router } from 'express';
import { getUsers, resetPassword, updateUser } from '../controllers/user.controller';

const router = Router();

// Rutas: http://localhost:3000/api/usuarios/...
router.get('/', getUsers);       // Ver todos
router.put('/:id', updateUser);  // Editar uno
router.put('/:id/reset-password', resetPassword);

export default router;