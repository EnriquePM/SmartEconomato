import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useRecepcionModal } from "../hooks/useModalRecepcion";

export const ModalRecepcion = ({ pedido, onClose, onRefresh, onSaveLocal}: any) => {
  const { 
    lineasMostradas, 
    lineaEnFoco, 
    setLineaEnFoco, 
    busqueda, 
    manejarBusqueda, 
    actualizarValor,
    seleccionarLinea,
    enviarDatos,
    finalizarRecepcion,
    guardando
  } = useRecepcionModal(pedido, onSaveLocal, onRefresh, onClose);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100 font-sans">
        
        {/*CABECERA*/}
        <div className="px-8 py-5 bg-gray-50/50 border-b flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              {lineaEnFoco ? "Editando Recepción" : `Pedido ${pedido.id_pedido}`}
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
            <div className={`p-6 rounded-[1.8rem] animate-fade-in-up border ${Number(lineaEnFoco.cantidad_recibida) < Number(lineaEnFoco.cantidad_solicitada)
              ? 'bg-red-50/60 border-red-200'
              : 'bg-blue-50/40 border-blue-100'
            }`}>
              <div className="flex justify-between items-center mb-5">
                <h3 className={`text-base font-black uppercase tracking-tight ${Number(lineaEnFoco.cantidad_recibida) < Number(lineaEnFoco.cantidad_solicitada) ? 'text-red-900' : 'text-blue-900'}`}>
                  {lineaEnFoco.nombre}
                </h3>
                <div className="flex items-center gap-2">
                   <span className={`${Number(lineaEnFoco.cantidad_recibida) < Number(lineaEnFoco.cantidad_solicitada) ? 'bg-red-600' : 'bg-blue-600'} text-white text-[9px] font-black px-3 py-1 rounded-full uppercase`}>Pedido: {lineaEnFoco.cantidad_solicitada} {lineaEnFoco.unidad_medida}</span>
                   {Number(lineaEnFoco.cantidad_recibida) < Number(lineaEnFoco.cantidad_solicitada) && (
                    <span className="bg-red-100 text-red-700 text-[9px] font-black px-3 py-1 rounded-full uppercase border border-red-200">
                      Recepción parcial
                    </span>
                   )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input 
                  id="c-rec" type="number" label="Cant. Recibida" placeholder="0"
                  value={lineaEnFoco.cantidad_recibida} 
                  min={lineaEnFoco.cantidad_recibida_inicial}
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
              {Number(lineaEnFoco.cantidad_recibida_inicial) > 0 && (
                <p className="mt-4 text-xs font-semibold text-gray-500">
                  Ya había {lineaEnFoco.cantidad_recibida_inicial} {lineaEnFoco.unidad_medida} recepcionadas. Solo se sumará al stock la diferencia nueva al finalizar.
                </p>
              )}
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
                  const cantidadSolicitada = Number(l.cantidad_solicitada) || 0;
                  const cantidadRecibida = Number(l.cantidad_recibida) || 0;
                  const recepcionParcial = cantidadRecibida > 0 && cantidadRecibida < cantidadSolicitada;
                  const recepcionCompleta = cantidadSolicitada > 0 && cantidadRecibida >= cantidadSolicitada;
                  const bloqueado = pedido.estado === 'CONFIRMADO';
                  const estadoLinea = recepcionCompleta ? 'Completa' : recepcionParcial ? 'Parcial' : 'Pendiente';

                  return (
                    <div 
                      key={l.id_referencia}
                      onClick={() => {
                        if (!bloqueado) {
                          seleccionarLinea(l);
                        }
                      }}
                      className={`p-4 bg-white rounded-[1.2rem] border transition-all shadow-sm flex justify-between items-center group
                        ${bloqueado
                          ? 'border-gray-100 bg-gray-50/50 opacity-60 cursor-not-allowed'
                          : recepcionParcial
                            ? 'border-red-200 bg-red-50/70 hover:border-red-300 hover:shadow-lg cursor-pointer'
                            : recepcionCompleta
                              ? 'border-emerald-200 bg-emerald-50/70 hover:border-emerald-300 hover:shadow-lg cursor-pointer'
                              : 'border-gray-100 hover:border-blue-400 hover:shadow-lg cursor-pointer'
                        }`}
                    >
                      <div className="text-left">
                        <p className={`font-bold text-sm leading-tight transition-colors
                          ${bloqueado
                            ? 'text-gray-400'
                            : recepcionParcial
                              ? 'text-red-700 group-hover:text-red-800'
                              : recepcionCompleta
                                ? 'text-emerald-700 group-hover:text-emerald-800'
                                : 'text-gray-800 group-hover:text-blue-600'
                          }`}>
                          {l.nombre}
                        </p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Ref: {l.id_referencia}</p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-[10px] font-black px-3 py-1 rounded-xl border uppercase
                          ${recepcionCompleta
                            ? 'text-emerald-700 bg-emerald-100 border-emerald-200'
                            : recepcionParcial
                              ? 'text-red-700 bg-red-100 border-red-200'
                              : 'text-blue-600 bg-blue-50 border-blue-100'
                          }`}>
                          {estadoLinea}
                        </span>
                        <span className={`text-xs font-black px-3 py-1.5 rounded-xl border
                          ${recepcionCompleta
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                            : recepcionParcial
                              ? 'text-red-700 bg-red-50 border-red-200'
                              : 'text-blue-600 bg-blue-50 border-blue-100'
                          }`}>
                          {cantidadRecibida}/{cantidadSolicitada} <small className="text-[10px] uppercase">{l.unidad_medida}</small>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="px-8 py-6 border-t bg-white flex gap-4 shrink-0">
              <Button variant="gris" className="flex-1 !rounded-full font-bold" onClick={onClose}>Cerrar</Button>
              <Button variant="primario" className="flex-[2] !rounded-full font-bold" onClick={finalizarRecepcion} loading={guardando}>
                Finalizar Recepción
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};