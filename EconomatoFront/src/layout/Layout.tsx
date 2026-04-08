// src/layouts/Layout.tsx
import { FooterBar } from "../components/ui/Footer";
import SideBar from "../components/SideBar";
import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
    const location = useLocation();
    const isHome = location.pathname === "/.";

    return (
        <div className="h-screen w-full bg-'fondo' flex overflow-hidden font-sans">
            <SideBar />
            <main className="flex-1 flex flex-col sm:ml-sidebar h-full overflow-hidden transition-all duration-300">
                <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
                    isHome 
                        ? "p-2 sm:p-3 bg-'fondo'" 
                        : "p-4 bg-'fondo'"
                }`}>
                    <div className={`
                        flex-1 relative overflow-y-auto scrollbar-custom transition-all duration-300
                        ${isHome 
                            ? "rounded-[2rem] overflow-hidden shadow-lg border border-gray-300/20" 
                            : "bg-white rounded-[2rem] shadow-sm border border-gray-200 p-6 lg:p-10" 
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