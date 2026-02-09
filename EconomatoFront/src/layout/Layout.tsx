
import { FooterBar } from "../components/ui/Footer";
import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        /* 1. h-screen + overflow-hidden: Prohíbe cualquier scroll en la ventana */
        <div className="h-screen w-full bg-[#F8F9FA] flex overflow-hidden">
            
            {/* SIDEBAR: Fijo */}
            <SideBar />

            {/* 2. Contenedor principal: Ocupa el resto del ancho y alto disponible */}
            <main className="flex-1 flex flex-col sm:ml-60 h-full overflow-hidden">
                
                {/* 3. Padding del contenedor: Controlamos que el contenido no toque los bordes */}
                <div className="flex-1 flex flex-col p-4 lg:p-4 overflow-hidden">
                    
                    {/* 4. Tarjeta Blanca: H-FULL para que ocupe todo el espacio y no crezca más */}
                    <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 pr-2 lg:p-10 overflow-y-auto">
                        
                        {/* ¡IMPORTANTE! Si el contenido de la página (Outlet) es más grande 
                           que este hueco, se cortará. Aquí es donde vive tu página fija.
                        */}
                        <Outlet />
                        
                    </div>

                    {/* FOOTER: Pegado abajo sin scroll */}
                    <div className="mt-4">
                        <FooterBar />
                    </div>
                </div>
            </main>
        </div>
    );
}