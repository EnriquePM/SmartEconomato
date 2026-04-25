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
    <div className="flex flex-col h-full gap-4 animate-fade-in overflow-hidden">

      {/* HEADER */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-2 gap-3 shrink-0">
        <h1 className="text-2xl font-bold text-primario tracking-tight">
          ¡Hola, {user?.username || "Cargando..."}!
        </h1>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Clima</span>
            <div className="flex items-center gap-2">
              <CloudSun size={18} className="text-gray-400" strokeWidth={2} />
              <span className="text-base font-[500] text-gray-500 tracking-tighter">
                {temperatura !== null ? `${temperatura}°C` : '—'}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end border-l border-gray-200 pl-6">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Reloj</span>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400" strokeWidth={2.5} />
              <span className="text-base font-[500] text-gray-500 tracking-tighter tabular-nums">
                {fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* GRID 2 columnas */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 min-h-0">

        {/* COLUMNA IZQUIERDA */}
        <div className="flex flex-col gap-4 min-h-0">

          {/* CALENDARIO */}
          <div className="bg-white/50 backdrop-blur-md rounded-2xl shadow-sm p-6 flex flex-col flex-1 min-h-0 overflow-hidden">
            <span className="text-[10px] font-black text-transparent uppercase tracking-widest mb-3 shrink-0">Calendario</span>
            <div className="flex-1 flex items-center justify-center min-h-0 px-2">
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
          </div>

          {/* AVISOS */}
          <div
            onClick={() => navigate('/inventario')}
            className="cursor-pointer bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3 flex-1 min-h-0 overflow-hidden"
          >
            <div className="flex items-center gap-2 shrink-0">
              <AlertCircle size={13} className="text-acento" />
              <span className="text-[13px] font-bold text-primario">Avisos urgentes</span>
            </div>
            <div className="flex flex-col gap-2 flex-1 min-h-0">
              {loadingAvisos ? (
                <span className="text-[10px] text-gray-300">Cargando...</span>
              ) : avisos.length === 0 ? (
                <span className="text-[10px] text-gray-300 italic">Sin avisos urgentes</span>
              ) : (
                avisos.slice(0, 2).map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-[11px] font-bold text-gray-700">{item.nombre}</span>
                    <span className="text-acento text-[8px] font-black uppercase px-2 py-0.5 rounded-md border border-gray-100 bg-white tracking-tighter">
                      {item.badge}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* COLUMNA DERECHA */}
        <div className="flex flex-col gap-4 min-h-0">

          {/* RECETAS */}
          <div
            onClick={() => navigate('/recetas')}
            className="cursor-pointer bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3 flex-1 min-h-0"
          >
            <div className="flex items-center gap-2 shrink-0">
              <Utensils size={13} className="text-acento" />
              <span className="text-[13px] font-bold text-primario">Últimas Recetas</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              {loadingRecetas && <span className="text-[10px] text-gray-300">Cargando...</span>}
              {sinRecetas && <span className="text-[10px] text-primario">No hay recetas disponibles</span>}
              {!loadingRecetas && !sinRecetas && (
                <div className="grid grid-cols-2 gap-4 pb-2">
                  {recetas.slice(0, 2).map((r) => (
                    <RecetaCard
                      key={r.id_receta}
                      receta={r}
                      onClick={() => navigate('/recetas')}
                      onEdit={() => navigate('/recetas')}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* PEDIDOS */}
          <div
            onClick={() => navigate('/pedidos')}
            className="cursor-pointer bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3 flex-1 min-h-0 overflow-hidden"
          >
            <div className="flex items-center gap-2 shrink-0">
              <ShoppingBasket size={13} className="text-acento" />
              <span className="text-[13px] font-bold text-primario">Pedidos Pendientes</span>
            </div>
            <div className="flex flex-col gap-2 flex-1 min-h-0">
              {loadingPedidos ? (
                <span className="text-[10px] text-gray-300">Cargando...</span>
              ) : pedidos.length === 0 ? (
                <span className="text-[10px] text-primario">Sin pedidos pendientes</span>
              ) : (
                pedidos.slice(0, 2).map((pedido) => (
                  <div key={pedido.id_pedido} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group hover:bg-red-50 transition-colors">
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
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-black text-gray-900 tabular-nums text-sm">
                        {pedido.total_estimado != null ? `${Number(pedido.total_estimado).toFixed(2)}€` : '—'}
                      </span>
                      <div className="p-2 rounded-full border border-gray-200 group-hover:bg-acento group-hover:border-acento transition-colors">
                        <ChevronRight size={12} className="text-gray-400 group-hover:text-white" strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
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
        .react-calendar__navigation { margin-bottom: 0.5rem !important; }
        .react-calendar__navigation button { font-size: 16px !important; min-width: 30px !important; }
       .react-calendar__tile { padding: 0.5em 0.3em !important; font-size: 10px !important; }
        .react-calendar__navigation__label { pointer-events: none; background: none !important; }
        .react-calendar__navigation__prev2-button,
        .react-calendar__navigation__next2-button { display: none !important; }
        .react-calendar {
          width: 100% !important;
          border: none !important;
          font-family: inherit;
          background: transparent;
        }
        .react-calendar__month-view__weekdays { display: none !important; }
        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus { background-color: transparent !important; color: #DC2626 !important; }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus { background-color: rgba(220,38,38,0.10) !important; color: #DC2626 !important; }
        .react-calendar__tile--active { !important background: #DC2626 !important; color: white !important; box-shadow: 0 4px 10px rgba(220,38,38,0.25); }
        .react-calendar__tile--now { background: #DC2626 !important; color: #fee2e2 !important; }
        .react-calendar__month-view__days { display: grid !important; grid-template-columns: repeat(7, 1fr); }
        .react-calendar__tile--active { border-radius: 8px !important; }
.react-calendar__tile--now { border-radius: 8px !important; }
.react-calendar__tile { border-radius: 8px !important; }
      `}</style>
    </div>
  );
};

export default HomePage;