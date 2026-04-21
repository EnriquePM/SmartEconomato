import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Buscador } from '../components/ui/Buscador';
import { ModalReceta } from "../components/recetas/ModalRecetas"; 
import { ModalDetalleReceta } from "../components/recetas/ModalDetalleReceta";
import { useRecetas } from "../hooks/useRecetas";
import { Plus } from "lucide-react";
import { RecetaCard } from '..//components/recetas/RecetaCard';
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
    <div className="p-8 min-h-screen font-sans">
      
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
       <Buscador 
                 value={busqueda} 
                   onChange={setBusqueda} 
                   placeholder="Buscar por nombre de la receta..." 
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
          <RecetaCard 
            key={receta.id_receta}
            receta={receta}
            onClick={(r) => setRecetaSeleccionada(r)}
            onEdit={(r) => openEditModal(r)}
          />
        ))}
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