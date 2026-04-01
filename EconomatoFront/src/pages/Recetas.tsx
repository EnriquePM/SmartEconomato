import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { ModalReceta } from "./ModalRecetas"; 
import { ModalDetalleReceta } from "../components/ModalDetalleReceta";
import { useRecetas } from "../hooks/useRecetas";

const RecetasPage = () => {
  // 👇 AQUÍ ESTÁ LA MAGIA. Llamamos a nuestro Hook y él nos da todo ya masticado.
  const { recetasFiltradas, busqueda, setBusqueda, cargando, refrescar } = useRecetas();
  
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState<any>(null);

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
          onChange={(v: string) => setBusqueda(v)}
          className="pl-4"
        />
      </div>

      {/* ESTADO DE CARGA */}
      {cargando && (
        <div className="text-center py-10 text-gray-500 font-bold animate-pulse">
          Cargando el recetario...
        </div>
      )}

      {/* LISTADO DE TARJETAS */}
      {!cargando && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recetasFiltradas.map((receta) => (
            <div 
              key={receta.id_receta}
              onClick={() => setRecetaSeleccionada(receta)}
              className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="flex justify-between mb-4">
                <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase">
                  {receta.receta_ingrediente?.length || 0} Ingredientes
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

          {/* Mensaje si no hay recetas */}
          {recetasFiltradas.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400 font-medium">
              No se han encontrado recetas.
            </div>
          )}
        </div>
      )}

      {/* --- MODALES --- */}

      {recetaSeleccionada && (
        <ModalDetalleReceta 
          receta={recetaSeleccionada} 
          onClose={() => setRecetaSeleccionada(null)} 
        />
      )}

      {modalCrearAbierto && (
        <ModalReceta 
          onClose={() => setModalCrearAbierto(false)} 
          onRecetaCreada={() => {
            refrescar(); // Volvemos a pedir las recetas al back
            setModalCrearAbierto(false); // Cerramos el modal
          }} 
        />
      )}
    </div>
  );
};

export default RecetasPage;