import { useState, useEffect } from "react";
import {
  CloudSun, Clock, Utensils, ShoppingBasket,
  AlertCircle, ChevronRight
} from "lucide-react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useHome } from "../hooks/usoHome";
import { RecetaCard } from "../components/recetas/RecetaCard";
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
   <div className="h-screen flex flex-col overflow-hidden px-6 pt-4 pb-5 animate-fade-in-up">

      {/* HEADER */}
      <header className="shrink-0 flex justify-between items-center mb-4 flex-wrap gap-3">
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

      {/* BODY GRID — items-start para que la col izquierda no se estire */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* COLUMNA IZQUIERDA — altura natural, sin flex-1 */}
        <div className="lg:col-span-4 flex flex-col gap-3">

          {/* Calendario */}
          <section className="bg-white/30 backdrop-blur-md rounded-pill shadow-sm px-3 py-2">
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

          {/* Avisos — máximo 2 items, sin scroll */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle size={12} className="text-acento" />
              <span className="text-[15px] font-medium text-primario">Avisos urgentes</span>
            </div>
            <section
              onClick={() => navigate('/inventario')}
              className="cursor-pointer bg-white rounded-[1rem] shadow-md p-3 flex flex-col gap-2"
            >
              {loadingAvisos ? (
                <span className="text-[10px] text-gray-300">Cargando...</span>
              ) : avisos.length === 0 ? (
                <span className="text-[10px] text-gray-300 italic">Sin avisos urgentes</span>
              ) : (
                avisos.slice(0, 2).map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-2 rounded-[1rem] bg-gray-50/50 border border-gray-100 shadow-sm"
                  >
                    <span className="text-[11px] font-bold text-gray-700">{item.nombre}</span>
                    <span className="border border-gray-100 text-acento text-[8px] font-black uppercase px-2 py-0.5 rounded-md tracking-tighter bg-white">
                      {item.badge}
                    </span>
                  </div>
                ))
              )}
            </section>
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="lg:col-span-8 flex flex-col gap-4">

          {/* Recetas */}
          <section
            onClick={() => navigate('/recetas')}
            className="cursor-pointer rounded-pill px-4 py-3 flex flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              <Utensils size={14} className="text-acento" />
              <span className="text-[15px] font-medium text-primario">Últimas Recetas</span>
            </div>
            <div className="px-1">
              {loadingRecetas && <span className="text-[10px] text-gray-300">Cargando...</span>}
              {sinRecetas && <span className="text-[10px] text-gray-300 italic">No hay recetas disponibles</span>}
              {!loadingRecetas && !sinRecetas && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recetas.slice(0, 2).map((r) => (
                    <RecetaCard key={r.id_receta} receta={r} />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Pedidos — máximo 3 para no desbordar */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <ShoppingBasket size={14} className="text-acento" />
              <span className="text-[15px] font-medium text-primario">Pedidos Pendientes</span>
            </div>
            <section
              onClick={() => navigate('/pedidos')}
              className="cursor-pointer rounded-pill px-1 flex flex-col gap-2"
            >
              {loadingPedidos ? (
                <span className="text-[10px] text-gray-300">Cargando...</span>
              ) : pedidos.length === 0 ? (
                <span className="text-[10px] text-gray-300 italic">Sin pedidos pendientes</span>
              ) : (
                pedidos.slice(0, 3).map((pedido) => (
                  <div
                    key={pedido.id_pedido}
                    className="w-full flex items-center justify-between p-3 md:p-4 shadow-md bg-white rounded-[1rem] transition-all cursor-pointer group"
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
                ))
              )}
            </section>
          </div>
        </div>
      </div>

      <style>{`
        .react-calendar__navigation__label__textContent {
          color: #cad2e1ff !important;
          font-weight: 800 !important;
          text-transform: lowercase !important;
          font-size: 15px !important;
          letter-spacing: -0.02em;
        }
        .react-calendar__navigation {
          margin-bottom: 0.5rem !important;
        }
        .react-calendar__navigation button {
          font-size: 16px !important;
          min-width: 30px !important;
        }
        .react-calendar__tile {
          padding: 0.5em 0.4em !important;
          font-size: 11px !important;
        }
        .react-calendar__navigation__label {
          pointer-events: none;
          background: none !important;
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
        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: transparent !important;
          color: #DC2626 !important;
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: rgba(220,38,38,0.10) !important;
          color: #DC2626 !important;
        }
        .react-calendar__tile--active {
          background: #DC2626 !important;
          color: white !important;
          box-shadow: 0 4px 10px rgba(220, 38, 38, 0.25);
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