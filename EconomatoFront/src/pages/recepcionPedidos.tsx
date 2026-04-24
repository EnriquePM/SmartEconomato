import { ModalRecepcion } from "../components/recepcion/ModalRecepcion"; 
import { Buscador } from '../components/ui/Buscador';
import { Select } from "../components/ui/Select";
import { PackageCheck, PackageOpen, Loader2, Search } from "lucide-react";
import { useRecepcion } from "../hooks/useRecepcion";
import { AlertModal } from "../components/ui/AlertModal";
import { useState, useRef } from "react";

const RecepcionPage = () => {
  const {
    pedidosFiltrados,
    cargando,
    pedidoSeleccionado,
    abriendoPedidoId,
    busqueda,
    setBusqueda,
    filtroEstado,
    setFiltroEstado,
    abrirPedido,
    refrescarLista,
    guardarCambiosLocal,
    cerrarModal,
    exitoUI,
    setExitoUI,
  } = useRecepcion();

  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const ejecutarFinalizarRef = useRef<(() => Promise<void>) | null>(null);

  if (cargando) return <p>Cargando pedidos...</p>;

  return (
    <div className="h-full flex flex-col animate-fade-in-up">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1>Recepción de pedidos</h1>
          <h2> Recibe los productos pedidos</h2>
        </div>
      </div>

      {/* BARRA DE HERRAMIENTAS */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-6">

        <Buscador 
          value={busqueda} 
          onChange={setBusqueda} 
          placeholder="Buscar por proveedor o ID..." 
        />

        <div className="w-full md:w-80">
          <Select
            id="estado-filter"
            value={filtroEstado}
            options={[
              { value: "todos", label: "Todos los pedidos" },
              { value: "PENDIENTE", label: "Pendientes" },
              { value: "INCOMPLETO", label: "Incompletos" },
              { value: "CONFIRMADO", label: "Confirmados" }
            ]}
            onChange={(val) => setFiltroEstado(val)}
          />
        </div>

      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col flex-1">
        <div className="overflow-auto scrollbar-global">
          <table className="w-full text-left border-collapse table-fixed">
            
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold sticky top-0 z-10">
              <tr>
                <th className="p-5 bg-gray-50 w-1/4">ID</th>
                <th className="p-5 bg-gray-50 w-1/4">Proveedor</th>
                <th className="p-5 bg-gray-50 w-1/4 text-center">Fecha</th>
                <th className="p-5 bg-gray-50 w-1/4 text-center">Acción</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {pedidosFiltrados.length > 0 ? (
                pedidosFiltrados.map((pedido) => (
                  <tr key={pedido.id_pedido} className="hover:bg-gray-50 transition group">
                    
                    <td className="p-5 font-mono text-xs text-gray-500">
                      {pedido.id_pedido}
                    </td>

                    <td className="p-5 font-medium text-gray-900 truncate">
                      {pedido.proveedor}
                    </td>

                    <td className="p-5 text-gray-600 text-center">
                      {pedido.fecha_pedido
                        ? new Date(pedido.fecha_pedido).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="p-5 text-center">
                      <button
                        onClick={() => {
                          if (!pedido.id_pedido) return;
                          if (pedido.estado === 'CONFIRMADO') return; 
                          abrirPedido(pedido.id_pedido);
                        }}
                        disabled={abriendoPedidoId === pedido.id_pedido}
                        className={`
                          inline-flex items-center gap-2.5 
                          px-5 py-2.5 rounded-xl 
                          font-bold text-xs tracking-tight 
                          transition-all duration-200

                          ${pedido.estado === 'CONFIRMADO'
                            ? 'bg-emerald-50 text-emerald-600 cursor-default'
                            : `bg-acento/20 text-acento border border-acento
                              hover:bg-acento hover:text-white 
                              hover:-translate-y-0.5
                              active:scale-95
                              disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed`
                          }
                        `}
                      >
                        {pedido.estado === 'CONFIRMADO' ? (
                          <>
                            <PackageOpen className="w-4 h-4" /> 
                            Recepcionado
                          </>
                        ) : abriendoPedidoId === pedido.id_pedido ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Abriendo...
                          </>
                        ) : (
                          <>
                            <PackageCheck className="w-4 h-4" />
                            Recepcionar
                          </>
                        )}
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-gray-400">
                    <Search size={32} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-semibold tracking-widest">
                      No se encontraron pedidos
                    </p>
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

      {pedidoSeleccionado && (
        <ModalRecepcion 
          pedido={pedidoSeleccionado} 
          onClose={cerrarModal}
          onRefresh={refrescarLista}
          onSaveLocal={guardarCambiosLocal}
          onSolicitarFinalizar={(ejecutar: () => Promise<void>) => {  
            ejecutarFinalizarRef.current = ejecutar;             
            setMostrarConfirmar(true);                              
          }}
        />
      )}

      <AlertModal
        isOpen={mostrarConfirmar}
        type="confirm"
        title="¿Finalizar Recepción?"
        message="¿Estás seguro de que quieres cerrar este pedido? El stock se actualizará automáticamente."
        confirmText="SÍ, FINALIZAR"
        cancelText="REVISAR"
        onConfirm={() => {
          setMostrarConfirmar(false);
          ejecutarFinalizarRef.current?.();
        }}
        onCancel={() => setMostrarConfirmar(false)}
      />

      <AlertModal
        isOpen={!!exitoUI}
        type="success"
        title="¡Éxito!"
        message={exitoUI} 
        onConfirm={() => setExitoUI(null)} 
      />

    </div>
  );
};

export default RecepcionPage;