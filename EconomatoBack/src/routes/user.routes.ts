import { Router } from 'express';
import { getUsers, updateUser } from '../controllers/user.controller';

const router = Router();

// Rutas: http://localhost:3000/api/usuarios/...
router.get('/', getUsers);       // Ver todos
router.put('/:id', updateUser);  // Editar uno

export default router;