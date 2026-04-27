import { X, Send, Trash2, Search, ShoppingCart, ShoppingBasket } from "lucide-react";
import { Button } from "../ui/Button"; 
import { Input } from "../ui/Input";  
import { Select } from "../ui/select";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PedidoPDF } from "../pdf/PedidoPDF"; 
import { Printer } from "lucide-react";
import { useModalPedidos } from "../../hooks/useModalPedido";
import { AlertModal } from "../ui/AlertModal";

export const ModalPedido = ({
  onClose, pedidoActual, setPedidoActual, catalogoProveedores,
  catalogoProductos, tipoPedido, seleccionarProducto,
  actualizarLinea, borrarLinea, agregarLinea, guardarBorrador, enviarPedido
}: any) => {

  const {
    terminoBusqueda, setTermoBusqueda,
    mostrarResultados, setMostrarResultados,
    procesando, alerta
  } = useModalPedidos(pedidoActual, enviarPedido, guardarBorrador, tipoPedido);

  const esSoloLectura = pedidoActual.estado !== 'BORRADOR' && pedidoActual.id_pedido !== undefined;
  const lineas = tipoPedido === 'productos' 
    ? pedidoActual.pedido_ingrediente || [] 
    : pedidoActual.pedido_material || [];

  const productosFiltrados = catalogoProductos.filter((p: any) => 
    p.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
  ).slice(0, 6);



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

      <div className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl flex flex-col h-[80vh] overflow-hidden animate-fade-in-up border border-gray-100">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-8 py-2 border-b border-gray-100 bg-white shrink-0">
          <div className="flex items-center gap-3 p-2.5 ">
            <div className="bg-acento p-2.5 rounded-xl text-white shadow-lg">
              <ShoppingBasket size={25} color="#ffffff" strokeWidth={2} />
            </div>
            <div>
                <h2 className="text-lg font-black text-gray-900 tracking-tight leading-none">
                  {pedidoActual.id_pedido ? `Pedido ${pedidoActual.id_pedido}` : `Nuevo Pedido`}
                </h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Crea tu pedido paso a paso</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all">
            <X size={22} />
          </button>
        </div>

        {/* CONTENIDO CENTRAL */}
        <div className="flex-1 p-8 overflow-hidden flex flex-col gap-4 bg-white">
          
          {/* SECCIÓN CONFIGURACIÓN */}
          <div className="grid grid-cols-12 gap-6 shrink-0 items-end px-2">
            <div className="col-span-5">
             <Select 
                options={[
                  { value: "", label: "Seleccionar Proveedor..." },
                  ...catalogoProveedores.map((p: any) => ({ value: p.nombre, label: p.nombre }))
                ]}
                value={pedidoActual.proveedor || ""}
                onChange={(val) => setPedidoActual({ ...pedidoActual, proveedor: val })}
                className={esSoloLectura ? "opacity-50 pointer-events-none" : ""}
              />
            </div>

            <div className="col-span-3">
              <Input 
                label="Fecha de Pedido"
                type="date"
                placeholder=""
                value={pedidoActual.fecha_pedido ? new Date(pedidoActual.fecha_pedido).toISOString().split('T')[0] : ""}
                onChange={(val) => setPedidoActual({ ...pedidoActual, fecha_pedido: val })}
                disabled={esSoloLectura}
              />
            </div>

            <div className="col-span-4 text-right">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 block">Total Estimado</span>
                <span className="text-3xl font-black text-gray-900 tabular-nums tracking-tighter">
                    {Number(pedidoActual.total_estimado ?? 0).toFixed(2)}€
                </span>
            </div>
          </div>

          {/* BUSCADOR */}
          {!esSoloLectura && (
            <div className="shrink-0">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative ">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 z-10" size={18} />
                        <Input 
                            type="text"
                            placeholder="Buscar por nombre de producto..." 
                            value={terminoBusqueda}
                            onChange={(v: string) => {
                                setTermoBusqueda(v);
                                setMostrarResultados(true);
                            }}
                            className="pl-12 !bg-gray-50/50"
                        />
                    </div>

                    {/* RESULTADOS FILTRADOS */}
                    {mostrarResultados && terminoBusqueda.length > 1 && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                        {productosFiltrados.length > 0 ? (
                        productosFiltrados.map((p: any) => (
                            <button
                            key={p.id}
                            className="w-full flex justify-between items-center px-6 py-4 hover:bg-gray-50 text-left transition-colors border-b border-gray-50 last:border-none"
                            onClick={() => {
                                agregarLinea();
                                seleccionarProducto(lineas.length, p.id);
                                setTermoBusqueda("");
                                setMostrarResultados(false);
                            }}
                            >
                            <span className="font-bold text-gray-800">{p.nombre}</span>
                            <span className="text-xs font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-full">{p.precio} €</span>
                            </button>
                        ))
                        ) : (
                        <div className="p-6 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest">No se encontraron artículos</div>
                        )}
                    </div>
                    )}
                </div>
            </div>
          )}

          {/* LISTADO DE ARTÍCULOS */}
          <div className="flex-1 bg-gray-50 rounded-[2rem] p-6 overflow-hidden flex flex-col border border-gray-100/50">
            <div className="flex items-center gap-2 mb-4 px-2 shrink-0">
                <ShoppingCart size={14} className="text-gray-400" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Productos añadidos ({lineas.length})</span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-global">
                {lineas.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-300">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em]">Lista de pedido vacía</p>
                    </div>
                ) : (
                    lineas.map((linea: any, index: number) => {
                        const itemId = tipoPedido === 'productos' ? linea.id_ingrediente : linea.id_material;
                        const prod = catalogoProductos.find((p: any) => p.id === itemId);
                        const subtotal = (prod?.precio || 0) * linea.cantidad_solicitada;

                        return (
                            <div key={index} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="flex-1 px-1">
                                    <p className="text-sm font-black text-gray-800 leading-none">{prod?.nombre || "Cargando..."}</p>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase mt-1.5 tracking-tighter">Precio Unitario: {prod?.precio || 0}€</p>
                                </div>

                                <div className="w-28">
                                    <Input 
                                        type="number"
                                        placeholder="0"
                                        value={linea.cantidad_solicitada}
                                        onChange={(val) => actualizarLinea(index, Number(val))}
                                        disabled={esSoloLectura}
                                        className="text-center !py-2 !rounded-xl !bg-gray-50/50 border border-gray-100"
                                    />
                                </div>

                                <div className="w-24 text-right">
                                    <p className="text-sm font-black text-gray-900 tabular-nums">{subtotal.toFixed(2)}€</p>
                                </div>

                                {!esSoloLectura && (
                                    <button 
                                        onClick={() => borrarLinea(index)}
                                        className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
          </div>
        </div>

       {/* FOOTER */}
        <div className="px-8 py-4 border-t border-gray-100 bg-white flex justify-end gap-3 shrink-0">
          {pedidoActual.id_pedido && (
            <PDFDownloadLink
              document={
                <PedidoPDF 
                  pedido={pedidoActual} 
                  catalogoProductos={catalogoProductos} 
                  tipoPedido={tipoPedido} 
                />
              }
              fileName={`Pedido_${pedidoActual.id_pedido}.pdf`}
              style={{ textDecoration: 'none' }} 
            >
              {({ loading }) => (
                <Button 
                  variant="primario" 
                  
                >
                  <Printer size={16} color="#ffffff" strokeWidth={3} />
                  {loading ? 'GENERANDO...' : 'IMPRIMIR PDF'}
                </Button>
              )}
            </PDFDownloadLink>
          )}
          
          {!esSoloLectura ? (
            <>
              <Button variant="gris" onClick={alerta.guardarBorrador} disabled={procesando}>
                BORRADOR
              </Button>
              <Button 
                variant="primario" 
                onClick={alerta.solicitar} 
                disabled={procesando} 
                className="px-10"
              >
                <Send size={16} color="#ffffff" strokeWidth={3} className="mr-2" /> 
                {procesando ? "ENVIANDO..." : "ENVIAR"}
              </Button>
            </>
          ) : (
            <Button variant="gris" onClick={onClose} className="px-8">
              CERRAR
            </Button>
          )}
        </div>
      </div>
      <AlertModal 
  isOpen={alerta.isOpen}
  type={alerta.type}
  title={alerta.title}
  message={alerta.message}
  onConfirm={alerta.type === 'confirm' ? (alerta.onConfirm || alerta.cerrar) : alerta.cerrar}
  onCancel={alerta.cerrar}
  confirmText={alerta.type === 'confirm' ? "ENVIAR" : "ENTENDIDO"}
/>
    </div>
  );
};