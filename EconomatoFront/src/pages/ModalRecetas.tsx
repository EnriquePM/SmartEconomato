import { X, Search, Trash2, ChefHat, ShoppingCart, Plus, FileText } from "lucide-react";
import { useRecetaForm } from "../hooks/useRecetasForm";
import { Button } from "../components/ui/Button"; 
import { Input } from "../components/ui/Input";  

interface ModalRecetaProps {
  onClose: () => void;
  onRecetaCreada: () => void; 
}

export const ModalReceta = ({ onClose, onRecetaCreada }: ModalRecetaProps) => {
  const { form, lista, buscador, acciones } = useRecetaForm(onRecetaCreada);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-6xl shadow-2xl flex flex-col h-[90vh] overflow-hidden animate-fade-in-up border border-gray-100">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-white shrink-0">
          <div className="flex items-center p-2.5 gap-3">
            <div className="bg-acento p-2.5 rounded-xl text-white shadow-lg">
              <ChefHat size={25} color="#ffffff" strokeWidth={2} />
            </div>
            <div>
                <h2 className="text-lg font-black text-gray-900 tracking-tight leading-none">Nueva Receta</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Ingredientes y Procesos</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all">
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden bg-white">
          
          {/* COLUMNA IZQUIERDA: INGREDIENTES */}
          <div className="w-1/2 border-r border-gray-100 p-8 flex flex-col gap-6 overflow-hidden">
            <div className="flex gap-4 shrink-0">
                <div className="flex-1">
                    <Input 
                        label="Nombre de la Receta"
                        type="text"
                        placeholder="Ej: Cheesecake"
                        value={form.nombre}
                        onChange={(val) => form.setNombre(val)}
                    />
                </div>
                <div className="w-28">
                    <Input 
                        label="Raciones"
                        type="number"
                        placeholder="0"
                        value={form.raciones}
                        onChange={(val) => form.setRaciones(val)}
                        min={1}
                    />
                </div>
            </div>

            {/* BUSCADOR */}
            <div className="shrink-0 mt-2">
                <div className="flex items-center gap-2 px-1 mb-2">
                  <Plus size={16} className="text-gray-900" />
                  <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Añade Ingredientes</h3>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 z-10" size={18} />
                    <Input 
                      type="text"
                      placeholder="Escribe para buscar ingredientes..."
                      value={buscador.busqueda}
                      onChange={(val) => {
                        buscador.setBusqueda(val);
                      }}
                      className="pl-12 !bg-gray-50/50 !border-none"
                    />
                  </div>
                    {buscador.busqueda.length > 1 && (
                        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                            {buscador.sugerencias.map((ing: any) => (
                                <button
                                    key={ing.id_ingrediente}
                                    className="w-full flex justify-between items-center px-6 py-4 hover:bg-gray-50 text-left border-b border-gray-50 last:border-none"
                                    onClick={() => {
                                        lista.agregarIngrediente(ing);
                                        buscador.setBusqueda("");
                                    }}
                                >
                                    <span className="font-bold text-gray-700 text-sm">{ing.nombre}</span>
                                    <Plus size={16} className="text-gray-900" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex-1 bg-gray-50 rounded-[2rem] p-5 overflow-hidden flex flex-col border border-gray-100">
                <div className="flex items-center gap-2 mb-4 px-2 shrink-0">
                    <ShoppingCart size={14} className="text-gray-400" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ingredientes seleccionados</span>
                </div>
                <div className="flex-1 overflow-y-auto pr-1 space-y-2 scrollbar-global">
                    {lista.ingredientes.map((ing: any) => (
                        <div key={ing.id_ingrediente} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-black text-gray-800 truncate leading-none">{ing.nombre}</p>
                                <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">{ing.unidad_medida}</p>
                            </div>
                            <div className="w-20">
                                <input 
                                    type="number"
                                    value={ing.cantidad}
                                    onChange={(e) => lista.actualizarIngrediente(ing.id_ingrediente, 'cantidad', e.target.value)}
                                    className="w-full text-center bg-gray-50 rounded-lg py-1 text-sm font-bold border-none outline-none focus:ring-1 focus:ring-gray-200"
                                />
                            </div>
                            <button onClick={() => lista.eliminarIngrediente(ing.id_ingrediente)} className="text-gray-300 hover:text-red-500 transition-colors">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: PASOS DE ELABORACIÓN */}
          <div className="w-1/2 p-8 bg-gray-50/30 flex flex-col gap-4">
            <div className="flex items-center gap-2 px-1">
                <FileText size={16} className="text-gray-900" />
                <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Pasos de Elaboración</h3>
            </div>
            
            <div className="flex-1 relative">
                <textarea 
                    placeholder="1. Precalentar el horno a 180°C...&#10;2. Batir los huevos con el azúcar...&#10;3. Añadir el resto de ingredientes..."
                    value={form.descripcion}
                    onChange={(e) => form.setDescripcion(e.target.value)}
                    className="w-full h-full bg-white border border-gray-100 rounded-[2rem] p-8 text-sm font-semibold text-gray-800 placeholder:text-gray-300 focus:ring-2 focus:ring-gray-200 outline-none transition-all resize-none shadow-sm leading-relaxed"
                />
                <div className="absolute bottom-6 right-8 text-[10px] font-black text-gray-300 uppercase tracking-widest pointer-events-none">
                    Modo Redacción
                </div>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 border-t border-gray-100 bg-white flex justify-end gap-3 shrink-0">
          <Button variant="gris" onClick={onClose} className="px-8">DESCARTAR</Button>
          <Button variant="primario" onClick={acciones.handleGuardar} className="px-12" disabled={acciones.guardando}>
            {acciones.guardando ? "GUARDANDO..." : "GUARDAR RECETA"}
          </Button>
        </div>
      </div>
    </div>
  );
};