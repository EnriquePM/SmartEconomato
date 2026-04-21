import type { Ingrediente } from "../../types/ingrediente";

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
        <thead>
          <tr className="text-gray-500 text-sm">
            <th scope="col" className="pb-2 px-4 font-bold text-left">ID</th>
            <th scope="col" className="pb-2 px-4 font-bold text-left">Nombre</th>
            <th scope="col" className="pb-2 px-4 font-bold text-center">Stock</th>
            <th scope="col" className="pb-2 px-4 font-bold text-center">Categoría</th>
            <th scope="col" className="pb-2 px-4 font-bold text-center">Proveedor</th>
          </tr>
        </thead>

        <tbody className="text-gray-700 font-medium text-sm">
          {data.map((item) => (
            <tr 
              key={item.id_ingrediente} 
              className="bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <td className="py-4 px-4 rounded-l-lg text-left">
                {item.id_ingrediente}
              </td>

              <td className="py-4 px-4 text-left text-black">
                {item.nombre}
              </td>


              <td className="py-4 px-4 text-center">
                {item.stock}
              </td>


              <td className="py-4 px-4 text-center">
                {item.id_categoria}
              </td>


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