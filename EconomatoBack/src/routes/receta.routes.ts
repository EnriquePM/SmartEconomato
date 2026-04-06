import { Router } from 'express';
import { getRecetas, createReceta, deleteReceta, getRecetaById, makeReceta, updateReceta } from '../controllers/receta.controllers';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas de recetas requieren estar logeado.
// Según las indicaciones, los alumnos también pueden acceder a ellas (GET, POST, DELETE).
router.use(authenticateToken);

router.get('/', getRecetas);
router.post('/', createReceta);
router.get('/:id', getRecetaById);
router.put('/:id', updateReceta);
router.delete('/:id', deleteReceta);
router.post('/:id/hacer', requireRole(['Profesor', 'Jefe_Economato', 'Jefe Economato', 'Administrador']), makeReceta);

export default router;
