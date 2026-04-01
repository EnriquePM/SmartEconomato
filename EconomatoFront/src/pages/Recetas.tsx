// src/pages/Recetas.tsx
import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { ModalReceta } from "./ModalRecetas"; 
import { ModalDetalleReceta } from "../components/ModalDetalleReceta";

// --- LA RECETA QUE APARECERÁ "POR DEFECTO" ---
const RECETA_DE_PRUEBA = {
  id_receta: 1,
  nombre: "Sopa de Tomate Pro",
  descripcion: "1 tomate, 2litros de agua, 1 piña",
  cantidad_platos: 4,
  receta_ingrediente: [
    { id_ingrediente: 101, cantidad: 1000, ingrediente: { nombre: "Tomate Pera", unidad_medida: "g" } },
    { id_ingrediente: 102, cantidad: 200, ingrediente: { nombre: "Cebolla", unidad_medida: "g" } },
    { id_ingrediente: 103, cantidad: 2, ingrediente: { nombre: "Ajo", unidad_medida: "ud" } }
  ]
};

const RecetasPage = () => {
  const [busqueda, setBusqueda] = useState("");
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  
  // 1. Empezamos con el detalle CERRADO (null)
  const [recetaSeleccionada, setRecetaSeleccionada] = useState<any>(null);
  
  // 2. Cargamos la receta de prueba directamente en el listado
  const [recetas, setRecetas] = useState<any[]>([RECETA_DE_PRUEBA]);
  const [cargando, setCargando] = useState(false); // Ponemos false para que no salga el "Cargando..."

  // Dejamos el fetch aquí por si en el futuro arreglas el back, pero ahora no hará nada
  const fetchRecetas = async () => {
   
    try {
      const token = localStorage.getItem('token'); 
      const response = await fetch("http://localhost:3000/api/recetas", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRecetas([RECETA_DE_PRUEBA, ...data]); // Mezclamos la de prueba con las reales
      }
    } catch (e) { console.log("Back aún no disponible"); }

  };

  useEffect(() => {
    fetchRecetas();
  }, []);

  const recetasFiltradas = recetas.filter(r => 
    r.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-8 min-h-screen font-sans bg-gray-50/50">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Libro de Recetas</h1>
          <p className="text-gray-500 mt-1">Gestión de elaboraciones</p>
        </div>
        <Button 
          variant="secundario" 
          className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-red-700 shadow-lg transition-all"
          onClick={() => setModalCrearAbierto(true)}
        >
          + CREAR RECETA
        </Button>
      </div>

      {/* BUSCADOR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
        <Input 
          type="text"
          placeholder="Buscar por nombre de receta..." 
          value={busqueda}
          onChange={(v) => setBusqueda(v)}
          className="pl-4"
        />
      </div>

      {/* LISTADO DE TARJETAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recetasFiltradas.map((receta) => (
          <div 
            key={receta.id_receta}
            // 👇 AL HACER CLIC AQUÍ ES CUANDO SE ABRE LA INFO
            onClick={() => setRecetaSeleccionada(receta)}
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
          >
            <div className="flex justify-between mb-4">
              <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase">
                {receta.receta_ingrediente?.length} Ingredientes
              </span>
            </div>
            <h3 className="text-2xl font-black text-gray-800 group-hover:text-blue-600 transition-colors">
                {receta.nombre}
            </h3>
            <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                {receta.descripcion}
            </p>
            <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400">Raciones: {receta.cantidad_platos}</span>
                <span className="text-blue-600 font-bold text-xs">VER DETALLES →</span>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODALES --- */}

      {/* Modal de Modo Cocina (Solo se abre si haces clic) */}
      {recetaSeleccionada && (
        <ModalDetalleReceta 
          receta={recetaSeleccionada} 
          onClose={() => setRecetaSeleccionada(null)} 
        />
      )}

      {/* Modal de Creación */}
      {modalCrearAbierto && (
        <ModalReceta 
          onClose={() => setModalCrearAbierto(false)} 
          onRecetaCreada={fetchRecetas} 
        />
      )}
    </div>
  );
};

export default RecetasPage;