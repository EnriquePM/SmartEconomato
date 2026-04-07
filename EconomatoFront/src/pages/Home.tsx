import { useState, useEffect } from "react";
import { 
  CloudSun, Clock, Calendar as CalendarIcon, 
  ChevronRight, Utensils, ShoppingCart, AlertCircle 
} from "lucide-react";

const HomePage = () => {
  const [fecha, setFecha] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setFecha(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);



  return (
    <div className="p-12 min-h-screen bg-[#fcfcfc] font-sans text-slate-800">
      
      {/* --- HEADER MINIMAL --- */}
      <header className="flex justify-between items-end mb-20">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-[0.3em] mb-2">Panel Principal</p>
          <h1 className="text-3xl font-light tracking-tight">
            Buenos días, <span className="font-semibold text-slate-900">Chef.</span>
          </h1>
        </div>

        <div className="flex items-center gap-8 text-slate-400">
          <div className="flex items-center gap-2">
            <CloudSun size={18} strokeWidth={1.5} />
            <span className="text-sm font-medium">22°C</span>
          </div>
          <div className="flex items-center gap-2 border-l border-slate-200 pl-8">
            <Clock size={18} strokeWidth={1.5} />
            <span className="text-sm font-medium tabular-nums uppercase">
              {fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-16">
        
        {/* COLUMNA IZQUIERDA: MENOS ES MÁS */}
        <div className="col-span-12 lg:col-span-4 space-y-12">
          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 mb-6">Agenda</h3>
            <div className="aspect-[4/3] bg-white rounded-xl border border-slate-100 flex items-center justify-center">
              <span className="text-[10px] text-slate-300 tracking-widest uppercase">Calendario</span>
            </div>
            
            <div className="mt-6">
              <div className="flex items-start gap-3 group cursor-pointer">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5"></div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Harina de Trigo</p>
                  <p className="text-xs text-slate-400">Caduca en 2 días</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* COLUMNA DERECHA: FLUJO LIMPIO */}
        <div className="col-span-12 lg:col-span-8 space-y-12">
          
          {/* RECETAS */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">Recetas</h3>
              <button className="text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Ver todo</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-100 border border-slate-100 rounded-lg overflow-hidden">
              {['Mousse de Gofio', 'Potaje de Berros'].map((receta) => (
                <div key={receta} className="bg-white p-6 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">{receta}</span>
                    <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PEDIDOS */}
          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 mb-6">Pedidos activos</h3>
            <div className="space-y-1">
              {[
                { id: '104', prov: 'Frutas Paco', total: '145.20', estado: 'Enviado' },
                { id: '105', prov: 'Makro', total: '412.00', estado: 'Borrador' }
              ].map((pedido, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-none">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-slate-300">#{pedido.id}</span>
                    <span className="text-sm font-medium text-slate-600">{pedido.prov}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xs text-slate-400">{pedido.total}€</span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                      pedido.estado === 'Enviado' ? 'text-emerald-500' : 'text-amber-500'
                    }`}>
                      {pedido.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default HomePage;