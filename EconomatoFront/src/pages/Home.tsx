// src/pages/Home.tsx
import { Link } from "react-router-dom";
import { 
  Users, 
  ShoppingCart, 
  Package, 
  Archive, 
  ArrowRight, 
  Clock, 
  AlertTriangle, 
  CheckCircle2 
} from "lucide-react";

const Home = () => {
  // --- DATOS FALSOS PARA PROBAR EL DISEÑO ---
  const accesos = [
    { titulo: "Gestión Usuarios", icono: Users, color: "bg-blue-500", ruta: "/admin/usuarios" },
    { titulo: "Nuevo Pedido", icono: ShoppingCart, color: "bg-orange-500", ruta: "/pedidos" },
    { titulo: "Inventario", icono: Package, color: "bg-emerald-500", ruta: "/inventario" }, // Ruta inventada por ahora
    { titulo: "Entrada Stock", icono: Archive, color: "bg-purple-500", ruta: "/ingreso-general" },
  ];

  const actividadReciente = [
    { id: 1, titulo: "Pedido #104 - 1º Cocina", sub: "Pendiente de validación", tipo: "pedido", estado: "warning", hora: "Hace 10 min" },
    { id: 2, titulo: "Entrada: Harina de Fuerza", sub: "+50 Kg (Makro)", tipo: "stock", estado: "success", hora: "Hace 2h" },
    { id: 3, titulo: "Alerta: Aceite Oliva", sub: "Stock crítico (2L restantes)", tipo: "alerta", estado: "danger", hora: "Hace 4h" },
    { id: 4, titulo: "Usuario Nuevo", sub: "Juan Pérez (Alumno)", tipo: "user", estado: "info", hora: "Ayer" },
    { id: 5, titulo: "Pedido #103 - Profe Pastelería", sub: "Validado y entregado", tipo: "pedido", estado: "success", hora: "Ayer" },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50/50 p-6 space-y-8 animate-fade-in-up">
      
      {/* HEADER SIMPLE */}
      <div>
        <h1 className="text-3xl font-black text-gray-800 tracking-tight">Panel Principal</h1>
        <p className="text-gray-500 font-medium">Resumen de actividad del Economato</p>
      </div>

      {/* 1. ZONA SUPERIOR: ACCESOS DIRECTOS (Tus cuadrados rojos del Paint) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {accesos.map((item, idx) => (
          <Link 
            key={idx} 
            to={item.ruta}
            className="group relative bg-white h-48 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center gap-5 cursor-pointer overflow-hidden"
          >
            {/* Fondo decorativo sutil */}
            <div className={`absolute top-0 left-0 w-full h-2 ${item.color}`} />
            
            <div className={`p-5 rounded-2xl ${item.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <item.icono size={32} strokeWidth={2} />
            </div>
            
            <span className="font-bold text-gray-700 text-lg group-hover:text-black tracking-tight">
              {item.titulo}
            </span>
          </Link>
        ))}
      </section>

      {/* 2. ZONA INFERIOR: RESUMEN (Tu rectángulo grande) */}
      <section className="bg-white rounded-[2.5rem] shadow-lg shadow-gray-100/50 border border-gray-100 p-8 min-h-[400px]">
        
        <div className="flex justify-between items-center mb-8 px-2">
          <h2 className="text-xl font-extrabold text-gray-800 flex items-center gap-3">
            <Clock className="text-gray-400" /> 
            Actividad Reciente
          </h2>
          <button className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors flex items-center gap-2">
            Ver todo el historial <ArrowRight size={16} />
          </button>
        </div>

        {/* LISTA DE ACTIVIDAD (Simulando datos) */}
        <div className="space-y-4">
          {actividadReciente.map((item) => (
            <div key={item.id} className="group flex items-center justify-between p-5 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 rounded-2xl transition-all duration-200 hover:shadow-md cursor-default">
              
              <div className="flex items-center gap-5">
                {/* Icono dinámico según tipo */}
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center shadow-sm
                  ${item.estado === 'warning' ? 'bg-orange-100 text-orange-600' : ''}
                  ${item.estado === 'success' ? 'bg-green-100 text-green-600' : ''}
                  ${item.estado === 'danger' ? 'bg-red-100 text-red-600' : ''}
                  ${item.estado === 'info' ? 'bg-blue-100 text-blue-600' : ''}
                `}>
                  {item.tipo === 'pedido' && <ShoppingCart size={20} />}
                  {item.tipo === 'stock' && <Package size={20} />}
                  {item.tipo === 'alerta' && <AlertTriangle size={20} />}
                  {item.tipo === 'user' && <Users size={20} />}
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{item.titulo}</h4>
                  <p className="text-sm text-gray-500 font-medium">{item.sub}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                 <span className="text-xs font-bold text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                    {item.hora}
                 </span>
                 {item.estado === 'warning' && <span className="text-xs font-bold text-orange-500">Requiere acción</span>}
              </div>

            </div>
          ))}
        </div>

      </section>
    </div>
  );
};

export default Home;
