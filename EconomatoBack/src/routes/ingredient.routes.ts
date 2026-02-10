import { Router } from 'express';
import { getIngredientes, createIngrediente, updateIngrediente, deleteIngrediente } from '../controllers/ingredient.controller';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getIngredientes);
router.post('/', createIngrediente);
router.put('/:id', updateIngrediente);
router.delete('/:id', authenticateToken, requireRole(['PROFESORADO', 'JEFE_ECONOMATO', 'ADMIN']), deleteIngrediente);

export default router;