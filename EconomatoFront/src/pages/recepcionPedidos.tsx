import { ModalRecepcion } from "./ModalRecepcion"; 
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/select";
import { PackageCheck, Loader2 } from "lucide-react";
import { useRecepcion } from "../hooks/useRecepcion";

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
  } = useRecepcion();

  if (cargando) return <p>Cargando pedidos...</p>;

  return (
  
            <div className="h-full flex flex-col animate-fade-in-up">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Recepción de pedidos</h1>
                        <p className="text-gray-500 mt-1">Recibe los productos pedidos</p>
                    </div>
                </div>
    
                {/* BARRA DE HERRAMIENTAS */}
<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-6">

  {/* Buscador */}
  <div className="flex-1 relative">
  
    <Input
      id="search-orders"
      type="text"
      placeholder="Buscar por proveedor o ID..."
      value={busqueda}
      onChange={(val) => setBusqueda(val)}
      className="pl-12"
    />
  </div>

  {/* Select de estado */}
  <div className="min-w-[200px]">
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
          <th className="p-5 bg-gray-50 w-1/4 text-center" >Acción</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100">
        {pedidosFiltrados.map((pedido) => (
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
      abrirPedido(pedido.id_pedido);
    }}
    disabled={abriendoPedidoId === pedido.id_pedido}
    className="
    /* 1. ESTRUCTURA Y TIPOGRAFÍA */
    inline-flex items-center gap-2.5 
    px-5 py-2.5 rounded-xl 
    font-bold text-xs tracking-tight 
    transition-all duration-200
    
    bg-blue-50 text-blue-600 border border-blue-100/50
 
    hover:bg-blue-600 hover:text-white 
    hover:border-blue-600
    hover:shadow-lg hover:shadow-blue-600/20
    hover:-translate-y-0.5
  
    active:scale-95
    
    disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
  "
  >
    {abriendoPedidoId === pedido.id_pedido ? (
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
        ))}
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
        />
      )}
    </div>
  );
};

export default RecepcionPage;