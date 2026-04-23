import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login } from "../services/auth-service";

export const useLogin = () => {
  const navigate = useNavigate();
  const { setUsuario } = useAuth();

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!user || !password) {
      alert("Por favor, rellena todos los campos.");
      return;
    }

    setLoading(true);

    try {
      const data = await login({
        username: user,
        contrasenya: password,
      });

      if (data.requiereCambioPass) {
        navigate("/cambiar-password", {
          state: {
            username: user,
            oldPassword: password,
          },
        });
        return;
      }

      if (data.token) {
        sessionStorage.setItem("token", data.token);
      }

      if (data.usuario) {
        setUsuario({
          id: data.usuario.id,
          username: data.usuario.username,
          nombre: data.usuario.nombre,
          apellido1: data.usuario.apellido1,
          apellido2: data.usuario.apellido2,
          email: data.usuario.email,
          rol: String(data.usuario.rol),
        });
      }

      navigate("/");
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "No se pudo conectar con el servidor.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    setUser,
    password,
    setPassword,
    loading,
    handleLogin,
  };
};
