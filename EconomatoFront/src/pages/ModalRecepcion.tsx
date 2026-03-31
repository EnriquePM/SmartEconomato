import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useRecepcionModal } from "../hooks/useModalRecepcion";
import type { Pedido } from "../models/Pedidos";

export const ModalRecepcion = ({ pedido, onClose, onRefresh, onSaveLocal}: any) => {
  const { 
    lineasMostradas, 
    lineaEnFoco, 
    setLineaEnFoco, 
    busqueda, 
    manejarBusqueda, 
    actualizarValor,
    seleccionarLinea,
    enviarDatos
  } = useRecepcionModal(pedido,onSaveLocal);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100 font-sans">
        
        {/*CABECERA*/}
        <div className="px-8 py-5 bg-gray-50/50 border-b flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              {lineaEnFoco ? "Editando Recepción" : `Pedido #${pedido.id_pedido}`}
            </h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">
              {lineaEnFoco ? `Item: ${lineaEnFoco.nombre}` : pedido.proveedor}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 text-3xl font-light">×</button>
        </div>

        {/*BUSCADOR*/}
        {!lineaEnFoco && (
          <div className="px-8 py-3 bg-white border-b border-gray-50 shrink-0 animate-fade-in">
            <Input 
              id="search-recepcion"
              type="text"
              placeholder="Buscar ingrediente o material..."
              value={busqueda}
              onChange={(val) => manejarBusqueda(val)}
              className="!bg-gray-50 shadow-inner"
            />
          </div>
        )}

        {/*FORM*/}
        <div className="px-8 py-4 bg-white shrink-0">
          {lineaEnFoco ? (
            <div className="bg-blue-50/40 border border-blue-100 p-6 rounded-[1.8rem] animate-fade-in-up">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-base font-black text-blue-900 uppercase tracking-tight">
                  {lineaEnFoco.nombre}
                </h3>
                <div className="flex items-center gap-2">
                   <span className="bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase">Pedido: {lineaEnFoco.cantidad_solicitada} {lineaEnFoco.unidad_medida}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input 
                  id="c-rec" type="number" label="Cant. Recibida" placeholder="0"
                  value={lineaEnFoco.cantidad_recibida} 
                  onChange={(v) => actualizarValor(lineaEnFoco.id_referencia, 'cantidad_recibida', v)}
                />
                <Input 
                  id="f-cad" type="date" label="Vencimiento" placeholder=""
                  value={lineaEnFoco.fechaCaducidad} 
                  onChange={(v) => actualizarValor(lineaEnFoco.id_referencia, 'fechaCaducidad', v)}
                />
                <Input 
                  id="o-rec" type="text" label="Notas" placeholder="Opcional..."
                  value={lineaEnFoco.observaciones} 
                  onChange={(v) => actualizarValor(lineaEnFoco.id_referencia, 'observaciones', v)}
                />
              </div>

              <div className="flex gap-3 mt-8">
                <Button variant="gris" className="flex-1 !rounded-full" onClick={() => setLineaEnFoco(null)}>
                  Volver atrás
                </Button>
                <Button variant="secundario" className="flex-[2] !rounded-full shadow-lg shadow-blue-200" onClick={enviarDatos}>
                  Guardar y continuar
                </Button>
              </div>
            </div>
          ) : (
            /* ESPACIO PRODUCTO */
            <div className="py-8 text-center bg-gray-50 rounded-[1.8rem] border-2 border-dashed border-gray-200 text-xs text-gray-400 font-bold uppercase tracking-widest">
              Selecciona un producto de la lista inferior
            </div>
          )}
        </div>

        {/* LISTA PRODCUTO Y BOTONES  */}
        {!lineaEnFoco && (
          <>
           <div className="flex-1 overflow-y-auto px-8 py-2 bg-gray-50/20 border-t border-gray-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4">
                {lineasMostradas.map((l: any) => {
    
                  const yaRecepcionado = Number(l.cantidad_recibida) > 0;

                  return (
                    <div 
                      key={l.id_referencia}
                   
                      onClick={() => {
                        if (!yaRecepcionado) {
                          seleccionarLinea(l);
                        }
                      }}
                   
                      className={`p-4 bg-white rounded-[1.2rem] border transition-all shadow-sm flex justify-between items-center group
                        ${yaRecepcionado 
                          ? 'border-gray-100 bg-gray-50/50 opacity-60 cursor-not-allowed' 
                          : 'border-gray-100 hover:border-blue-400 hover:shadow-lg cursor-pointer' 
                        }`}
                    >
                      <div className="text-left">
                        <p className={`font-bold text-sm leading-tight transition-colors
                          ${yaRecepcionado 
                            ? 'text-gray-400 line-through' 
                            : 'text-gray-800 group-hover:text-blue-600' 
                          }`}>
                          {l.nombre}
                        </p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Ref: {l.id_referencia}</p>
                      </div>

                      <span className={`text-xs font-black px-3 py-1.5 rounded-xl border
                        ${yaRecepcionado
                          ? 'text-gray-400 bg-gray-100 border-gray-200' 
                          : 'text-blue-600 bg-blue-50 border-blue-100' 
                        }`}>
                        {l.cantidad_recibida} <small className="text-[10px] uppercase">{l.unidad_medida}</small>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="px-8 py-6 border-t bg-white flex gap-4 shrink-0">
              <Button variant="gris" className="flex-1 !rounded-full font-bold" onClick={onClose}>Cerrar</Button>
              <Button variant="secundario" className="flex-[2] !rounded-full font-bold" onClick={() => console.log("Fin", lineasMostradas)}>
                Finalizar Recepción
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};