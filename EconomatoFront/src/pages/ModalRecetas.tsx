import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useRecetaModal } from "../hooks/useModalRecetas";

export const ModalReceta = ({ onClose, ingredientesDB = [] }: any) => {
  const {
    nombre, handleNombreChange,
    platos, handlePlatosChange,
    ingredientesElegidos,
    ingredienteEnFoco, setIngredienteEnFoco,
    busqueda, handleBusquedaChange,
    agregarIngrediente,
    actualizarFoco,
    confirmarIngrediente
  } = useRecetaModal(() => {});

  const sugerencias = ingredientesDB.filter((i: any) => 
    i.nombre.toLowerCase().includes(busqueda.toLowerCase()) && busqueda !== ""
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden border border-gray-100">
        
        {/* CABECERA */}
        <div className="px-10 py-6 bg-gray-50/50 border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter">Nueva Elaboración</h2>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest tracking-widest">Receta Paso a Paso</p>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-900 text-4xl font-light">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* COLUMNA IZQUIERDA */}
          <div className="space-y-8">
            <section>
              <h3 className="text-xs font-black uppercase text-blue-600 mb-4 tracking-widest">1. Datos Generales</h3>
              <div className="space-y-4">
                <Input 
                  type="text" 
                  label="Nombre de la Receta" 
                  placeholder="Ej: Mousse de Limón" 
                  value={nombre} 
                  onChange={handleNombreChange} 
                />
                <Input 
                  type="number" 
                  label="Raciones/Platos" 
                  placeholder="1" 
                  value={platos} 
                  onChange={handlePlatosChange}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </section>

            <section>
              <h3 className="text-xs font-black uppercase text-blue-600 mb-4 tracking-widest">2. Ingredientes en Receta</h3>
              <div className="grid grid-cols-1 gap-2">
                {ingredientesElegidos.map(ing => (
                  <div key={ing.id_ingrediente} className="flex justify-between items-center p-4 bg-gray-50 rounded-full border border-gray-100 px-6">
                    <span className="font-bold text-sm text-gray-700">{ing.nombre}</span>
                    <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {ing.cantidad} {ing.unidad_medida}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* COLUMNA DERECHA (BUSCADOR / FOCO) */}
          <div className="bg-gray-50/50 rounded-[2.5rem] p-8 border border-gray-100">
            {ingredienteEnFoco ? (
              <div className="bg-blue-600 p-8 rounded-[2rem] shadow-xl animate-fade-in-up text-white">
                <h4 className="font-black text-xl mb-6 uppercase tracking-tighter">{ingredienteEnFoco.nombre}</h4>
                <div className="space-y-4">
                  <Input 
                    type="number" 
                    label="Cantidad a usar" 
                    placeholder="0.00"
                    value={ingredienteEnFoco.cantidad}
                    onChange={(v) => actualizarFoco('cantidad', v)}
                    className="!bg-white/10 !text-white !placeholder-white/30"
                  />
                  <Input 
                    type="number" 
                    label="% Rendimiento" 
                    placeholder="100"
                    value={ingredienteEnFoco.rendimiento}
                    onChange={(v) => actualizarFoco('rendimiento', v)}
                    className="!bg-white/10 !text-white !placeholder-white/30"
                  />
                </div>
                <div className="flex gap-3 mt-8">
                  <Button variant="gris" className="flex-1 !bg-white/10 !text-white !border-none" onClick={() => setIngredienteEnFoco(null)}>Atrás</Button>
                  <Button variant="secundario" className="flex-[2] !bg-white !text-blue-600" onClick={confirmarIngrediente}>Añadir</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-blue-600 mb-4 tracking-widest">3. Añadir Suministros</h3>
                <Input 
                  type="text" 
                  placeholder="Buscar ingrediente..." 
                  value={busqueda} 
                  onChange={handleBusquedaChange}
                  className="shadow-inner"
                />
                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                  {sugerencias.map((s: any) => (
                    <button 
                      key={s.id_ingrediente}
                      onClick={() => agregarIngrediente(s)}
                      className="w-full p-4 bg-white border border-gray-100 rounded-full hover:border-blue-400 hover:shadow-md transition-all flex justify-between items-center px-6 group"
                    >
                      <span className="font-bold text-sm text-gray-600 group-hover:text-blue-600">{s.nombre}</span>
                      <span className="text-[10px] font-black text-gray-300 uppercase">{s.unidad_medida}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PIE */}
        <div className="px-10 py-6 bg-white border-t flex gap-4">
          <Button variant="gris" className="flex-1 !rounded-full font-bold" onClick={onClose}>Cancelar</Button>
          <Button variant="secundario" className="flex-[2] !rounded-full font-bold shadow-lg shadow-blue-100">Crear Receta</Button>
        </div>
      </div>
    </div>
  );
};