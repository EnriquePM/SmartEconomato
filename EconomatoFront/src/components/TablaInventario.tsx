import type { Ingrediente } from "../types/ingrediente";

interface Props {
  data: Ingrediente[];
}

export const TablaInventario = ({ data }: Props) => {
  return (
    <div className="overflow-x-auto p-2">
      <table 
        className="w-full border-separate border-spacing-y-3" 
        aria-label="Tabla de inventario de productos"
      >
        {/* CABECERA */}
        <thead>
          <tr className="text-gray-500 text-sm">
            {/* Alineamos ID y Nombre a la izquierda, el resto centrado para que se vea ordenado */}
            <th scope="col" className="pb-2 px-4 font-bold text-left">ID</th>
            <th scope="col" className="pb-2 px-4 font-bold text-left">Nombre</th>
            <th scope="col" className="pb-2 px-4 font-bold text-center">Stock</th>
            <th scope="col" className="pb-2 px-4 font-bold text-center">Categoría</th>
            <th scope="col" className="pb-2 px-4 font-bold text-center">Proveedor</th>
          </tr>
        </thead>

        {/* CUERPO DE LA TABLA */}
        <tbody className="text-gray-700 font-medium text-sm">
          {data.map((item) => (
            <tr 
              key={item.id_ingrediente} 
              className="bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {/* ID: Borde redondeado a la izquierda */}
              <td className="py-4 px-4 rounded-l-lg text-left">
                {item.id_ingrediente}
              </td>

              {/* Nombre */}
              <td className="py-4 px-4 text-left text-black">
                {item.nombre}
              </td>

              {/* Stock: Centrado */}
              <td className="py-4 px-4 text-center">
                {item.stock}
              </td>

              {/* Categoría: Centrado */}
              <td className="py-4 px-4 text-center">
                {item.id_categoria}
              </td>

              {/* Proveedor: Borde redondeado a la derecha */}
              <td className="py-4 px-4 rounded-r-lg text-center">
                {item.id_proveedor}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};