// src/layouts/Layout.tsx
import { FooterBar } from "../components/ui/Footer";
import SideBar from "../components/SideBar";
import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        /* Cambiamos bg-fondo por bg-gray-200 para asegurar que la base sea el gris que buscas */
        <div className="h-screen w-full bg-gray-200 flex overflow-hidden font-sans">

            {/* SIDEBAR */}
            <SideBar />

            {/* Main Content Wrapper */}
            <main className="flex-1 flex flex-col sm:ml-sidebar h-full overflow-hidden transition-all duration-300">

                {/* Padding Wrapper (EL MARCO QUE ANTES ERA BLANCO)
                   CAMBIO REALIZADO: bg-white -> bg-gray-200
                */}
                <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
                    isHome 
                        ? "p-2 sm:p-3 bg-gray-200" 
                        : "p-4 bg-gray-200"
                }`}>

                    {/* CONTENEDOR DEL CONTENIDO (Donde vive el Home Rojo) */}
                    <div className={`
                        flex-1 relative overflow-y-auto scrollbar-custom transition-all duration-300
                        ${isHome 
                            ? "rounded-[2rem] overflow-hidden shadow-lg border border-gray-300/20" // Borde curvo para el Home
                            : "bg-white rounded-[2rem] shadow-sm border border-gray-200 p-6 lg:p-10" // Tarjeta normal para otras secciones
                        }
                    `}>
                        <Outlet />
                    </div>

                    {/* Footer solo si no estamos en el Home */}
                    {!isHome && (
                        <div className="mt-4">
                            <FooterBar />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}