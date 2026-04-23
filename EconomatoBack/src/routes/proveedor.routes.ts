import { Router } from 'express';
import { getProveedores, createProveedor, updateProveedor, deleteProveedor } from '../controllers/proveedor.controllers';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getProveedores);
router.post('/', authenticateToken, requireRole(['Profesor', 'Administrador']), createProveedor);
router.put('/:id', authenticateToken, requireRole(['Profesor', 'Administrador']), updateProveedor);
router.delete('/:id', authenticateToken, requireRole(['Profesor', 'Administrador']), deleteProveedor);

export default router;
