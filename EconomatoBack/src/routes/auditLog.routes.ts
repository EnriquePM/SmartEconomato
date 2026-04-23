import { Router } from 'express';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { getAuditLogs } from '../controllers/auditLog.controller';

const router = Router();

router.get(
    '/',
    authenticateToken,
    requireRole(['Administrador', 'Profesor']),
    getAuditLogs
);

export default router;
