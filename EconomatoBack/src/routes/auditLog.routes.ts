import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditLog.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateToken, requireRole(['Administrador', 'Profesor']), getAuditLogs);

export default router;
