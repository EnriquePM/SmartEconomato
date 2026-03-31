import { useState } from "react";
import { ModalRecepcion } from "./ModalRecepcion"; 
import { Button } from "../components/ui/Button";
import { getPedidosService } from "../services/pedidoService";
import { useEffect } from "react";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/select";

const RecepcionPage = () => {
  const [pedidos, setPedidos] = useState<any[]>([]); 
  const [cargando, setCargando] = useState(true);    
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<any>(null);
  const [busqueda, setBusqueda] = useState("");
const [filtroEstado, setFiltroEstado] = useState("todos");

  const pedidosFiltrados = pedidos.filter(p => {
  const coincideBusqueda =
    p.proveedor?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.id_pedido?.toString().includes(busqueda);

  const coincideEstado =
    filtroEstado === "todos" || p.estado === filtroEstado;

  return coincideBusqueda && coincideEstado;
});

/*const refrescarLista = async () => {
  try {
    setCargando(true); 
    const data = await getPedidosService();
    setPedidos(data);
  } catch (error) {
    console.error("Error al refrescar:", error);
  } finally {
    setCargando(false); 
  }
};



  useEffect(() => {
    refrescarLista()  
  }, []); 

  if (cargando) return <p>Cargando pedidos...</p>;*/




    /* -------------------------- BORRAR --------------------------- */
  const pedidoPrueba = {
  id_pedido: 101,
  proveedor: "Distribuidora Gourmet S.A.",
  fecha_pedido: "2024-05-20",
  tipo_pedido: "productos",
  estado: "PENDIENTE",
  pedido_ingrediente: [
    {
      id_ingrediente: 1,
      cantidad_solicitada: 50,
      cantidad_recibida: 0,
      ingrediente: { nombre: "Tomate frito", unidad_medida: "kg" }
    },
    {
      id_ingrediente: 2,
      cantidad_solicitada: 12,
      cantidad_recibida: 5, 
      ingrediente: { nombre: "Aceite de Oliva", unidad_medida: "L" }
    },
    {
      id_ingrediente: 3,
      cantidad_solicitada: 100,
      cantidad_recibida: 0,
      ingrediente: { nombre: "Harina de Trigo", unidad_medida: "kg" }
    }
  ]
};

const refrescarLista = () => {
  try {
    setCargando(true); 
    setPedidos([pedidoPrueba]);
  } catch (error) {
    console.error("Error al refrescar:", error);
  } finally {
    setCargando(false); 
  }
};



  useEffect(() => {
    refrescarLista()  
  }, []); 

  if (cargando) return <p>Cargando pedidos...</p>;

  // ESTA FUNCIÓN HARÁ DE "API" LOCAL
  const guardarCambiosHardcodeados = (pedidoActualizado: any) => {
    console.log("💾 Guardando localmente:", pedidoActualizado);
    
    // Actualizamos la lista de pedidos en el estado del padre
    setPedidos(prev => prev.map(p => 
      p.id_pedido === pedidoActualizado.id_pedido ? pedidoActualizado : p
    ));
    
    // Actualizamos también el pedido seleccionado para que el modal vea el cambio
    setPedidoSeleccionado(pedidoActualizado);
  };

  /* -------------------------- BORRAR --------------------------- */





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
        { value: "CONFIRMADO", label: "Confirmados" }
      ]}
      onChange={(val) => setFiltroEstado(val)}
    />
  </div>

</div>

    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
  <div className="overflow-auto scrollbar-global">
    <table className="w-full text-left">
      
      <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold sticky top-0 z-10">
        <tr>
          <th className="p-5 bg-gray-50">ID</th>
          <th className="p-5 bg-gray-50">Proveedor</th>
          <th className="p-5 bg-gray-50">Fecha</th>
          <th className="p-5 text-right bg-gray-50">Acción</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100">
        {pedidosFiltrados.map((pedido) => (
          <tr key={pedido.id_pedido} className="hover:bg-gray-50 transition group">
            
            <td className="p-5 font-mono text-xs text-gray-500">
              {pedido.id_pedido}
            </td>

            <td className="p-5 font-medium text-gray-900">
              {pedido.proveedor}
            </td>

            <td className="p-5 text-gray-600">
              {pedido.fecha_pedido
                ? new Date(pedido.fecha_pedido).toLocaleDateString()
                : "-"}
            </td>

              <td className="p-5 text-right">
              <button
                onClick={() => setPedidoSeleccionado(pedido)}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Recepcionar
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
          onClose={() => setPedidoSeleccionado(null)} 
          /*onRefresh={refrescarLista}*/
          onSaveLocal={guardarCambiosHardcodeados}
        />
      )}
    </div>
  );
};

export default RecepcionPage;