import { Router } from 'express';
import { getIngredientes, createIngrediente, updateIngrediente, deleteIngrediente } from '../controllers/ingredient.controller';
import { schemaValidator } from '../middlewares/validator.middleware';
import { createIngredientSchema, updateIngredientSchema, deleteIngredientSchema } from '../schemas/ingredient.schema';

const router = Router();

// Rutas: http://localhost:3000/api/ingredientes/...
router.get('/', getIngredientes);
router.post('/', schemaValidator(createIngredientSchema), createIngrediente);
router.put('/:id', schemaValidator(updateIngredientSchema), updateIngrediente);
router.delete('/:id', schemaValidator(deleteIngredientSchema), deleteIngrediente);

export default router;