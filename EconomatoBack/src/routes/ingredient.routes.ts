import { Router } from 'express';
import { getIngredientes, createIngrediente, updateIngrediente, deleteIngrediente } from '../controllers/ingredient.controller';
import { schemaValidator } from '../middlewares/validator.middleware';
import { createIngredientSchema, updateIngredientSchema, deleteIngredientSchema } from '../schemas/ingredient.schema';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Rutas: http://localhost:3000/api/ingredientes/...
router.get('/', getIngredientes);
router.post('/', authenticateToken, schemaValidator(createIngredientSchema), createIngrediente);
router.put('/:id', authenticateToken, schemaValidator(updateIngredientSchema), updateIngrediente);
router.delete('/:id', authenticateToken, schemaValidator(deleteIngredientSchema), deleteIngrediente);

export default router;