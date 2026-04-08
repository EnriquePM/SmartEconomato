import { useState, useEffect } from "react";
import { 
  CloudSun, Clock, Utensils, ShoppingBasket, 
  AlertCircle, ChevronRight, Printer
} from "lucide-react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const RECETAS_DESKTOP = [
  {
    id_receta: 1,
    nombre: "Mousse de Gofio",
    descripcion: "Postre tradicional canario con base de gofio de millo, nata montada y un toque de miel de palma de la Gomera.",
    cantidad_platos: 12,
    ingredientes_count: 8,
  },
  {
    id_receta: 2,
    nombre: "Potaje de Berros",
    descripcion: "Plato de cuchara emblemático con berros frescos, piña de millo, costilla salada y papas del país.",
    cantidad_platos: 20,
    ingredientes_count: 14,
  },
];

const RECETAS_EXTRA_TABLET = [
  {
    id_receta: 3,
    nombre: "Caldo de Pescado",
    descripcion: "Caldo marinero con vieja, cherne y papas del país. Base perfecta para arroces y sopas.",
    cantidad_platos: 8,
    ingredientes_count: 11,
  },
  {
    id_receta: 4,
    nombre: "Bienmesabe",
    descripcion: "Crema dulce de almendra canaria con azúcar, huevo, limón y canela. Clásico de la repostería insular.",
    cantidad_platos: 16,
    ingredientes_count: 6,
  },
];

const AVISOS = [
  { nombre: "Harina de Trigo",  badge: "Stock Crítico", color: "orange" },
  { nombre: "Aceite de Oliva",  badge: "Bajo Stock",    color: "yellow" },
  { nombre: "Huevos L",         badge: "Stock Crítico", color: "orange" },
  { nombre: "Leche Entera",     badge: "Caducidad Hoy", color: "red"    },
  { nombre: "Mantequilla",      badge: "Bajo Stock",    color: "yellow" },
];

interface Receta {
  id_receta: number;
  nombre: string;
  descripcion: string;
  cantidad_platos: number;
  ingredientes_count: number;
}

const RecetaCard = ({ receta }: { receta: Receta }) => (
  <div className="bg-white/40 backdrop-blur-md p-4 md:p-5 rounded-[2rem] md:rounded-[2.5rem] border border-white/70 hover:border-red-200/60 hover:bg-white/60 hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col">
    {/* MOBILE */}
    <div className="flex md:hidden items-center justify-between w-full">
      <h3 className="text-sm font-black text-gray-800 tracking-tight leading-none">{receta.nombre}</h3>
      <div className="bg-white/70 backdrop-blur-sm p-2 rounded-xl text-acento shadow-sm border border-white/80">
        <Printer size={16} strokeWidth={3} />
      </div>
    </div>

    {/* TABLET + DESKTOP */}
    <div className="hidden md:flex flex-col h-full">
      <div className="flex justify-between items-center mb-3 shrink-0">
        <span className="text-[9px] font-black bg-white/70 backdrop-blur-sm text-acento px-3 py-1 rounded-full uppercase tracking-tighter border border-white/80 shadow-sm">
          {receta.ingredientes_count} Ingredientes
        </span>
        <div className="p-2 rounded-xl bg-white/70 backdrop-blur-sm text-gray-300 group-hover:text-acento transition-colors shadow-sm border border-white/60 group-hover:border-red-100">
          <Printer size={14} strokeWidth={3} />
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-black text-gray-800 group-hover:text-acento transition-colors leading-tight tracking-tight">
          {receta.nombre}
        </h3>
        <p className="text-gray-400 text-xs mt-1.5 line-clamp-2 font-medium leading-relaxed italic">
          {receta.descripcion}
        </p>
      </div>

      <div className="mt-3 pt-3 border-t border-white/50 flex justify-between items-center shrink-0">
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-gray-300 uppercase italic">Raciones</span>
          <span className="text-sm font-black text-gray-700">{receta.cantidad_platos} pax</span>
        </div>
        <div className="flex items-center gap-2 group/btn">
          <span className="text-acento font-black text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
            Imprimir
          </span>
          <div className="bg-white/70 backdrop-blur-sm p-2.5 rounded-lg shadow-sm group-hover:bg-acento transition-colors border border-white/60">
            <Printer size={14} className="text-acento group-hover:text-white" strokeWidth={3} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const HomePage = () => {
  const [fecha, setFecha] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setFecha(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full flex flex-col animate-fade-in-up overflow-hidden px-4 relative">

      {/* FONDO GLASSMORPHISM CÁLIDO */}
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
      <header className="flex justify-between items-center mb-4 md:mb-6 shrink-0 flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Buenos días, Chef.
          </h1>
        </div>

        <div className="flex items-center gap-5 md:gap-10">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Clima</span>
            <div className="flex items-center gap-2">
              <CloudSun size={20} className="text-gray-400" strokeWidth={2} />
              <span className="text-lg md:text-xl font-[500] text-gray-500 tracking-tighter">22°C</span>
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
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 min-h-0 mb-4 md:mb-6">

        {/* COLUMNA IZQUIERDA */}
        <div className="lg:col-span-4 flex flex-col gap-4 md:gap-6 min-h-0">

          {/* CALENDARIO */}
          <section className="bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-white/70 p-5 md:p-6 shadow-sm flex flex-col shrink-0 overflow-hidden">
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
          <section className="bg-white/50 backdrop-blur-md rounded-[2rem] border border-white/70 p-4 flex flex-col lg:flex-1 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 mb-3 shrink-0">
              <AlertCircle size={12} className="text-orange-500" />
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Avisos urgentes</span>
            </div>
            <div className="flex flex-col gap-2 lg:flex-1 lg:justify-between">
              {AVISOS.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl border backdrop-blur-sm
                    ${item.color === "orange" ? "bg-orange-50/50 border-orange-200/40" :
                      item.color === "red"    ? "bg-red-50/50 border-red-200/40" :
                                               "bg-yellow-50/50 border-yellow-200/40"}`}
                >
                  <span className="text-[11px] font-bold text-gray-600">{item.nombre}</span>
                  <span className={`text-[8px] font-black uppercase bg-white/80 px-2 py-0.5 rounded-md shadow-sm tracking-tighter
                    ${item.color === "orange" ? "text-orange-600" :
                      item.color === "red"    ? "text-red-600" :
                                               "text-yellow-600"}`}>
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="lg:col-span-8 flex flex-col gap-4 md:gap-6 min-h-0">

          {/* RECETAS */}
          <section className="bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-white/70 p-5 md:p-8 flex flex-col flex-1 min-h-0 overflow-hidden shadow-sm">
            <div className="flex justify-between items-center mb-4 md:mb-5 shrink-0">
              <div className="flex items-center gap-2">
                <Utensils size={14} className="text-acento" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recetario Destacado</span>
              </div>
              <button className="text-[10px] font-black text-acento uppercase tracking-widest hover:underline">Ver todo</button>
            </div>

            <div className="flex-1 min-h-0">
              {/* Desktop */}
              <div className="hidden lg:grid lg:grid-cols-2 gap-5 h-full">
                {RECETAS_DESKTOP.map((r) => <RecetaCard key={r.id_receta} receta={r} />)}
              </div>
              {/* Tablet */}
              <div className="hidden md:grid lg:hidden grid-cols-2 gap-4">
                {[...RECETAS_DESKTOP, ...RECETAS_EXTRA_TABLET].map((r) => <RecetaCard key={r.id_receta} receta={r} />)}
              </div>
              {/* Mobile */}
              <div className="grid md:hidden grid-cols-1 gap-3">
                {RECETAS_DESKTOP.map((r) => <RecetaCard key={r.id_receta} receta={r} />)}
              </div>
            </div>
          </section>

          {/* PEDIDOS PENDIENTES */}
          <section className="bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-white/70 p-5 md:p-8 flex flex-col shrink-0 overflow-hidden lg:h-44 shadow-sm">
            <div className="flex justify-between items-center mb-4 md:mb-6 shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBasket size={14} className="text-acento" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pedidos Pendientes</span>
              </div>
              <button className="text-[10px] font-black text-acento uppercase tracking-widest hover:underline">Gestionar</button>
            </div>

            <div className="flex-1 min-h-0 flex items-center">
              <div className="w-full flex items-center justify-between p-3 md:p-4 bg-white/40 backdrop-blur-sm border border-white/60 rounded-[2rem] hover:bg-white/60 transition-all cursor-pointer group">
                <div className="flex items-center gap-3 md:gap-4">
                  <span className="font-mono text-[10px] text-gray-300 font-bold tracking-tighter">#104</span>
                  <div>
                    <span className="text-sm font-black text-gray-700 tracking-tight block leading-none">Frutas Paco S.L.</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-1 block">Entrega hoy</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 md:gap-6">
                  <span className="font-black text-gray-900 tabular-nums text-sm md:text-base">145.20€</span>
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-[9px] font-black px-2 md:px-3 py-1 rounded-full tracking-widest uppercase bg-green-100/80 text-green-700">
                      ENVIADO
                    </span>
                    <div className="bg-white/70 backdrop-blur-sm p-2 rounded-lg shadow-sm group-hover:bg-acento transition-colors border border-white/60">
                      <ChevronRight size={12} className="text-acento group-hover:text-white" strokeWidth={3} />
                    </div>
                  </div>
                </div>
              </div>
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
      `}</style>
    </div>
  );
};

export default HomePage;