import { useEffect, useState, useMemo } from "react";
import type { RegisterUserPayload, Usuario } from "../models/user.model";
import { createAlumno, createProfesor, getUsuariosAdmin } from "../services/user-admin.service";

export type RolAlta = "alumno" | "profe";

export const useAdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("todos");
  const [nombre, setNombre] = useState("");
  const [apellido1, setApellido1] = useState("");
  const [apellido2, setApellido2] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState<RolAlta>("alumno");
  const [curso, setCurso] = useState("");
  const [alerta, setAlerta] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'confirm';
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    type: 'confirm',
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const cerrarAlerta = () => setAlerta((prev) => ({ ...prev, isOpen: false }));

  const cargarUsuarios = async () => {
    try {
      const data = await getUsuariosAdmin();
      setUsuarios(data);
    } catch (error) {
      setUsuarios([]);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter(u => {
      const nombreCompleto = `${u.nombre} ${u.apellido1} ${u.apellido2 || ''} ${u.username}`.toLowerCase();
      const coincideBusqueda = nombreCompleto.includes(busqueda.toLowerCase());
      const coincideRol = filtroRol === "todos" || u.rol.toLowerCase() === filtroRol.toLowerCase();
      
      return coincideBusqueda && coincideRol;
    });
  }, [usuarios, busqueda, filtroRol]);

  const limpiarFormulario = () => {
    setNombre(""); setApellido1(""); setApellido2("");
    setEmail(""); setCurso("");
  };

  const buildPayload = (): RegisterUserPayload => ({
    nombre,
    apellido1,
    apellido2: apellido2 || undefined,
    email: email || undefined,
    curso: rol === "alumno" ? curso || "1º Curso" : undefined,
    asignaturas: rol === "profe" ? "General" : undefined,
  });

  const ejecutarRegistro = async () => {
    cerrarAlerta();
    setLoading(true);
    try {
      const payload = buildPayload();
      const usuarioCreado = rol === "alumno"
        ? await createAlumno(payload)
        : await createProfesor(payload);

      setAlerta({
        isOpen: true,
        type: 'success',
        title: 'Usuario Creado',
        message: `Usuario: ${usuarioCreado.username}\nContraseña temporal: Economato123`,
        onConfirm: cerrarAlerta
      });

      await cargarUsuarios();
      limpiarFormulario();
    } catch (error) {
      setAlerta({
        isOpen: true,
        type: 'error',
        title: 'Error de Registro',
        message: error instanceof Error ? error.message : "Error de conexión con el servidor",
        onConfirm: cerrarAlerta
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !apellido1 || !rol) {
      setAlerta({
        isOpen: true,
        type: 'error',
        title: 'Faltan Datos',
        message: 'Debes rellenar el nombre, el primer apellido y seleccionar un rol.',
        onConfirm: cerrarAlerta
      });
      return;
    }
    setAlerta({
      isOpen: true,
      type: 'confirm',
      title: 'Confirmar Registro',
      message: `¿Estás seguro de que quieres dar de alta a ${nombre} ${apellido1} como ${rol}?`,
      onConfirm: ejecutarRegistro
    });
  };

  return {
    usuarios: usuariosFiltrados, 
    totalUsuarios: usuarios.length,
    loading,
    filtros: {
      busqueda, setBusqueda,
      filtroRol, setFiltroRol
    },
    form: {
      nombre, setNombre,
      apellido1, setApellido1,
      apellido2, setApellido2,
      email, setEmail,
      rol, setRol,
      curso, setCurso,
    },
    handleSubmit,
    alerta: { ...alerta, cerrar: cerrarAlerta }
  };
};