import type { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import LoginPage2 from "../pages/LoginPrueba";
import Layout from "../layout/Layout";
import Inicio from "../pages/inicioPrueba";
import IngresarProducto from "../pages/IngresarProducto";
import Inventario from "../pages/Inventario";
import AdminUsuarios from "../pages/AdminUsuarios";

// Componentes temporales para las rutas que aún no tienen archivo propio
const Recepcion = () => <div><h1>Módulo de Recepción de Pedidos</h1></div>;
const Pedidos = () => <div><h1>Listado de Pedidos Actuales</h1></div>;

export const routes: RouteObject[] = [
  {
    // 1. RUTA PÚBLICA: El Login siempre debe ser accesible
    path: "/login",
    element: <LoginPage2 />,
  },
  {
    // 2. RUTAS PROTEGIDAS: Todo lo que esté aquí dentro requiere localStorage
    element: <ProtectedRoute />, 
    children: [
      {
        path: "/",
        element: <Layout />, 
        children: [
          {
            index: true, // Esta es la página "/"
            element: <Inicio />,
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
            path: "registrar",
            element: <IngresarProducto />,
          },
          {
          path: "admin-usuarios",
          element: <AdminUsuarios />,
          },
        ],
      },
    ],
  },
];

