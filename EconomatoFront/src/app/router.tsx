import { createBrowserRouter } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { ProtectedRoute, RoleProtectedRoute } from "../components/ProtectedRoute";

import LoginPage from "../pages/LoginPage";
import CambiarPassword from "../pages/CambiarPassword";
import Layout from "../layout/Layout";
import Inventario from "../pages/Inventario";
import AdminUsuarios from "../pages/AdminUsuarios";
import Perfil from "../pages/Perfil";
import Pedidos from "../pages/Pedidos";
import IngresoGeneral from "../pages/IngresoGeneral";
import Home from "../pages/Home";

const Recepcion = () => <div><h1>Modulo de Recepcion de Pedidos</h1></div>;

export const routes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/cambiar-password",
    element: <CambiarPassword />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "inventario",
            element: <Inventario />,
          },
          {
            path: "recepcion",
            element: <Recepcion />,
          },
          {
            path: "pedidos",
            element: <Pedidos />,
          },
          {
            path: "registrar-general",
            element: <IngresoGeneral />,
          },
          {
            // Ruta protegida por rol: solo Administrador y Profesor
            element: <RoleProtectedRoute allowedRoles={["Administrador", "Profesor"]} />,
            children: [
              {
                path: "admin-usuarios",
                element: <AdminUsuarios />,
              },
            ],
          },
          {
            path: "perfil",
            element: <Perfil />,
          },
        ],
      },
    ],
  },
];