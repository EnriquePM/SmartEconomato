import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { ModalReceta } from "./ModalRecetas"; 
import { ModalDetalleReceta } from "../components/ModalDetalleReceta";
import { useRecetas } from "../hooks/useRecetas";
import { Plus } from "lucide-react";


import type { Receta } from "../models/Receta";

const RecetasPage = () => {
  const { recetasFiltradas, busqueda, setBusqueda, cargando, error, refrescar } = useRecetas();
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState<Receta | null>(null);
  const [recetaEnEdicion, setRecetaEnEdicion] = useState<Receta | null>(null);

  const openCreateModal = () => {
    setRecetaEnEdicion(null);
    setModalCrearAbierto(true);
  };

  const openEditModal = (receta: Receta) => {
    setRecetaEnEdicion(receta);
    setModalCrearAbierto(true);
  };

  const handleRecetaGuardada = () => {
    refrescar();
    setModalCrearAbierto(false);
    setRecetaEnEdicion(null);
  };

  return (
    <div className="p-8 min-h-screen font-sans bg-gray-50/50">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Libro de Recetas</h1>
          <p className="text-gray-500 mt-1">Gestión de elaboraciones</p>
        </div>
        <Button 
          variant="primario"      
          onClick={openCreateModal}
        >
          <Plus size={16} color="#ffffff" strokeWidth={3} />
          NUEVA RECETA
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

      {error && !cargando && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(receta);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-200"
                >
                  <Pencil size={12} /> Editar
                </button>
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
          onEdit={(receta) => {
            setRecetaSeleccionada(null);
            openEditModal(receta);
          }}
          onRecetaHecha={() => {
            setRecetaSeleccionada(null);
            refrescar();
          }}
        />
      )}

      {modalCrearAbierto && (
        <ModalReceta 
          onClose={() => setModalCrearAbierto(false)} 
          onRecetaCreada={handleRecetaGuardada}
          recetaInicial={recetaEnEdicion}
        />
      )}
    </div>
  );
};

export default RecetasPage;