import { Router } from 'express';
import { getIngredientes, createIngrediente, updateIngrediente } from '../controllers/ingredient.controller';

const router = Router();

router.get('/', getIngredientes);
router.post('/', createIngrediente);
router.put('/:id', updateIngrediente);

export default router;