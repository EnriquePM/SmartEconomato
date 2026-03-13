import { useState } from "react";
import { ModalRecepcion } from "./ModalRecepcion"; // El siguiente pasO
import { Button } from "./../components/ui/Button";
import { getPedidosService } from "../services/pedidoService";
import { useEffect } from "react";

const PedidosPage = () => {
  const [pedidos, setPedidos] = useState<any[]>([]); // Estado para la lista
  const [cargando, setCargando] = useState(true);    // Estado para el skeleton/loader
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<any>(null);

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
  }, []); // [] significa: "Ejecuta esto solo una vez, al montar la página"

  if (cargando) return <p>Cargando pedidos...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-black mb-6">Pedidos de Compra</h1>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="p-4 text-[10px] font-black text-gray-400 uppercase">ID</th>
              <th className="p-4 text-[10px] font-black text-gray-400 uppercase">Proveedor</th>
              <th className="p-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {pedidos.map((pedido) => (
              <tr key={pedido.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-bold">#{pedido.id}</td>
                <td className="p-4 text-gray-600 font-medium">{pedido.proveedor}</td>
                <td className="p-4 text-right">
                  {/* 2. AQUÍ METEMOS EL ID: 
                      Al hacer click, guardamos TODO el objeto pedido en el estado */}
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