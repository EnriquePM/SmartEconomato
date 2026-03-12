import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getMovimientos = async (req: Request, res: Response): Promise<void> => {
  try {
    const movimientos = await prisma.movimiento.findMany({
      include: {
        ingrediente: true,
        usuario: {
          select: {
            nombre: true,
            apellido1: true
          }
        }
      },
      orderBy: { fecha: 'desc' } // Más recientes primero
    });
    res.json(movimientos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los movimientos' });
  }
};

export const createMovimiento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_ingrediente, id_usuario, tipo_movimiento, cantidad, observaciones } = req.body;
    
    if (!id_ingrediente || !id_usuario || !tipo_movimiento || cantidad === undefined) {
      res.status(400).json({ error: 'Faltan campos obligatorios' });
      return;
    }

    if (cantidad < 0 && tipo_movimiento !== 'AJUSTE') {
      res.status(400).json({ error: 'La cantidad debe ser mayor o igual a 0' });
      return;
    }

    // Iniciar transacción porque estamos creando un movimiento y alterando stock real
    const result = await prisma.$transaction(async (tx) => {
      // 1. Obtener ingrediente para su stock actual
      const ingrediente = await tx.ingrediente.findUnique({
        where: { id_ingrediente }
      });

      if (!ingrediente) {
        throw new Error('Ingrediente no encontrado');
      }

      let nuevoStock = Number(ingrediente.stock || 0);
      const cant = Number(cantidad);

      // 2. Calcular nuevo stock
      if (tipo_movimiento === 'ENTRADA') {
        nuevoStock += cant;
      } else if (tipo_movimiento === 'SALIDA' || tipo_movimiento === 'MERMA') {
        nuevoStock -= cant;
      } else if (tipo_movimiento === 'AJUSTE') {
        // En un AJUSTE, la cantidad mandada es el total exacto que debe quedar
        nuevoStock = cant;
      }

      if (nuevoStock < 0) {
        throw new Error(`Stock insuficiente. El stock actual es ${ingrediente.stock}`);
      }

      // 3. Registrar el movimiento
      const nuevoMovimiento = await tx.movimiento.create({
        data: {
          id_ingrediente,
          id_usuario,
          tipo_movimiento,
          cantidad: cant,
          observaciones
        }
      });

      // 4. Actualizar el stock
      await tx.ingrediente.update({
        where: { id_ingrediente },
        data: { stock: nuevoStock }
      });

      return nuevoMovimiento;
    });

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Error al procesar el movimiento' });
  }
};
