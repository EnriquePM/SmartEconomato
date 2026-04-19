// src/routes/recursos.routes.ts
import { Router } from 'express';
import { getCategorias, getProveedores } from '../controllers/recursos.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Protegemos las rutas GET
router.use(authenticateToken);

router.get('/categorias', getCategorias);
router.get('/proveedores', getProveedores);

export default router;