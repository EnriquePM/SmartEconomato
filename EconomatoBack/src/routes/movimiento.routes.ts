import { Router } from 'express';
import { getMovimientos, createMovimiento } from '../controllers/movimiento.controllers';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getMovimientos);
router.post('/', authenticateToken, requireRole(['Profesor', 'Jefe_Economato']), createMovimiento);

export default router;
