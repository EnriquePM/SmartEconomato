import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const isAuth = localStorage.getItem("isAuthenticated") === "true";

  // Si no está logueado, lo mandamos al login
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // Si está logueado, le dejamos pasar a las rutas hijas (el Layout)
  return <Outlet />;
};