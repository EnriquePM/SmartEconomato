
import { FooterBar } from "../components/ui/Footer";
import SideBar from "../components/SideBar";
import { Outlet} from "react-router-dom";

export default function Layout() {

    return (
        <div className="h-screen w-full bg-'fondo' flex overflow-hidden font-sans">
            <SideBar />
            <main className="flex-1 flex flex-col sm:ml-sidebar h-full overflow-hidden transition-all duration-300">
                <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 p-4 bg-'fondo'
                    `}>
                    <div className={`
                        flex-1 relative overflow-y-auto scrollbar-custom transition-all duration-300 bg-white rounded-[2rem] shadow-sm border border-gray-200 p-6 lg:p-10
                        
                    `}>
                        <Outlet />
                    </div>
                        <div className="mt-4">
                            <FooterBar />
                        </div>
                </div>
            </main>
        </div>
    );
}