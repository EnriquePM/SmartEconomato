// src/pages/Home.tsx
import { Link } from "react-router-dom";
import { ShoppingCart, Package, Users, AlertTriangle, Clock } from "lucide-react"; // ArrowRight quitado de aquí
import { useHome } from "../hooks/useHome";


// --- CSS DE LA ANIMACIÓN ---
const backgroundStyle = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(50px, -80px) scale(1.2); }
    66% { transform: translate(-40px, 40px) scale(0.8); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  .animate-blob { animation: blob 8s infinite; }
  .animation-delay-2000 { animation-delay: 2s; }
  .animation-delay-4000 { animation-delay: 4s; }
`;

const Home = () => {
  const { accesos, actividadReciente, cargando } = useHome();

  if (cargando) {
    return <div className="w-full h-full bg-[#450a0a] flex items-center justify-center text-white">Cargando SmartEconomato...</div>;
  }

  return (
    <div className="relative w-full h-full bg-[#450a0a] animate-fade-in-up overflow-hidden">
      <style>{backgroundStyle}</style>

        {/* --- CAPA DE MOVIMIENTO --- */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-600 rounded-full mix-blend-screen filter blur-[80px] opacity-70 animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-500 rounded-full mix-blend-screen filter blur-[80px] opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-rose-600 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob animation-delay-4000"></div>
             <div className="absolute top-[30%] left-[40%] w-[400px] h-[400px] bg-red-900 rounded-full mix-blend-overlay filter blur-[60px] opacity-80 animate-blob"></div>
        </div>

        {/* --- CONTENIDO --- */}
        <div className="relative z-10 w-full h-full overflow-y-auto p-5 space-y-5 scrollbar-hide">
            
            {/* HEADER - Texto actualizado según tu captura */}
            <div className="pl-1 pt-1">
            <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-md">
                Bienvenido
            </h1>
            <p className="text-red-200/80 font-medium mt-1">Resumen del día.</p>
            </div>

            {/* TARJETAS DE ACCESO */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {accesos.map((item, idx) => (
                <Link
                key={idx}
                to={item.ruta}
                className="group relative bg-white/10 backdrop-blur-md h-36 rounded-[1.5rem] shadow-lg border border-white/20 hover:bg-white/20 hover:scale-[1.02] transition-all duration-300 flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden"
                >
                <div className={`p-3 rounded-xl ${item.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <item.icono size={24} strokeWidth={2} />
                </div>
                <span className="font-bold text-white text-sm tracking-tight drop-shadow-sm">
                    {item.titulo}
                </span>
                </Link>
            ))}
            </section>

            {/* LISTA DE ACTIVIDAD */}
            <section className="bg-black/20 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/10 p-6 flex-1 mb-0">
           

            <div className="space-y-3">
                {actividadReciente.map((item) => (
                <div key={item.id} className="group flex items-center justify-between p-3 bg-white/80 hover:bg-white border border-transparent rounded-xl transition-all duration-200 cursor-default shadow-sm">
                    <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${
                        item.estado === 'warning' ? 'bg-orange-100 text-orange-600' :
                        item.estado === 'success' ? 'bg-green-100 text-green-600' :
                        item.estado === 'danger' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                    }`}>
                        {item.tipo === 'pedido' && <ShoppingCart size={18} />}
                        {item.tipo === 'stock' && <Package size={18} />}
                        {item.tipo === 'alerta' && <AlertTriangle size={18} />}
                        {item.tipo === 'user' && <Users size={18} />}
                    </div>
                    <div>
                        {/* Cambia esto: */}
<h4 className="font-bold text-gray-900 text-sm">
  {item.titulo.replace('Stock:', 'Ingrediente:')}
</h4>

{/* Esto se queda igual (subtítulo): */}
<p className="text-xs text-gray-700 font-medium">{item.sub}</p>
                    </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold text-gray-500 bg-white/50 px-2 py-0.5 rounded-full border border-gray-200/50">
                        {item.hora}
                    </span>
                    </div>
                </div>
                ))}
            </div>
            </section>
        </div>
    </div>
  );
};

export default Home;