import { Router } from 'express';
import { createPedido, getPedidosPendientes, validarPedido, deletePedido } from '../controllers/pedido.controller';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// Cualquiera autenticado puede pedir
router.post('/', authenticateToken, createPedido);

// Solo profes/admin pueden gestionar
router.get('/', authenticateToken, requireRole(['PROFESORADO', 'JEFE_ECONOMATO', 'ADMIN']), getPedidosPendientes);
router.put('/:id/validar', authenticateToken, requireRole(['PROFESORADO', 'JEFE_ECONOMATO', 'ADMIN']), validarPedido);
router.delete('/:id', authenticateToken, requireRole(['PROFESORADO', 'JEFE_ECONOMATO', 'ADMIN']), deletePedido);

export default router;
