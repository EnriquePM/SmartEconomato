import { Router } from 'express';
import { getAlergenos } from '../controllers/alergeno.controller';

const router = Router();

router.get('/', getAlergenos);

export default router;
