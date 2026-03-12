import { z } from 'zod';

// Esquema común para no repetir campos en los registros
const baseRegisterSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido1: z.string().min(2, 'El primer apellido debe tener al menos 2 caracteres'),
  apellido2: z.string().optional().nullable(),
  email: z.string().email('Debe ser un email válido').optional().or(z.literal('')),
});

export const registerAlumnoSchema = z.object({
  body: baseRegisterSchema.extend({
    curso: z.string().min(1, 'El curso es obligatorio').optional(),
  })
});

export const registerProfesorSchema = z.object({
  body: baseRegisterSchema.extend({
    asignaturas: z.string().min(1, 'La(s) asignatura(s) son obligatorias').optional(),
  })
});

export const registerJefeEconomatoSchema = z.object({
  body: baseRegisterSchema.extend({
    permisos: z.string().min(1, 'Los permisos son obligatorios').optional(),
  })
});

export const loginSchema = z.object({
  body: z.object({
    username: z.string().min(1, 'El nombre de usuario es obligatorio'),
    contrasenya: z.string().min(1, 'La contraseña es obligatoria')
  })
});

export const changePasswordSchema = z.object({
  body: z.object({
    username: z.string().min(1, 'El usuario es obligatorio'),
    oldPassword: z.string().min(1, 'La contraseña antigua es obligatoria'),
    newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres')
  })
});
