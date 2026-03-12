import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = () => {
  const { usuario } = useAuth();
  const isAuth = !!usuario || localStorage.getItem("isAuthenticated") === "true";

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

  if (!hasRole(allowedRoles)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};