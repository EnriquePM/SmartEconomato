import { FooterBar } from "../components/ui/Footer";
import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        /* 1. Contenedor Principal */
        <div className="h-screen w-full bg-fondo flex overflow-hidden">

            {/* SIDEBAR */}
            <SideBar />

            {/* 2. Main Content Wrapper */}
            <main className="flex-1 flex flex-col sm:ml-sidebar h-full overflow-hidden">

                {/* 3. Padding Wrapper */}
                <div className="flex-1 flex flex-col p-4 overflow-hidden">

                    {/* 4. TARJETA BLANCA (EL CAMBIO ESTÁ AQUÍ)
                        - Quitamos: overflow-y-auto (ya no hace scroll toda la tarjeta)
                        - Ponemos: overflow-hidden (corta lo que sobre)
                        - Ponemos: flex flex-col (para organizar el contenido verticalmente)
                    */}

                    <div className="flex-1 bg-tarjeta rounded-panel shadow-sm border border-gray-100 p-6 lg:p-10 ml-4 overflow-y-auto scrollbar-custom relative">
                        <Outlet />
                    </div>

                    {/* FOOTER */}
                    <div className="mt-4">
                        <FooterBar />
                    </div>
                </div>
            </main>
        </div>
    );
}