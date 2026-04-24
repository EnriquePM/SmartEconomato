
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
import PedidosPage from "../pages/recepcionPedidos";
import RecetasPage from "../pages/Recetas";
import PaginaMantimiento from "../pages/PaginaMantenimiento";
import PanelControl from "../pages/PanelControl";


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
    path: "/mantenimiento",
    element: <PaginaMantimiento />,
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
            element: <PedidosPage />, 
          },
          {
            path: "pedidos",
            element: <Pedidos />,
          },
          {
            path: "recetas",
            element: <RecetasPage />,
          },
          {
            path: "registrar-general",
            element: <IngresoGeneral />,
          },
          {
            element: <RoleProtectedRoute allowedRoles={["Administrador", "Profesor"]} />,
            children: [
              {
                path: "admin-usuarios",
                element: <AdminUsuarios />,
              },
              {
                path: "panel-control",
                element: <PanelControl />,
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