import { useState } from "react";
import defaultAvatar from '../assets/Avatares/chef.png';

export const usePerfil = () => {
  const [avatarSeleccionado, setAvatarSeleccionado] = useState(() => {
    return localStorage.getItem("avatarUsuario") || defaultAvatar;
  });

  const [usuario] = useState(() => {
    const dataUser = localStorage.getItem('usuario'); 
    
    if (dataUser) {
      try {
        const parsed = JSON.parse(dataUser);
        return {
          nombre: parsed.nombre || "",
          apellido1: parsed.apellido1 || "",
          apellido2: parsed.apellido2 || "",
          username: parsed.username || "Usuario",
          email: parsed.email || "Sin email",
          rol: parsed.rol || "Alumno",
          nombreCompleto: `${parsed.nombre || ''} ${parsed.apellido1 || ''} ${parsed.apellido2 || ''}`.trim()
        };
      } catch (e) {
        console.error("Error parseando usuario del localStorage", e);
      }
    }

    return {
      nombre: "Invitado",
      username: "invitado",
      email: "",
      rol: "Alumno",
      nombreCompleto: "Invitado"
    };
  });

  const [guardado, setGuardado] = useState(false);

  const guardarAvatar = () => {
    localStorage.setItem("avatarUsuario", avatarSeleccionado);
    window.dispatchEvent(new Event("avatar-actualizado"));
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return {
    usuario,
    avatarSeleccionado,
    setAvatarSeleccionado,
    guardado,
    guardarAvatar,
    handleLogout
  };
};