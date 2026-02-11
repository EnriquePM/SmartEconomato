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
import Perfil from "../pages/Perfil";
import RegistrarUtensilio from "../pages/RegistrarUtensilio";
import Pedidos from "../pages/Pedidos";

// Componentes temporales para las rutas que aún no tienen archivo propio
const Recepcion = () => <div><h1>Módulo de Recepción de Pedidos</h1></div>;


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
          // 2. AÑADIMOS LA RUTA DE PERFIL AQUÍ
          {
            path: "perfil",
            element: <Perfil />,
          },
          {
            path: "registrar-utensilio",
            element: <RegistrarUtensilio />
          },
        ],
      },
    ],
  },
];