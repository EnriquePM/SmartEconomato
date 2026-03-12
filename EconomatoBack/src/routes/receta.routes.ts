import { Router } from 'express';
import { getRecetas, createReceta, deleteReceta, getRecetaById } from '../controllers/receta.controllers';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas de recetas requieren estar logeado.
// Según las indicaciones, los alumnos también pueden acceder a ellas (GET, POST, DELETE).
router.use(authenticateToken);

router.get('/', getRecetas);
router.post('/', createReceta);
router.get('/:id', getRecetaById);
router.delete('/:id', deleteReceta);

export default router;
