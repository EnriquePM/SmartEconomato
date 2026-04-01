// src/pages/Recetas.tsx
import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { ModalReceta } from "./ModalRecetas"; 

// Interfaz para la Receta que viene de la Base de Datos
interface RecetaBD {
  id_receta: number;
  nombre: string;
  descripcion: string;
  cantidad_platos: number;
  receta_ingrediente?: any[]; 
}

const RecetasPage = () => {
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  
  // Estado para guardar las recetas que vienen de Prisma
  const [recetas, setRecetas] = useState<RecetaBD[]>([]);
  const [cargando, setCargando] = useState(true);

  // FUNCIÓN PARA TRAER RECETAS DEL BACKEND (GET)
const fetchRecetas = async () => {
    try {
      setCargando(true);
      const token = localStorage.getItem('token'); 

      const response = await fetch("http://localhost:3000/api/recetas", {
        headers: {
          "Authorization": `Bearer ${token}` // <--- EL PASE VIP
        }
      });
      
      if (!response.ok) throw new Error("Error obteniendo recetas");
      
      const data = await response.json();
      setRecetas(data);
    } catch (error) {
      console.error("Error al traer recetas:", error);
    } finally {
      setCargando(false);
    }
  };

  // Traer las recetas al cargar la página por primera vez
  useEffect(() => {
    fetchRecetas();
  }, []);

  // Filtrado por nombre (Buscador superior)
  const recetasFiltradas = recetas.filter(r => 
    r.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-8 min-h-screen font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Libro de Recetas</h1>
          <p className="text-gray-500 mt-1">
            Gestión de elaboraciones
          </p>
        </div>
        <Button 
          variant="secundario" 
          className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-pill font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95 w-full md:w-fit"
          onClick={() => setModalAbierto(true)}
        >
          + Crear Receta
        </Button>
      </div>

      {/* FILTROS (Buscador) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
            <Input 
              type="text"
              placeholder="Buscar por nombre de receta..." 
              value={busqueda}
              onChange={(v) => setBusqueda(v)}
              className="pl-12"
            />
        </div>
      </div>

      {/* GRID DE RECETAS */}
      {cargando ? (
        <div className="text-center text-gray-500 py-10 font-bold">Cargando recetario...</div>
      ) : recetasFiltradas.length === 0 ? (
        <div className="text-center text-gray-400 py-10">No hay recetas todavía. ¡Haz clic en '+ Crear Receta' para empezar!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recetasFiltradas.map((receta) => (
            <div 
              key={receta.id_receta}
              className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full uppercase tracking-wider">
                    {/* Dependiendo de lo que devuelva tu backend, muestra raciones o cantidad de ingredientes */}
                    {receta.receta_ingrediente && receta.receta_ingrediente.length > 0 
                      ? `${receta.receta_ingrediente.length} Ingredientes` 
                      : `${receta.cantidad_platos} Raciones`}
                  </span>
                </div>
              </div>

              <h3 className="text-2xl font-black text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {receta.nombre}
              </h3>
              <p className="text-gray-400 text-sm font-medium line-clamp-2 leading-relaxed mb-8">
                  {receta.descripcion || "Sin descripción"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DE CREACIÓN */}
      {modalAbierto && (
        <ModalReceta 
          onClose={() => setModalAbierto(false)} 
          // Pasamos la función fetchRecetas para que el modal la ejecute al terminar de guardar
          onRecetaCreada={fetchRecetas} 
        />
      )}
    </div>
  );
};

export default RecetasPage;