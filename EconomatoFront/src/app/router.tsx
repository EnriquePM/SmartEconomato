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
import Home from "../pages/Home"; // <-- 1. IMPORTAMOS HOME

// Componentes temporales para las rutas que aún no tienen archivo propio
const Recepcion = () => <div><h1>Módulo de Recepción de Pedidos</h1></div>;

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
            element: <Recepcion />,
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