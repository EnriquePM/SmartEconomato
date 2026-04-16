import { FooterBar } from "../components/ui/Footer";
import SideBar from "../components/SideBar";
import { Outlet, useLocation } from "react-router-dom";
import fondo from "../assets/fondoHome.png"; 

export default function Layout() {
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <div className="h-screen w-full bg-'fondo' flex overflow-hidden font-sans">
            <SideBar />
            <main className="flex-1 flex flex-col sm:ml-sidebar h-full overflow-hidden transition-all duration-300">
                
                <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300 p-4 bg-'fondo'">
                    <div className={`flex-1 relative overflow-hidden rounded-[2rem] border border-gray-200 ${!isHome ? 'bg-white' : ''}`}> 
                        
                        {isHome && (
                            <>
                                <div 
                                    className="absolute inset-0 z-0"
                                    style={{
                                        backgroundImage: `url(${fondo})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        filter: 'blur(25px)', 
                                        transform: 'scale(1.1)'
                                    }}
                                />
                                <div className="absolute inset-0 z-10 bg-white/40" />
                            </>
                        )}

                        <div className="relative z-20 h-full overflow-y-auto scrollbar-custom p-6 lg:p-10">
                            <Outlet />
                        </div>
                    </div>
                    <div className="mt-4">
                        <FooterBar />
                    </div>
                </div>
            </main>
        </div>
    );
}