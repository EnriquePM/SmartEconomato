import { Router } from 'express';
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../controllers/categoria.controllers';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getCategorias);
router.post('/', authenticateToken, requireRole(['Profesor', 'Jefe_Economato']), createCategoria);
router.put('/:id', authenticateToken, requireRole(['Profesor', 'Jefe_Economato']), updateCategoria);
router.delete('/:id', authenticateToken, requireRole(['Profesor', 'Jefe_Economato']), deleteCategoria);

export default router;
