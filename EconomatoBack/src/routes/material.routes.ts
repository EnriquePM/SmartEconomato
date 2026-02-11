import { Router } from 'express';
import { getMateriales, createMaterial, updateMaterial, deleteMaterial } from '../controllers/material.controller';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// 1. Obtener todos (Cualquier usuario autenticado)
router.get('/', authenticateToken, getMateriales);

// 2. Crear (Solo Profesores/Admin)
router.post('/', authenticateToken, requireRole(['PROFESORADO', 'JEFE_ECONOMATO', 'ADMIN']), createMaterial);

// 3. Modificar (Solo Profesores/Admin)
router.put('/:id', authenticateToken, requireRole(['PROFESORADO', 'JEFE_ECONOMATO', 'ADMIN']), updateMaterial);

// 4. Eliminar (Solo Profesores/Admin)
router.delete('/:id', authenticateToken, requireRole(['PROFESORADO', 'JEFE_ECONOMATO', 'ADMIN']), deleteMaterial);

export default router;
