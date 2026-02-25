// src/services/mappers/usuarioMapper.ts
import type { Usuario } from "../../models/Usuario";

export const mapUsuarioToFrontend = (data: any): Usuario => {
  return {
    id_usuario: data.id_usuario,
    username: data.username,
    nombre: data.nombre,
    apellido1: data.apellido1,
    apellido2: data.apellido2 || "", // Evitamos null en la vista
    email: data.email || "Sin email",
    id_rol: data.id_rol,
    
    // Mapeo seguro del Rol (si viene null, ponemos 'Desconocido')
    rol: data.rol ? { nombre: data.rol.nombre } : { nombre: "Desconocido" },

    // Mapeo seguro de datos extra
    alumnado: data.alumnado ? { curso: data.alumnado.curso } : undefined,
    profesorado: data.profesorado ? { asignaturas: data.profesorado.asignaturas } : undefined
  };
};