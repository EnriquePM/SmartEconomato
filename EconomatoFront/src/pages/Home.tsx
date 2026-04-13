import { useState, useEffect } from "react";
import {
  CloudSun, Clock, Utensils, ShoppingBasket,
  AlertCircle, ChevronRight
} from "lucide-react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useHome } from "../hooks/usoHome";
import RecetaCard from "../components/RecetaCard";
import { useNavigate } from 'react-router-dom';


const HomePage = () => {
  const [fecha, setFecha] = useState(new Date());
  const { avisos, loadingAvisos, pedidos, loadingPedidos, recetas, loadingRecetas, temperatura } = useHome();
  const navigate = useNavigate();
  const sinRecetas = !loadingRecetas && recetas.length === 0;

  useEffect(() => {
    const timer = setInterval(() => setFecha(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full flex flex-col animate-fade-in-up overflow-hidden px-4 relative">

      {/* FONDO */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#fff5f0] via-[#fde8df] to-[#fcd5c5]" />
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 520px 400px at 10% 90%,  rgba(220,38,38,0.14)  0%, transparent 70%),
            radial-gradient(ellipse 440px 360px at 90%  5%,  rgba(251,191,36,0.10) 0%, transparent 70%),
            radial-gradient(ellipse 320px 260px at 78% 75%,  rgba(220,38,38,0.08)  0%, transparent 70%),
            radial-gradient(ellipse 300px 200px at 50% 40%,  rgba(255,255,255,0.18) 0%, transparent 60%)
          `,
        }}
      />

      {/* HEADER */}
      <header className="flex justify-between items-center mb-3 md:mb-6 shrink-0 flex-wrap gap-3">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          Buenos días, Chef.
        </h1>

        <div className="flex items-center gap-5 md:gap-10">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Clima</span>
            <div className="flex items-center gap-2">
              <CloudSun size={20} className="text-gray-400" strokeWidth={2} />
              <span className="text-lg md:text-xl font-[500] text-gray-500 tracking-tighter">
                {temperatura !== null ? `${temperatura}°C` : '—'}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end border-l border-white/60 pl-5 md:pl-10">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Reloj</span>
            <div className="flex items-center gap-2">
              <Clock size={17} className="text-gray-400" strokeWidth={2.5} />
              <span className="text-lg md:text-xl font-[500] text-gray-500 tracking-tighter tabular-nums">
                {fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2 md:gap-3 min-h-0 mb-2 md:mb-3">

        {/* COLUMNA IZQUIERDA */}
        <div className="lg:col-span-4 flex flex-col gap-2 md:gap-3 min-h-0 h-full">

          {/* CALENDARIO */}
          <section className="bg-white/50 backdrop-blur-md rounded-pill shadow-sm border border-gray-100 p-5 md:p-6 shadow-sm flex flex-col shrink-0 overflow-hidden">
            <div className="w-full flex flex-col justify-center">
              <Calendar
                onChange={() => {}}
                value={fecha}
                locale="es-ES"
                navigationLabel={({ date, locale }) =>
                  date.toLocaleDateString(locale, { month: 'long' })
                }
                className="border-none w-full"
              />
            </div>
          </section>

          {/* AVISOS URGENTES */}
          <section onClick={() => navigate('/inventario')} className="bg-white/50 backdrop-blur-md rounded-pill shadow-sm border border-gray-100 p-4 flex flex-col lg:h-48 shadow-sm overflow-hidden">
        
            <div className="flex items-center gap-2 mb-3 shrink-0">
              <AlertCircle size={12} className="text-orange-500" />
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Avisos urgentes</span>
            </div>
            <div className="flex flex-col gap-2 lg:flex-1 lg:justify-between overflow-y-auto scrollbar-hide">

              {loadingAvisos ? (
                <span className="text-[10px] text-gray-300">Cargando...</span>
              ) : avisos.length === 0 ? (
                <span className="text-[10px] text-gray-300 italic">Sin avisos urgentes</span>
              ) : (
                avisos.map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl border backdrop-blur-sm
                      ${item.color === "orange" ? "bg-orange-50/50 border-orange-200/40" : "bg-yellow-50/50 border-yellow-200/40"}`}
                  >
                    <span className="text-[11px] font-bold text-gray-600">{item.nombre}</span>
                    <span className={`text-[8px] font-black uppercase bg-white/80 px-2 py-0.5 rounded-md shadow-sm tracking-tighter
                      ${item.color === "orange" ? "text-orange-600" : "text-yellow-600"}`}>
                      {item.badge}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>

        {/* COLUMNA DERECHA */}
        <div className="lg:col-span-8 flex flex-col gap-2 md:gap-3 min-h-0 h-full">

          {/* RECETAS */}
        <section
            onClick={() => navigate('/recetas')}
            className={`cursor-pointer bg-white/50 backdrop-blur-md rounded-pill shadow-sm border border-gray-100 p-5 md:p-8 flex flex-col overflow-hidden transition-all duration-300 ${
              sinRecetas ? 'shrink-0 h-24' : 'flex-1 min-h-0'
            }`}
          >
            <div className="flex justify-between items-center mb-4 md:mb-5 shrink-0">
              <div className="flex items-center gap-2">
                <Utensils size={14} className="text-acento" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recetario Destacado</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); navigate('/recetas'); }}
                className="text-[10px] font-black text-acento uppercase tracking-widest hover:underline"
              >
                Ver todo
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
              {loadingRecetas ? (
                <span className="text-[10px] text-gray-300">Cargando...</span>
              ) : sinRecetas ? (
                <span className="text-[10px] text-gray-300 italic">No hay recetas disponibles</span>
              ) : (
                <>
                  {/* Desktop */}
                  <div className="hidden lg:grid lg:grid-cols-2 gap-5 h-full">
                    {recetas.slice(0, 2).map((r) => <RecetaCard key={r.id_receta} receta={r} />)}
                  </div>
                  {/* Tablet */}
                  <div className="hidden md:grid lg:hidden grid-cols-2 gap-4">
                    {recetas.slice(0, 4).map((r) => <RecetaCard key={r.id_receta} receta={r} />)}
                  </div>
                  {/* Mobile */}
                  <div className="grid md:hidden grid-cols-1 gap-3">
                    {recetas.slice(0, 2).map((r) => <RecetaCard key={r.id_receta} receta={r} />)}
                  </div>
                </>
              )}
            </div>
          </section>
          {/* PEDIDOS PENDIENTES */}
          <section
            onClick={() => navigate('/pedidos')}
            className={`cursor-pointer bg-white/50 backdrop-blur-md rounded-pill shadow-sm border border-gray-100 p-5 md:p-8 flex flex-col overflow-hidden transition-all duration-300 ${
              sinRecetas ? 'flex-1' : 'shrink-0 lg:h-36'
            }`}
          >
            <div className="flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBasket size={14} className="text-acento" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pedidos Pendientes</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); navigate('/pedidos'); }}
                className="text-[10px] font-black text-acento uppercase tracking-widest hover:underline"
              >
                Gestionar
              </button>
            </div>

            <div className="flex-1 min-h-0 flex flex-col gap-2 overflow-y-auto scrollbar-hide mt-4">
              {loadingPedidos ? (
                <span className="text-[10px] text-gray-300">Cargando...</span>
              ) : pedidos.length === 0 ? (
                <span className="text-[10px] text-gray-300 italic">Sin pedidos pendientes</span>
              ) : (
                pedidos.map((pedido) => (
                  <div
                    key={pedido.id_pedido}
                    className="w-full flex items-center justify-between p-3 md:p-4 bg-white/40 backdrop-blur-sm border border-white/60 rounded-[2rem] hover:bg-white/60 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <span className="font-mono text-[10px] text-gray-300 font-bold tracking-tighter">
                        #{pedido.id_pedido}
                      </span>
                      <div>
                        <span className="text-sm font-black text-gray-700 tracking-tight block leading-none">
                          {pedido.proveedor ?? 'Sin proveedor'}
                        </span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-1 block">
                          {pedido.fecha_pedido
                            ? new Date(pedido.fecha_pedido).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
                            : '—'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                      <span className="font-black text-gray-900 tabular-nums text-sm md:text-base">
                        {pedido.total_estimado != null ? `${Number(pedido.total_estimado).toFixed(2)}€` : '—'}
                      </span>
                      <div className="flex items-center gap-2 md:gap-3">
                        <span className={`text-[9px] font-black px-2 md:px-3 py-1 rounded-full tracking-widest uppercase
                          ${pedido.estado === 'CONFIRMADO' ? 'bg-green-100/80 text-green-700' :
                            pedido.estado === 'VALIDADO'   ? 'bg-blue-100/80 text-blue-700' :
                                                            'bg-yellow-100/80 text-yellow-700'}`}>
                          {pedido.estado}
                        </span>
                        <div className="bg-white/70 backdrop-blur-sm p-2 rounded-lg shadow-sm group-hover:bg-acento transition-colors border border-white/60">
                          <ChevronRight size={12} className="text-acento group-hover:text-white" strokeWidth={3} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </div>

      <style>{`
        .react-calendar__navigation__label {
          pointer-events: none;
          background: none !important;
        }
        .react-calendar__navigation__label__textContent {
          color: #9ca3af !important;
          font-weight: 800 !important;
          text-transform: lowercase !important;
          font-size: 18px !important;
          letter-spacing: -0.02em;
        }
        .react-calendar__navigation__prev2-button,
        .react-calendar__navigation__next2-button {
          display: none !important;
        }
        .react-calendar {
          width: 100% !important;
          border: none !important;
          font-family: inherit;
          background: transparent;
        }
        .react-calendar__month-view__weekdays { display: none !important; }
        .react-calendar__navigation {
          margin-bottom: 1rem !important;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .react-calendar__navigation button {
          color: #d1d5db !important;
          min-width: 40px !important;
          font-size: 18px !important;
          transition: color 0.2s ease;
          background: transparent !important;
        }
        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: transparent !important;
          color: #DC2626 !important;
        }
        .react-calendar__tile {
          padding: 0.75em 0.5em !important;
          font-size: 13px !important;
          font-weight: 700;
          color: #6b7280;
          background: none;
          border-radius: 12px !important;
          transition: all 0.2s ease;
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: rgba(220,38,38,0.10) !important;
          color: #DC2626 !important;
        }
        .react-calendar__tile--active {
          background: #DC2626 !important;
          color: white !important;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25);
        }
        .react-calendar__tile--now {
          background: #DC2626 !important;
          color: #fee2e2 !important;
        }
        .react-calendar__month-view__days {
          display: grid !important;
          grid-template-columns: repeat(7, 1fr);
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default HomePage;