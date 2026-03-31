import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getProveedores = async (req: Request, res: Response): Promise<void> => {
  try {
    const proveedores = await prisma.proveedor.findMany();
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los proveedores' });
  }
};

export const createProveedor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      res.status(400).json({ error: 'El nombre es obligatorio' });
      return;
    }
    const nuevoProveedor = await prisma.proveedor.create({
      data: { nombre }
    });
    res.status(201).json(nuevoProveedor);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el proveedor' });
  }
};

export const updateProveedor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    const proveedorActualizado = await prisma.proveedor.update({
      where: { id_proveedor: Number(id) },
      data: { nombre }
    });
    res.json(proveedorActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el proveedor' });
  }
};

export const deleteProveedor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.proveedor.delete({
      where: { id_proveedor: Number(id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el proveedor o está en uso' });
  }
};
