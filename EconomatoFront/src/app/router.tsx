import { createBrowserRouter } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";

// IMPORTAMOS TUS PÁGINAS NUEVAS
import LoginPage from "../pages/LoginPage";         
import CambiarPassword from "../pages/CambiarPassword"; 
import Layout from "../layout/Layout";
import Inicio from "../pages/inicioPrueba"; // Ojo, revisa si cambiaste este nombre
import IngresarProducto from "../pages/IngresarProducto";
import Inventario from "../pages/Inventario";
import AdminUsuarios from "../pages/AdminUsuarios";

// Componentes temporales
const Recepcion = () => <div className="p-4"><h2>Módulo de Recepción de Pedidos</h2></div>;
const Pedidos = () => <div className="p-4"><h2>Listado de Pedidos Actuales</h2></div>;

export const routes: RouteObject[] = [
  {
    // 1. LOGIN (PÚBLICO)
    path: "/login",
    element: <LoginPage />, // Usamos el componente nuevo
  },
  {
    // 2. CAMBIAR PASSWORD (PÚBLICO PERO CONTROLADO)
    path: "/cambiar-password",
    element: <CambiarPassword />,
  },
  {
    // 3. RUTAS PROTEGIDAS (Requieren localStorage "isAuthenticated")
    element: <ProtectedRoute />, 
    children: [
      {
        path: "/",
        element: <Layout />, 
        children: [
          {
            index: true, 
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

// Opcional: si necesitas exportar el router creado directamente como hacías en App.tsx
// export const router = createBrowserRouter(routes);