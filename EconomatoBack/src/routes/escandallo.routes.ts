import { Router } from 'express';
import { getEscandallos, createEscandallo, getEscandalloById, deleteEscandallo } from '../controllers/escandallo.controllers';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas de escandallos requieren autenticación
// Asumimos acceso general (como recetas) salvo que se indique lo contrario
router.use(authenticateToken);

router.get('/', getEscandallos);
router.post('/', createEscandallo);
router.get('/:id', getEscandalloById);
router.delete('/:id', deleteEscandallo);

export default router;
