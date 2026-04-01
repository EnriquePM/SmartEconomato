import { X, Search, Plus, Trash2 } from "lucide-react";
import { useRecetaForm } from "../hooks/useRecetasForm";

interface ModalRecetaProps {
  onClose: () => void;
  onRecetaCreada: () => void; 
}

export const ModalReceta = ({ onClose, onRecetaCreada }: ModalRecetaProps) => {
  // 👇 INVOCAMOS AL HOOK. Él se encarga de todo el trabajo sucio.
  const { form, lista, buscador, acciones } = useRecetaForm(onRecetaCreada);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-fade-in-up">
        
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Nueva Elaboración</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Receta paso a paso</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* CUERPO DEL MODAL */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gray-50/50">
          
          {/* COLUMNA IZQUIERDA: DATOS GENERALES */}
          <div className="space-y-6">
            <h3 className="text-sm font-black text-blue-600 uppercase tracking-wider">1. Datos Generales</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Nombre de la Receta</label>
                <input 
                  type="text" 
                  value={form.nombre}
                  onChange={(e) => form.setNombre(e.target.value)}
                  placeholder="Ej: Mousse de Limón" 
                  className="w-full bg-gray-100 border-transparent rounded-xl px-4 py-3 text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Descripción</label>
                <textarea 
                  value={form.descripcion}
                  onChange={(e) => form.setDescripcion(e.target.value)}
                  placeholder="Instrucciones breves o notas de la elaboración..." 
                  className="w-full bg-gray-100 border-transparent rounded-xl px-4 py-3 text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none font-medium resize-none h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Raciones / Platos</label>
                <input 
                  type="number" 
                  value={form.raciones}
                  onChange={(e) => form.setRaciones(e.target.value)}
                  min="1"
                  className="w-1/2 bg-gray-100 border-transparent rounded-xl px-4 py-3 text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: INGREDIENTES */}
          <div className="space-y-6">
            <h3 className="text-sm font-black text-blue-600 uppercase tracking-wider">2. Ingredientes en Receta</h3>
            
            {/* Buscador de Ingredientes */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={buscador.busqueda}
                  onChange={(e) => buscador.setBusqueda(e.target.value)}
                  placeholder={buscador.cargando ? "Cargando tu almacén..." : "Buscar ingrediente (ej. Tomate)..."} 
                  disabled={buscador.cargando}
                  className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none font-medium shadow-sm disabled:bg-gray-100 disabled:text-gray-400"
                />
              </div>

              {/* Lista desplegable de resultados */}
              {buscador.busqueda.length > 0 && !buscador.cargando && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-10 max-h-48 overflow-y-auto scrollbar-custom">
                  {buscador.sugerencias.length > 0 ? (
                    buscador.sugerencias.map(ing => (
                      <button
                        key={ing.id_ingrediente}
                        onClick={() => lista.agregarIngrediente(ing)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center justify-between border-b border-gray-50 last:border-0 transition-colors"
                      >
                        <span className="font-bold text-gray-700">{ing.nombre}</span>
                        <div className="flex items-center text-xs font-bold text-blue-500 bg-blue-100 px-2 py-1 rounded-md">
                          <Plus size={14} className="mr-1" /> Añadir
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500 font-medium">No se encontraron ingredientes...</div>
                  )}
                </div>
              )}
            </div>

            {/* Lista de Ingredientes Añadidos */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3 min-h-[200px] overflow-y-auto max-h-[300px]">
              {lista.ingredientes.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2 py-8">
                  <span className="text-sm font-medium">No hay ingredientes en la receta</span>
                  <span className="text-xs">Usa el buscador de arriba para añadirlos</span>
                </div>
              ) : (
                lista.ingredientes.map((ing) => (
                  <div key={ing.id_ingrediente} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 text-sm truncate">{ing.nombre}</p>
                    </div>
                    
                    {/* Input Cantidad */}
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        placeholder="0.00"
                        value={ing.cantidad}
                        onChange={(e) => lista.actualizarIngrediente(ing.id_ingrediente, 'cantidad', e.target.value)}
                        className="w-20 text-right bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-bold focus:border-blue-500 outline-none"
                      />
                      <span className="text-xs font-black text-gray-500 w-6">{ing.unidad_medida}</span>
                    </div>

                    {/* Input Rendimiento */}
                    <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
                      <input 
                        type="number" 
                        placeholder="Rend. %"
                        value={ing.rendimiento}
                        onChange={(e) => lista.actualizarIngrediente(ing.id_ingrediente, 'rendimiento', e.target.value)}
                        className="w-16 text-right bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-medium focus:border-blue-500 outline-none"
                      />
                    </div>

                    {/* Botón Eliminar */}
                    <button 
                      onClick={() => lista.eliminarIngrediente(ing.id_ingrediente)}
                      className="ml-1 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

        {/* FOOTER - BOTONES */}
        <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-4">
          <button 
            onClick={onClose}
            disabled={acciones.guardando}
            className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            CANCELAR
          </button>
          <button 
            onClick={acciones.handleGuardar}
            disabled={acciones.guardando}
            className="px-8 py-3 rounded-xl font-black text-white bg-red-600 hover:bg-red-700 active:scale-95 shadow-lg transition-all disabled:opacity-50 disabled:bg-red-400 flex items-center gap-2"
          >
            {acciones.guardando ? "GUARDANDO..." : "CREAR RECETA"}
          </button>
        </div>

      </div>
    </div>
  );
};