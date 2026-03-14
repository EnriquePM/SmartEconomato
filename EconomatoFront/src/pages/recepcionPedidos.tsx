import { useState } from "react";
import { ModalRecepcion } from "./ModalRecepcion"; 
import { Button } from "../components/ui/Button";
import { getPedidosService } from "../services/pedidoService";
import { useEffect } from "react";
import { Input } from "../components/ui/Input";

const PedidosPage = () => {
  const [pedidos, setPedidos] = useState<any[]>([]); 
  const [cargando, setCargando] = useState(true);    
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<any>(null);
  const [busqueda, setBusqueda] = useState("");

  const pedidosFiltrados = pedidos.filter(p =>
  p.proveedor?.toLowerCase().includes(busqueda.toLowerCase()) ||
  p.id?.toString().includes(busqueda)
);




  // Datos de ejemplo (lo que vendría de tu API)
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        const data = await getPedidosService();
        setPedidos(data);
      } catch (error) {
        console.error("Error cargando pedidos:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();

    
  }, []); 

  if (cargando) return <p>Cargando pedidos...</p>;

  return (
  
            <div className="h-full flex flex-col animate-fade-in-up">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Recepción de pedidos</h1>
                        <p className="text-gray-500 mt-1">Recibe los productos pedidos</p>
                    </div>
                </div>
    
                <div className="mb-6 w-full max-w-md mt-6">
                    <Input id="search-orders" type="text" placeholder="Buscar por proveedor o ID..." value={busqueda} onChange={setBusqueda}/>
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
              #{pedido.id_pedido}
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
              <Button
                variant="primario"
                className="py-2 px-4 h-auto inline-flex w-auto"
                onClick={() => setPedidoSeleccionado(pedido)}
              >
                Recibir
              </Button>
            </td>

          </tr>
        ))}
      </tbody>

    </table>
  </div>
</div>


      {/* 3. EL PUENTE:
          Si 'pedidoSeleccionado' tiene algo, mostramos el Modal.
          Le pasamos el objeto completo (que ya lleva el ID dentro). */}
      {pedidoSeleccionado && (
        <ModalRecepcion 
          pedido={pedidoSeleccionado} 
          onClose={() => setPedidoSeleccionado(null)} 
        />
      )}
    </div>
  );
};

export default PedidosPage;