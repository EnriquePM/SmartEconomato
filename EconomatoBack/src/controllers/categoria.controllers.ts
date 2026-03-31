import { Request, Response } from "express";
import { prisma } from "../prisma";

export const getCategorias = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const categorias = await prisma.categoria.findMany();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las categorías" });
  }
};

export const createCategoria = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      res.status(400).json({ error: "El nombre es obligatorio" });
      return;
    }
    const nuevaCategoria = await prisma.categoria.create({
      data: { nombre },
    });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la categoría" });
  }
};

export const updateCategoria = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    const categoriaActualizada = await prisma.categoria.update({
      where: { id_categoria: Number(id) },
      data: { nombre },
    });
    res.json(categoriaActualizada);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la categoría" });
  }
};

export const deleteCategoria = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.categoria.delete({
      where: { id_categoria: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar la categoría o está en uso" });
  }
};
