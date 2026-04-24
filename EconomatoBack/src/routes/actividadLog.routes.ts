import { Router } from 'express';
import { getActividades } from '../controllers/actividadLog.controller';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateToken);
router.get('/', requireRole(['Administrador', 'Profesor']), getActividades);

export default router;
