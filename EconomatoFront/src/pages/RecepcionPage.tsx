import { useState } from "react";
import { ModalRecepcion } from "./ModalRecepcion";



const PedidosPage = () => {
  // Estado para el modal: null = cerrado, {pedido} = abierto
  const [pedidoParaRecibir, setPedidoParaRecibir] = useState<any | null>(null);

  return (
    <div className="p-8">
      {/* ... Tu tabla de pedidos ... */}
      <button 
        onClick={() => setPedidoParaRecibir(pedidoActual)}
        className="text-blue-600 font-bold"
      >
        Recibir
      </button>

      {/* Renderizado condicional del Modal */}
      {pedidoParaRecibir && (
        <ModalRecepcion 
          pedido={pedidoParaRecibir} 
          onClose={() => setPedidoParaRecibir(null)} 
        />
      )}
    </div>
  );
};