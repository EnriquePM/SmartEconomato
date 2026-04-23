import { Router } from 'express';
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../controllers/categoria.controllers';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getCategorias);
router.post('/', authenticateToken, requireRole(['Profesor', 'Administrador']), createCategoria);
router.put('/:id', authenticateToken, requireRole(['Profesor', 'Administrador']), updateCategoria);
router.delete('/:id', authenticateToken, requireRole(['Profesor', 'Administrador']), deleteCategoria);

export default router;
