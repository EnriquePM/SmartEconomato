import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useRecepcionModal } from "../hooks/useModalRececion";


export const ModalRecepcion = ({ pedido, onClose }: { pedido: any, onClose: () => void }) => {
  const { lineas, lineaEnFoco, busqueda, buscarProducto, actualizarValor } = useRecepcionModal(pedido);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* 1. BUSCADOR (Código de barras o Nombre) */}
        <div className="p-6 bg-gray-50 border-b">
          <h2 className="text-xl font-black mb-4 text-gray-800">Recepción de Pedido #{pedido.id}</h2>
          <div className="relative">
            <Input 
              id="buscador"
              type="text"
              placeholder="Escanea código de barras o busca producto..."
              value={busqueda}
              onChange={(val) => buscarProducto(val)}
              className="bg-white shadow-sm ring-2 ring-gray-100 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* 2. FORMULARIO DE EDICIÓN ACTIVA */}
        <div className="p-8 border-b bg-white">
          {lineaEnFoco ? (
            <div className="animate-in fade-in slide-in-from-top-4">
              <div className="flex justify-between items-center mb-6">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  Editando Producto
                </span>
                <span className="text-gray-400 font-bold text-sm">{lineaEnFoco.unidadMedida}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input 
                  id="nombre"
                  label="Producto"
                  type="text"
                  value={lineaEnFoco.nombre} // Se carga el nombre
                  onChange={() => {}} // Bloqueado o editable según prefieras
                  placeholder=""
                />
                <div className="relative">
                  <Input 
                    id="peso"
                    label="Peso / Cantidad"
                    type="number"
                    value={lineaEnFoco.pesoRecibido} // Carga el peso de la API por defecto
                    onChange={(val) => actualizarValor(lineaEnFoco.id, 'pesoRecibido', val)}
                    placeholder="0.00"
                  />
                  <span className="absolute right-4 bottom-3 text-xs font-bold text-gray-300">
                    {lineaEnFoco.unidadMedida}
                  </span>
                </div>
                <Input 
                  id="caducidad"
                  label="Fecha Caducidad"
                  type="date"
                  value={lineaEnFoco.fechaCaducidad}
                  onChange={(val) => actualizarValor(lineaEnFoco.id, 'fechaCaducidad', val)}
                  placeholder=""
                />
              </div>
              <div className="mt-6">
                <Input 
                  id="obs"
                  label="Observaciones"
                  type="text"
                  value={lineaEnFoco.observaciones}
                  onChange={(val) => actualizarValor(lineaEnFoco.id, 'observaciones', val)}
                  placeholder="Ej: Embalaje dañado..."
                />
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-gray-400 font-medium italic">
              Busca un producto arriba para empezar la recepción
            </div>
          )}
        </div>

        {/* 3. RESUMEN DE LÍNEAS (Mini tabla inferior) */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Resumen de carga</p>
          <div className="space-y-2">
            {lineas.map(l => (
              <div key={l.id} className={`flex justify-between p-3 rounded-xl border ${lineaEnFoco?.id === l.id ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100'}`}>
                <span className="text-sm font-bold text-gray-700">{l.nombre}</span>
                <span className="text-sm font-mono font-bold text-blue-600">{l.pesoRecibido} {l.unidadMedida}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PIE DE PÁGINA */}
        <div className="p-6 border-t flex gap-4 bg-white">
          <Button variant="gris" className="flex-1" onClick={onClose}>Cerrar</Button>
          <Button variant="secundario" className="flex-[2]">Confirmar Recepción</Button>
        </div>
      </div>
    </div>
  );
};