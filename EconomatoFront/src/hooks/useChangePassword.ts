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
  const [error, setError] = useState<string | null>(null); // Nuevo estado de error

  useEffect(() => {
    if (!username || !oldPassword) {
      navigate("/login");
    }
  }, [username, oldPassword, navigate]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (!newPassword || !confirmPassword) {
      setError("Por favor, rellena ambos campos.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
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

      navigate("/login", { state: { successMessage: "Contraseña actualizada con éxito." } });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error de conexión con el servidor.";
      setError(message);
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
    error,      
    setError,   
    handleSubmit,
  };
};