import { Router } from 'express';
import { getMateriales, createMaterial, updateMaterial, deleteMaterial } from '../controllers/material.controller';
//import { authenticateToken, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// 1. Obtener todos (Cualquier usuario autenticado)
router.get('/', getMateriales);

// 2. Crear (Solo Profesores/Admin)
router.post('/', createMaterial);

// 3. Modificar (Solo Profesores/Admin)
router.put('/:id', updateMaterial);

// 4. Eliminar (Solo Profesores/Admin)
router.delete('/:id', deleteMaterial);

export default router;
