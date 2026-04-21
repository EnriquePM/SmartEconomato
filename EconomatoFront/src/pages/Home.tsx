import { useState, useEffect } from "react";
import {
  CloudSun, Clock, Utensils, ShoppingBasket,
  AlertCircle, ChevronRight
} from "lucide-react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useHome } from "../hooks/usoHome";
import { RecetaCardHome } from "../components/recetas/RecetaCardHome";
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [fecha, setFecha] = useState(new Date());
  const { user, avisos, loadingAvisos, pedidos, loadingPedidos, recetas, loadingRecetas, temperatura } = useHome();
  const navigate = useNavigate();
  const sinRecetas = !loadingRecetas && recetas.length === 0;

  useEffect(() => {
    const timer = setInterval(() => setFecha(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (

    <div className="h-full flex flex-col overflow-hidden px-4 pt-2 pb-4 animate-fade-in-up">
      <header className="shrink-0 flex justify-between items-center px-4 mb-4 flex-wrap gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-primario tracking-tight">
          ¡Hola, {user?.username || "Cargando..."}!
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
          <div className="flex flex-col items-end border-l border-300 pl-5 md:pl-10">
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

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4">

        <div className="lg:col-span-4 flex flex-col gap-4 min-h-0">

          {/* Calendario: altura natural, no crece */}
          <section className="shrink-0 bg-white/30 backdrop-blur-md rounded-pill shadow-sm p-4 md:p-5">
            <Calendar
              onChange={() => {}}
              value={fecha}
              locale="es-ES"
              navigationLabel={({ date, locale }) =>
                date.toLocaleDateString(locale, { month: 'long' })
              }
              className="border-none w-full"
            />
          </section>

          {/* Avisos: ocupa el resto de la columna izquierda */}
          <section
            onClick={() => navigate('/inventario')}
            className="cursor-pointer flex-1 min-h-0 bg-white/70 backdrop-blur-md rounded-pill shadow-sm p-4 flex flex-col"
          >
            <div className="shrink-0 flex items-center gap-2 mb-3">
              <AlertCircle size={12} className="text-acento" />
              <span className="text-[15px] font-medium text-primario">Avisos urgentes</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide flex flex-col gap-2">
              {loadingAvisos ? (
                <span className="text-[10px] text-gray-300">Cargando...</span>
              ) : avisos.length === 0 ? (
                <span className="text-[10px] text-gray-300 italic">Sin avisos urgentes</span>
              ) : avisos.map((item, i) => (
                <div key={i} className="shrink-0 flex items-center justify-between px-3 py-2 rounded-[1rem] bg-white shadow-sm">
                  <span className="text-[11px] font-bold text-gray-700">{item.nombre}</span>
                  <span className={`border border-gray-100 text-acento text-[8px] font-black uppercase px-2 py-0.5 rounded-md tracking-tighter`}>
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* ── COLUMNA DERECHA (8/12) ── */}
        <div className="lg:col-span-8 flex flex-col gap-4 min-h-0">

          {/* Recetas: flex-[3] = 60% de la columna derecha */}
          <section
            onClick={() => navigate('/recetas')}
            className="cursor-pointer flex-[3] min-h-0 bg-white/70 backdrop-blur-md rounded-pill shadow-sm p-5 md:p-6 flex flex-col"
          >
            <div className="shrink-0 flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Utensils size={14} className="text-acento" />
                <span className="text-[15px] font-medium text-primario">Últimas Recetas</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); navigate('/recetas'); }}
                className="text-[10px] font-black text-acento uppercase tracking-widest hover:underline"
              >
                Ver todo
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
              {loadingRecetas && <span className="text-[10px] text-gray-300">Cargando...</span>}
              {sinRecetas && <span className="text-[10px] text-gray-300 italic">No hay recetas disponibles</span>}
              {!loadingRecetas && !sinRecetas && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {recetas.slice(0, 4).map((r) => (
                    <RecetaCardHome key={r.id_receta} receta={r} />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Pedidos: flex-[2] = 40% de la columna derecha */}
          <section
            onClick={() => navigate('/pedidos')}
            className="cursor-pointer flex-[2] min-h-0 bg-white/70 backdrop-blur-md rounded-pill shadow-sm p-5 md:p-6 flex flex-col"
          >
            <div className="shrink-0 flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBasket size={14} className="text-acento" />
                <span className="text-[15px] font-medium text-primario">Pedidos Pendientes</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); navigate('/pedidos'); }}
                className="text-[10px] font-black text-acento uppercase tracking-widest hover:underline"
              >
                Gestionar
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide flex flex-col gap-2">
              {loadingPedidos ? (
                <span className="text-[10px] text-gray-300">Cargando...</span>
              ) : pedidos.length === 0 ? (
                <span className="text-[10px] text-gray-300 italic">Sin pedidos pendientes</span>
              ) : pedidos.map((pedido) => (
                <div
                  key={pedido.id_pedido}
                  className="shrink-0 w-full flex items-center justify-between p-3 md:p-4 bg-white/40 backdrop-blur-sm border border-white/60 rounded-[1rem] hover:bg-white/60 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <span className="font-mono text-[10px] text-gray-300 font-bold tracking-tighter hidden xl:block">
                      {pedido.id_pedido}
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
                  <div className="flex items-center gap-2 md:gap-3 shrink-0">
                    <span className="font-black text-gray-900 tabular-nums text-sm md:text-base">
                      {pedido.total_estimado != null ? `${Number(pedido.total_estimado).toFixed(2)}€` : '—'}
                    </span>
                
                    <div className="bg-white/70 backdrop-blur-sm p-2 rounded-full shadow-sm group-hover:bg-acento transition-colors border border-white/60">
                      <ChevronRight size={12} className="text-acento group-hover:text-white" strokeWidth={3} />
                    </div>
                  </div>
                </div>
              ))}
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
          color: #cad2e1ff !important;
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
          color: #7d8187ff !important;
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