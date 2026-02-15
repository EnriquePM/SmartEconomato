// src/hooks/useUsuarios.ts
import { useState, useEffect } from "react";
import { getUsuariosService, registrarUsuarioService } from "../services/usuarioService";
import type { Usuario } from "../models/Usuario";

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [apellido1, setApellido1] = useState("");
  const [apellido2, setApellido2] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState<"alumno" | "profe">("alumno"); // "profe" para coincidir con el value del select
  const [curso, setCurso] = useState("");

  // Carga inicial al montar el componente
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const data = await getUsuariosService();
      setUsuarios(data);
    } catch (error) {
      console.error(error);
    }
  };

  const crearUsuario = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !apellido1) {
      alert("El nombre y el primer apellido son obligatorios.");
      return;
    }

    setLoading(true);

    try {
      // Preparamos el payload limpio
      const datosParaEnviar = {
        nombre,
        apellido1,
        apellido2: apellido2 || undefined,
        email: email || undefined,
        // Solo enviamos curso si es alumno (la lógica de profe se puede añadir aquí si hiciera falta)
        curso: rol === "alumno" ? (curso || "1º Curso") : undefined,
        asignaturas: rol === "profe" ? "General" : undefined
      };

      // Traducimos 'profe' a 'profesor' para que el servicio sepa qué URL usar
      const tipoRol = rol === "profe" ? "profesor" : "alumno";

      const respuesta = await registrarUsuarioService(tipoRol, datosParaEnviar);

      // Feedback de éxito
      alert(`¡Usuario creado con éxito!\n\n👤 Usuario: ${respuesta.username}\n🔑 Contraseña temporal: Economato123`);
      
      // Limpiamos formulario
      setNombre(""); setApellido1(""); setApellido2(""); setEmail(""); setCurso("");
      
      // Recargamos la tabla para ver al nuevo usuario
      cargarUsuarios();

    } catch (error: any) {
      alert(error.message || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return {
    usuarios,
    loading,
    form: { 
        nombre, setNombre, 
        apellido1, setApellido1, 
        apellido2, setApellido2, 
        email, setEmail, 
        rol, setRol, 
        curso, setCurso 
    },
    crearUsuario
  };
};