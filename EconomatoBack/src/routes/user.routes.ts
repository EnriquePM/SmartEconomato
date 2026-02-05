import { Router } from 'express';
import { createAlumno, updateUsuario } from '../controllers/user.controller';

const router = Router();

router.post('/alumno', createAlumno); // Crear alumno
router.put('/:id', updateUsuario);    // Modificar datos básicos

export default router;