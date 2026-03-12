import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodTypeAny } from 'zod';

export const schemaValidator = (schema: ZodTypeAny) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Error de validación de datos',
          detalles: error.issues.map(issue => ({
            campo: issue.path.join('.'),
            mensaje: issue.message
          }))
        });
      }
      return res.status(500).json({ error: 'Error interno de validación' });
    }
  };
