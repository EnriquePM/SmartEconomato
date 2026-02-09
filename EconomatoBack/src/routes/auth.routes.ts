import { Router } from 'express';
import { registerAlumno, login, changePassword } from '../controllers/auth.controller';

const router = Router();

// Rutas: http://localhost:3000/api/auth/...
router.post('/register/alumno', registerAlumno);
router.post('/login', login);
router.post('/change-password', changePassword)

export default router;