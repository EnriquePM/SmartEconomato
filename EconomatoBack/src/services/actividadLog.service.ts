import { prisma } from '../prisma';

export const logActividad = async (
  id_usuario: number | null,
  accion: string,
  entidad: string,
  id_entidad?: number | null,
  descripcion?: string | null,
  ruta?: string | null
): Promise<void> => {
  try {
    let nombre_usuario = 'Sistema';

    if (id_usuario) {
      const usuario = await prisma.usuario.findUnique({
        where: { id_usuario },
        select: { nombre: true, apellido1: true, apellido2: true }
      });

      if (usuario) {
        nombre_usuario = [usuario.nombre, usuario.apellido1, usuario.apellido2]
          .filter(Boolean)
          .join(' ');
      }
    }

    await prisma.registro_actividad.create({
      data: {
        id_usuario: id_usuario ?? null,
        nombre_usuario,
        accion,
        entidad,
        id_entidad: id_entidad ?? null,
        descripcion: descripcion ?? null,
        ruta: ruta ?? null
      }
    });
  } catch (err) {
    console.error('Error logging actividad:', err);
  }
};
