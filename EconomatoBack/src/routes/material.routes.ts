import { Router } from 'express';
import { getMateriales, createMaterial, updateMaterial, deleteMaterial } from '../controllers/material.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// 1. Obtener todos (Cualquier usuario autenticado)
router.get('/', authenticateToken, getMateriales);

// 2. Crear (Cualquier usuario autenticado)
router.post('/', authenticateToken, createMaterial);

// 3. Modificar (Cualquier usuario autenticado)
router.put('/:id', authenticateToken, updateMaterial);

// 4. Eliminar (Cualquier usuario autenticado)
router.delete('/:id', authenticateToken, deleteMaterial);

export default router;
