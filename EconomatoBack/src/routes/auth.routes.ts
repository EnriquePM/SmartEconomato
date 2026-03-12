import { Router } from 'express';
import { registerAlumno, login, changePassword, registerProfesor, registerJefeEconomato } from '../controllers/auth.controller';
import { schemaValidator } from '../middlewares/validator.middleware';
import { registerAlumnoSchema, registerProfesorSchema, registerJefeEconomatoSchema, loginSchema, changePasswordSchema } from '../schemas/auth.schema';

const router = Router();

// Rutas: http://localhost:3000/api/auth/...
router.post('/register/alumno', schemaValidator(registerAlumnoSchema), registerAlumno);
router.post('/login', schemaValidator(loginSchema), login);
router.post('/change-password', schemaValidator(changePasswordSchema), changePassword)
router.post('/register/profesor', schemaValidator(registerProfesorSchema), registerProfesor);
router.post('/register/jefe_economato', schemaValidator(registerJefeEconomatoSchema), registerJefeEconomato);
export default router;