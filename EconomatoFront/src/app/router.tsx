import { createBrowserRouter } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";

// IMPORTAMOS TUS PÁGINAS NUEVAS
import LoginPage from "../pages/LoginPage";         
import CambiarPassword from "../pages/CambiarPassword"; 
import Layout from "../layout/Layout";
// import Inicio from "../pages/inicioPrueba"; // <-- YA NO LO USAMOS
import Inventario from "../pages/Inventario";
import AdminUsuarios from "../pages/AdminUsuarios";
import Perfil from "../pages/Perfil";
import Pedidos from "../pages/Pedidos";
import IngresoGeneral from "../pages/IngresoGeneral";
import Home from "../pages/Home"; 
import PedidosPage from "../pages/recepcionPedidos"; 



export const routes: RouteObject[] = [
  {
    // 1. LOGIN (PÚBLICO)
    path: "/login",
    element: <LoginPage />, 
  },
  {
    // 2. CAMBIAR PASSWORD (PÚBLICO PERO CONTROLADO)
    path: "/cambiar-password",
    element: <CambiarPassword />,
  },
  {
    // 3. RUTAS PROTEGIDAS
    element: <ProtectedRoute />, 
    children: [
      {
        path: "/",
        element: <Layout />, 
        children: [
          {
            index: true, 
            element: <Home />, // <-- 2. AQUÍ ESTÁ EL CAMBIO
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
            // Ajustado para coincidir con el botón del Home
            path: "registrar-general", 
            element: <IngresoGeneral />, 
          },
          {
            // Ajustado para coincidir con el botón del Home
            path: "admin-usuarios", 
            element: <AdminUsuarios />,
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