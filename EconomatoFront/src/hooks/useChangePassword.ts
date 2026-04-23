import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { changePassword } from "../services/auth-service";

type ChangePasswordRouteState = {
  username?: string;
  oldPassword?: string;
};

export const useChangePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as ChangePasswordRouteState;

  const { username, oldPassword } = state;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!username || !oldPassword) {
      navigate("/login");
    }
  }, [username, oldPassword, navigate]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!newPassword || !confirmPassword) {
      alert("Por favor, rellena ambos campos.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Las contrasenas no coinciden.");
      return;
    }

    if (!username || !oldPassword) {
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      await changePassword({
        username,
        oldPassword,
        newPassword,
      });

      alert("Contrasena actualizada con exito. Inicia sesion con la nueva clave.");
      navigate("/login");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error de conexion con el servidor.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    handleSubmit,
  };
};
