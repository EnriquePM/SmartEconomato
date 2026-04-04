import { z } from 'zod';

export const createIngredientSchema = z.object({
  body: z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    imagen: z.string().url('Debe ser una URL válida').optional().nullable(),
    stock: z.number().min(0, 'El stock no puede ser negativo').or(z.string().transform((val) => Number(val))),
    stock_minimo: z.number().min(0, 'El stock mínimo no puede ser negativo').optional().or(z.string().transform((val) => Number(val)).optional()),
    tipo: z.string().optional().nullable(),
    id_categoria: z.number().int('Debe ser un número entero').positive('Categoría inválida').optional().nullable(),
    id_proveedor: z.number().int('Debe ser un número entero').positive('Proveedor inválido').optional().nullable(),
    alergenosIds: z.array(z.number()).optional(),
  })
});

export const updateIngredientSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'El ID del ingrediente debe ser numérico')
  }),
  body: z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
    imagen: z.string().url('Debe ser una URL válida').optional().nullable(),
    stock: z.number().min(0, 'El stock no puede ser negativo').optional().or(z.string().transform((val) => Number(val)).optional()),
    stock_minimo: z.number().min(0, 'El stock mínimo no puede ser negativo').optional().or(z.string().transform((val) => Number(val)).optional()),
    tipo: z.string().optional().nullable(),
    id_categoria: z.number().int('Debe ser un número entero').positive().optional().nullable(),
    id_proveedor: z.number().int('Debe ser un número entero').positive().optional().nullable(),
    alergenosIds: z.array(z.number()).optional(),
  })
});

export const deleteIngredientSchema = z.object({
  params: z.object({
     id: z.string().regex(/^\d+$/, 'El ID del ingrediente debe ser numérico')
  })
});
