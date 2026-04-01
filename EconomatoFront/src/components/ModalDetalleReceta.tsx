// src/components/ModalDetalleReceta.tsx
import { useState } from "react";
import { X, ChefHat, Users, ClipboardList, CheckCircle2, Circle } from "lucide-react";

// 1. DEFINIMOS LAS INTERFACES AQUÍ MISMO PARA EVITAR ERRORES
interface IngredienteDetalle {
  nombre: string;
  unidad_medida: string;
}

interface RecetaIngrediente {
  id_ingrediente: number;
  cantidad: number;
  ingrediente?: IngredienteDetalle; 
}

interface Receta {
  id_receta: number;
  nombre: string;
  descripcion: string;
  cantidad_platos: number;
  receta_ingrediente?: RecetaIngrediente[];
}

interface ModalDetalleProps {
  receta: Receta | any; 
  onClose: () => void;
}

export const ModalDetalleReceta = ({ receta, onClose }: ModalDetalleProps) => {
  const [racionesDeseadas, setRacionesDeseadas] = useState(receta.cantidad_platos || 1);
  const [ingredientesCheck, setIngredientesCheck] = useState<number[]>([]);

  // Regla de tres para las cantidades
  const calcularCantidad = (cantidadOriginal: number) => {
    const platosOriginales = receta.cantidad_platos || 1;
    const calculo = (cantidadOriginal / platosOriginales) * racionesDeseadas;
    return Number.isInteger(calculo) ? calculo : calculo.toFixed(2);
  };

  const toggleCheck = (id: number) => {
    setIngredientesCheck(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const listaIngredientes = receta.receta_ingrediente || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-0 md:p-4 animate-fade-in">
      {/* Añadido rounded-t-[3rem] para que la parte superior sea redonda también en el modal */}
      <div className="bg-white w-full h-full md:h-[90vh] md:max-w-5xl md:rounded-[3rem] shadow-2xl flex flex-col overflow-hidden">
        
        {/* HEADER ROJO SÓLIDO */}
        <div className="relative h-32 bg-[#C00000] flex items-center px-8 shrink-0 rounded-t-[3rem] md:rounded-t-[3rem]">
            
            <div className="relative z-10 w-full flex justify-between items-center">
                <div>
                    {/* Título más alto y sin cursiva para un look más "Panel Principal" */}
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                      {receta.nombre || "Receta sin nombre"}
                    </h2>
                </div>
                {/* Botón de cerrar alineado con el título, fondo blanco y X roja */}
                <button onClick={onClose} className="p-3 bg-white text-[#C00000] hover:bg-gray-100 rounded-full shadow-md transition-all active:scale-95">
                    <X size={28} strokeWidth={3} />
                </button>
            </div>
        </div>

        {/* CUERPO DIVIDIDO EN DOS COLUMNAS */}
        <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row">
            
            {/* COLUMNA IZQUIERDA: CONFIGURACIÓN Y PREPARACIÓN */}
            <div className="w-full lg:w-5/12 p-8 bg-gray-50 border-r border-gray-100 flex flex-col">
                
                {/* Caja de Raciones */}
                <div className="mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-200 shrink-0">
                    <div className="flex items-center gap-3 mb-4 text-gray-400">
                        <Users size={20} />
                        <span className="font-bold uppercase text-xs tracking-widest">Ajustar Raciones</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <input 
                            type="number" 
                            min="1"
                            value={racionesDeseadas}
                            onChange={(e) => setRacionesDeseadas(Number(e.target.value) || 1)}
                            className="w-24 bg-gray-100 px-4 py-2 rounded-xl text-4xl font-black text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-xl font-bold text-gray-400">Platos</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-3 font-medium">* Las cantidades se recalcularán solas</p>
                </div>

                {/* Preparación Previa */}
                <h3 className="flex items-center gap-2 text-xl font-black text-gray-800 mb-6 uppercase tracking-tight">
                    <ClipboardList className="text-blue-600" /> Preparación Previa
                </h3>
                
                {/* Lista de ingredientes */}
                <div className="space-y-3 overflow-y-auto pr-2 pb-8 lg:pb-0">
                    {listaIngredientes.length === 0 ? (
                        <p className="text-gray-400 text-sm font-medium italic p-4 text-center bg-gray-100 rounded-2xl">No hay ingredientes registrados.</p>
                    ) : (
                        listaIngredientes.map((ri: any) => (
                            <div 
                                key={ri.id_ingrediente}
                                onClick={() => toggleCheck(ri.id_ingrediente)}
                                className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                                    ingredientesCheck.includes(ri.id_ingrediente) 
                                    ? 'bg-green-50 border-green-200 opacity-60' 
                                    : 'bg-white border-transparent shadow-sm hover:border-gray-200'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    {ingredientesCheck.includes(ri.id_ingrediente) 
                                        ? <CheckCircle2 className="text-green-500" /> 
                                        : <Circle className="text-gray-300" />
                                    }
                                    <span className={`font-bold ${ingredientesCheck.includes(ri.id_ingrediente) ? 'line-through text-green-700' : 'text-gray-700'}`}>
                                        {ri.ingrediente?.nombre || "Ingrediente desconocido"}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-black text-blue-600">{calcularCantidad(ri.cantidad || 0)}</span>
                                    <span className="ml-1 text-xs font-bold text-gray-400 uppercase">{ri.ingrediente?.unidad_medida || "ud"}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* COLUMNA DERECHA: ELABORACIÓN */}
            <div className="w-full lg:w-7/12 p-8 md:p-12 bg-white flex flex-col">
                <h3 className="flex items-center gap-2 text-xl font-black text-gray-800 mb-8 uppercase tracking-tight">
                    <ChefHat className="text-blue-600" /> Paso a Paso
                </h3>
                
                {/* Al tener flex-1, esta caja de texto tomará todo el alto disponible en la columna */}
                <div className="prose prose-blue max-w-none flex-1">
                    <p className="text-lg md:text-xl leading-relaxed text-gray-600 font-medium whitespace-pre-line">
                        {receta.descripcion || "No hay instrucciones detalladas para esta receta todavía. ¡Toca improvisar!"}
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};