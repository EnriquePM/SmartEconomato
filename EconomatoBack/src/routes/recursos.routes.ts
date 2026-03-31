// src/routes/recursos.routes.ts
import { Router } from 'express';
import { getCategorias, getProveedores } from '../controllers/recursos.controller';

const router = Router();

// Definimos las rutas GET
router.get('/categorias', getCategorias);
router.get('/proveedores', getProveedores);

export default router;