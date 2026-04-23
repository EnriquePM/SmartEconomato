import { useEffect, useState } from "react";
import type { RegisterUserPayload, Usuario } from "../models/user.model";
import { createAlumno, createProfesor, getUsuariosAdmin } from "../services/user-admin.service";

export type RolAlta = "alumno" | "profe";

export const useAdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);

  const [nombre, setNombre] = useState("");
  const [apellido1, setApellido1] = useState("");
  const [apellido2, setApellido2] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState<RolAlta>("alumno");
  const [curso, setCurso] = useState("");

  const cargarUsuarios = async () => {
    try {
      const data = await getUsuariosAdmin();
      setUsuarios(data);
    } catch (error) {
      console.error("Error de conexion o de red:", error);
      setUsuarios([]);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const limpiarFormulario = () => {
    setNombre("");
    setApellido1("");
    setApellido2("");
    setEmail("");
    setCurso("");
  };

  const buildPayload = (): RegisterUserPayload => ({
    nombre,
    apellido1,
    apellido2: apellido2 || undefined,
    email: email || undefined,
    curso: rol === "alumno" ? curso || "1º Curso" : undefined,
    asignaturas: rol === "profe" ? "General" : undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !apellido1) {
      alert("El nombre y el primer apellido son obligatorios.");
      return;
    }

    setLoading(true);

    try {
      const payload = buildPayload();
      const usuarioCreado = rol === "alumno"
        ? await createAlumno(payload)
        : await createProfesor(payload);

      alert(`Usuario creado con exito.\n\nUsuario: ${usuarioCreado.username}\nContrasena temporal: Economato123`);
      await cargarUsuarios();
      limpiarFormulario();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error de conexion con el servidor";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    usuarios,
    loading,
    form: {
      nombre,
      setNombre,
      apellido1,
      setApellido1,
      apellido2,
      setApellido2,
      email,
      setEmail,
      rol,
      setRol,
      curso,
      setCurso,
    },
    handleSubmit,
  };
};
