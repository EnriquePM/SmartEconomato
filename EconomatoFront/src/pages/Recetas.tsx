import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { ModalReceta } from "./ModalRecetas"; 

const RecetasPage = () => {
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);

  // Datos de prueba (Hardcodeados para ver el diseño)
  const [recetas, setRecetas] = useState([
    {
      id_receta: 1,
      nombre: "Mousse de Chocolate",
      descripcion: "Postre clásico con base de clara montada y chocolate 70%.",
      cantidad_platos: 10,
      num_ingredientes: 5
    },
    {
      id_receta: 2,
      nombre: "Salsa Brava",
      descripcion: "Salsa picante tradicional para patatas fritas.",
      cantidad_platos: 50,
      num_ingredientes: 8
    },
    {
      id_receta: 3,
      nombre: "Masa de Pizza Neopolitana",
      descripcion: "Fermentación de 48h con harina fuerza 00.",
      cantidad_platos: 20,
      num_ingredientes: 4
    }
  ]);

  // Filtrado por nombre
  const recetasFiltradas = recetas.filter(r => 
    r.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-8  min-h-screen font-sans">
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

      {/* FILTROS: Adaptado a tu componente Input */}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recetasFiltradas.map((receta) => (
          <div 
            key={receta.id_receta}
            className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
          >
            

            <div className="flex justify-between items-start mb-6 relative z-10">
              
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full uppercase tracking-wider">
                  {receta.num_ingredientes} Items
                </span>
              </div>
            </div>

            <h3 className="text-2xl font-black text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                {receta.nombre}
            </h3>
            <p className="text-gray-400 text-sm font-medium line-clamp-2 leading-relaxed mb-8">
                {receta.descripcion}
            </p>
        
          </div>
        ))}
      </div>

      {/* MODAL DE CREACIÓN */}
      {modalAbierto && (
        <ModalReceta 
          onClose={() => setModalAbierto(false)} 
          ingredientesDB={[]} // Aquí pasarás tus ingredientes cuando los tengas
        />
      )}
    </div>
  );
};

export default RecetasPage;