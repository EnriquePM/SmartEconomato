// src/components/ModalDetalleReceta.tsx
import { useState } from "react";
import { X, ChefHat, Users, ClipboardList, CheckCircle2, Circle } from "lucide-react";
import { Receta } from "../models/Receta";

interface Props {
  receta: Receta;
  onClose: () => void;
}

export const ModalDetalleReceta = ({ receta, onClose }: Props) => {
  // Estado para el escalado de raciones
  const [racionesDeseadas, setRacionesDeseadas] = useState(receta.cantidad_platos);
  const [ingredientesCheck, setIngredientesCheck] = useState<number[]>([]);

  // Regla de tres: (Cantidad Original / Raciones Originales) * Raciones Deseadas
  const calcularCantidad = (cantidadOriginal: number) => {
    const calculo = (cantidadOriginal / receta.cantidad_platos) * racionesDeseadas;
    return calculo.toFixed(2);
  };

  const toggleCheck = (id: number) => {
    setIngredientesCheck(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-0 md:p-4">
      <div className="bg-white w-full h-full md:h-auto md:max-w-5xl md:rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-fade-in">
        
        {/* HEADER GIGANTE */}
        <div className="relative h-48 bg-gray-900 flex items-end p-8">
            <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            
            <div className="relative z-10 w-full flex justify-between items-end">
                <div>
                    <span className="bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">Recetario Profesional</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white mt-2 italic tracking-tight">{receta.nombre}</h2>
                </div>
                <button onClick={onClose} className="mb-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all">
                    <X size={32} />
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12">
            
            {/* COLUMNA IZQUIERDA: CONFIGURACIÓN Y MISE EN PLACE (5/12) */}
            <div className="lg:col-span-5 p-8 bg-gray-50 border-r border-gray-100">
                <div className="mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-4 text-gray-400">
                        <Users size={20} />
                        <span className="font-bold uppercase text-xs tracking-widest">Ajustar Raciones</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <input 
                            type="number" 
                            value={racionesDeseadas}
                            onChange={(e) => setRacionesDeseadas(Number(e.target.value))}
                            className="w-full text-4xl font-black text-blue-600 focus:outline-none"
                        />
                        <span className="text-xl font-bold text-gray-400">Platos</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">* Las cantidades se recalculan automáticamente</p>
                </div>

                <h3 className="flex items-center gap-2 text-xl font-black text-gray-800 mb-6 uppercase tracking-tight">
                    <ClipboardList className="text-blue-600" /> Mise en Place
                </h3>
                
                <div className="space-y-3">
                    {receta.receta_ingrediente.map((ri) => (
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
                                    {ri.ingrediente?.nombre}
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-black text-blue-600">{calcularCantidad(ri.cantidad)}</span>
                                <span className="ml-1 text-xs font-bold text-gray-400 uppercase">{ri.ingrediente?.unidad_medida}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* COLUMNA DERECHA: ELABORACIÓN (7/12) */}
            <div className="lg:col-span-7 p-8 md:p-12 bg-white">
                <h3 className="flex items-center gap-2 text-xl font-black text-gray-800 mb-8 uppercase tracking-tight">
                    <ChefHat className="text-blue-600" /> Elaboración Paso a Paso
                </h3>
                
                <div className="prose prose-blue max-w-none">
                    <p className="text-xl leading-relaxed text-gray-600 font-medium whitespace-pre-line">
                        {receta.descripcion || "No hay instrucciones detalladas para esta receta."}
                    </p>
                </div>

                <div className="mt-12 p-8 bg-blue-50 rounded-[2.5rem] border-2 border-dashed border-blue-200 flex items-center gap-6">
                    <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg">
                        <ChefHat size={32} />
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-blue-900 uppercase tracking-tight">¿Listo para empezar?</h4>
                        <p className="text-blue-700/70 font-medium">Recuerda mantener limpia tu zona de trabajo.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};