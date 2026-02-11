
import { FooterBar } from "../components/ui/Footer";
import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        /* 1. bg-fondo: centralizado en el config */
        <div className="h-screen w-full bg-fondo flex overflow-hidden">
            
            {/* SIDEBAR: Se mantiene fijo a la izquierda */}
            <SideBar />

            {/* 2. sm:ml-sidebar: sincronizado con el ancho del sidebar en el config */}
            <main className="flex-1 flex flex-col sm:ml-sidebar h-full overflow-hidden">
                
                {/* 3. Contenedor con padding para que la tarjeta no pegue a los bordes */}
                <div className="flex-1 flex flex-col p-4 overflow-hidden">
                    
                    {/* 4. Tarjeta Blanca:
                        - bg-tarjeta y rounded-panel: desde el config.
                        - overflow-y-auto: permite scroll SOLO aquí dentro.
                    */}
                    <div className="flex-1 bg-tarjeta rounded-panel shadow-sm border border-gray-100 p-6 lg:p-10 ml-4 overflow-y-auto">
                        
                        <Outlet />
                        
                    </div>

                    {/* FOOTER: Espacio controlado con mt-4 */}
                    <div className="mt-4">
                        <FooterBar />
                    </div>
                </div>
            </main>
        </div>
    );
}