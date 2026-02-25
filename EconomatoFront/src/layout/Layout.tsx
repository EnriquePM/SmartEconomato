import { FooterBar } from "../components/ui/Footer";
import SideBar from "../components/SideBar";
import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <div className="h-screen w-full bg-fondo flex overflow-hidden">

            {/* SIDEBAR */}
            <SideBar />

            {/* Main Content Wrapper */}
            <main className="flex-1 flex flex-col sm:ml-sidebar h-full overflow-hidden transition-all duration-300">

                {/* Padding Wrapper (EL MARCO BLANCO)
                    CAMBIO: 
                    - Antes: "p-4 sm:p-6" (Gordo)
                    - Ahora: "p-2 sm:p-3" (Fino, unos 8px en móvil y 12px en PC)
                */}
                <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isHome ? "p-2 sm:p-3 bg-white" : "p-4"}`}>

                    {/* CONTENEDOR DEL CONTENIDO */}
                    <div className={`
                        flex-1 relative overflow-y-auto scrollbar-custom transition-all duration-300
                        ${isHome 
                            ? "rounded-[2rem] overflow-hidden shadow-lg border border-gray-100" // Borde curvo para el Home
                            : "bg-tarjeta rounded-panel shadow-sm border border-gray-100 p-6 lg:p-10 ml-4" // Tarjeta normal
                        }
                    `}>
                        <Outlet />
                    </div>

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