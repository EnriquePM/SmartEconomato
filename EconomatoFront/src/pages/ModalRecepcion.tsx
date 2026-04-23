import { useState } from "react";
import { PackageOpen, Search, X } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useRecepcionModal } from "../hooks/useModalRecepcion";
import { BasculaWidget } from "../components/ui/BasculaWidget";

export const ModalRecepcion = ({ pedido, onClose, onRefresh, onSaveLocal }: any) => {
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

  const [usarBascula, setUsarBascula] = useState(false);

  const capturarPesoEnCantidadRecibida = (peso: string) => {
    if (!lineaEnFoco) {
      return;
    }

    actualizarValor(lineaEnFoco.id_referencia, 'cantidad_recibida', peso);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100 font-sans">

        {/* CABECERA */}
        <div className="flex justify-between items-center px-8 py-3 border-b border-gray-100 bg-white shrink-0">
          <div className="flex items-center gap-3 p-2.5">
            <div className="bg-acento p-2.5 rounded-xl text-white shadow-lg">
              <PackageOpen size={25} color="#ffffff" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight leading-none">
                {lineaEnFoco ? "Editando Recepción" : `Pedido ${pedido.id_pedido}`}
              </h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                {lineaEnFoco ? `Item: ${lineaEnFoco.nombre}` : `Proveedor: ${pedido.proveedor}`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all">
            <X size={22} />
          </button>
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
        <div className={`px-8 py-4 bg-white ${lineaEnFoco ? 'flex-1 overflow-y-auto' : 'shrink-0'}`}>
          {lineaEnFoco ? (
            /* VISTA FORMULARIO */
            <div className="px-8 py-6 bg-white overflow-y-auto">
              <div className={`p-8 rounded-[2.5rem] animate-fade-in-up border transition-all ${
                Number(lineaEnFoco.cantidad_recibida) < Number(lineaEnFoco.cantidad_solicitada)
                  ? 'bg-red-50/40 border-red-200'
                  : 'bg-gray-50/50 border-gray-100'
              }`}>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className={`text-lg font-black uppercase tracking-tight ${
                      Number(lineaEnFoco.cantidad_recibida) < Number(lineaEnFoco.cantidad_solicitada) ? 'text-red-900' : 'text-gray-900'
                    }`}>
                      {lineaEnFoco.nombre}
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Validación de entrada de almacén</p>
                  </div>
                 <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold border border-blue-100 shadow-sm">
                  Pedido: {lineaEnFoco.cantidad_solicitada} {lineaEnFoco.unidad_medida}
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4 bg-white/50 p-2 rounded-lg border border-gray-100 transition-all">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-blue-600 rounded bg-gray-100 border-gray-300 focus:ring-blue-500"
                    checked={usarBascula}
                    onChange={(e) => setUsarBascula(e.target.checked)}
                  />
                  <span className="text-sm font-bold text-gray-700">Utilizar báscula externa</span>
                </label>
              </div>

              {usarBascula && (
                <div className="mb-4 animate-fade-in-up">
                  <BasculaWidget onCapturarPeso={capturarPesoEnCantidadRecibida} />
                </div>
              )}

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

              <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm pt-4 pb-1 flex gap-3 mt-8">
                <Button variant="gris" className="flex-1 !rounded-full" onClick={() => setLineaEnFoco(null)}>
                  Volver atrás
                </Button>
                <Button variant="secundario" className="flex-[2] !rounded-full shadow-lg shadow-blue-200" onClick={enviarDatos}>
                  Guardar y continuar
                </Button>
              </div>
            </div>
            </div>
          ) : (
            /* VISTA LISTADO */
            <>
              <div className="shrink-0 px-8 py-4 bg-white animate-fade-in">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 z-10" size={18} />
                    <Input 
                      id="search-recepcion"
                      type="text"
                      placeholder="Buscar ingrediente o material por nombre..." 
                      value={busqueda}
                      onChange={(val) => manejarBusqueda(val)}
                      className="pl-12 !bg-gray-50/50 !border-none" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-8 py-2 bg-gray-50/20 border-t border-gray-50 scrollbar-global">
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
                        onClick={() => !bloqueado && seleccionarLinea(l)}
                        className={`p-4 bg-white rounded-[1.2rem] border transition-all shadow-sm flex justify-between items-center group
                          ${bloqueado ? 'border-gray-100 bg-gray-50/50 opacity-60 cursor-not-allowed' : 
                            recepcionParcial ? 'border-red-200 bg-red-50/70 hover:border-red-400 hover:shadow-lg cursor-pointer' : 
                            recepcionCompleta ? 'border-emerald-200 bg-emerald-50/70 hover:border-emerald-400 hover:shadow-lg cursor-pointer' : 
                            'border-gray-100 hover:border-acento hover:shadow-lg cursor-pointer'}`}
                      >
                        <div className="text-left">
                          <p className={`font-black text-sm leading-tight transition-colors ${
                            bloqueado ? 'text-gray-400' : recepcionParcial ? 'text-red-700 group-hover:text-red-800' : recepcionCompleta ? 'text-emerald-700 group-hover:text-emerald-800' : 'text-gray-800 group-hover:text-red-600'
                          }`}>{l.nombre}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Ref: {l.id_referencia}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`text-[9px] font-black px-3 py-1 rounded-xl border uppercase tracking-widest ${
                            recepcionCompleta ? 'text-emerald-700 bg-emerald-100 border-emerald-200' : 
                            recepcionParcial ? 'text-red-700 bg-red-100 border-red-200' : 
                            'text-gray-500 bg-gray-100 border-gray-200 group-hover:border-red-200 group-hover:text-red-600'
                          }`}>{estadoLinea}</span>
                          <span className={`text-xs font-black px-3 py-1.5 rounded-xl border tabular-nums ${
                            recepcionCompleta ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 
                            recepcionParcial ? 'text-red-700 bg-red-50 border-red-200' : 'text-gray-700 bg-gray-50 border-gray-100'
                          }`}>{cantidadRecibida}/{cantidadSolicitada} <small className="text-[10px] uppercase font-bold ml-1">{l.unit_medida || l.unidad_medida}</small></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="px-8 py-6 border-t border-gray-100 bg-white flex justify-end gap-3 shrink-0">
                <Button variant="gris" onClick={onClose} className="px-8">CERRAR</Button>
                <Button variant="primario" onClick={finalizarRecepcion} disabled={guardando} className="px-10 font-black uppercase tracking-widest shadow-lg shadow-gray-200">
                  {guardando ? "GUARDANDO..." : "FINALIZAR RECEPCIÓN"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};