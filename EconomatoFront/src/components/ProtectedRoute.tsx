import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = () => {
  const isAuth = sessionStorage.getItem("isAuthenticated") === "true";

  // Si no está logueado, lo mandamos al login
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // Si está logueado, le dejamos pasar a las rutas hijas (el Layout)
  return <Outlet />;
};

interface RoleProtectedRouteProps {
  allowedRoles: string[];
}

export const RoleProtectedRoute = ({ allowedRoles }: RoleProtectedRouteProps) => {
  const { hasRole } = useAuth();

  // Si el usuario no tiene el rol necesario, lo mandamos al inicio
  if (!hasRole(allowedRoles)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};