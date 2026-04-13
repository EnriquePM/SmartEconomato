import { Router } from 'express';
import { getMovimientos, createMovimiento } from '../controllers/movimiento.controllers';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getMovimientos);
router.post('/', authenticateToken, requireRole(['Profesor', 'Administrador']), createMovimiento);

export default router;
