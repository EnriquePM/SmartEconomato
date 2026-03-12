import { Router } from 'express';
import { registerAlumno, login, changePassword, registerProfesor } from '../controllers/auth.controller';
import { registerJefeEconomatoSchema } from '../schemas/auth.schema';

const router = Router();

// Rutas: http://localhost:3000/api/auth/...
router.post('/register/alumno', registerAlumno);
router.post('/login', login);
router.post('/change-password', changePassword)
router.post('/register/profesor', registerProfesor);
router.post('/register/jefe_economato', registerJefeEconomatoSchema, registerProfesor);
export default router;