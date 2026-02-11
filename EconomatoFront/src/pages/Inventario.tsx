import { useState, useEffect } from "react";
import { Package, Search, Filter } from "lucide-react";

interface Producto {
  id: number;         
  codigo?: string;
  nombre: string;
  stock: number;
  precio?: number;     
  id_categoria: number; 
  id_proveedor?: number; 
}

const Inventario = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");

  useEffect(() => {
    fetch("http://localhost:3000/api/ingredientes")
      .then((res) => {
        if (!res.ok) throw new Error("Error en la respuesta del servidor");
        return res.json();
      })
      .then((data) => {
        console.log("Datos recibidos del Backend:", data); 
        setProductos(data);
      })
      .catch((err) => console.error("Error cargando inventario:", err));
  }, []);

  const productosFiltrados = productos.filter((producto) => {
    const texto = busqueda.toLowerCase();
    // Validamos que producto.nombre y codigo existan antes de usar includes (por seguridad)
    const nombreMatch = producto.nombre ? producto.nombre.toLowerCase().includes(texto) : false;
    const codigoMatch = producto.codigo ? producto.codigo.includes(texto) : false;
    
    const coincideTexto = nombreMatch || codigoMatch;

    const coincideCategoria = 
        filtroCategoria === "todos" || 
        producto.id_categoria.toString() === filtroCategoria;

    return coincideTexto && coincideCategoria;
  });

  return (
    <div className="space-y-6">
      
      {/* CABECERA */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gray-100 rounded-lg text-gray-800">
             <Package size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventario General</h1>
            <p className="text-gray-500">Gestión de stock y existencias en tiempo real.</p>
          </div>
        </div>
        
        <div className="flex gap-2">
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full flex items-center border border-blue-100">
                Total: {productos.length} productos
            </span>
        </div>
      </div>

      {/* BARRA DE HERRAMIENTAS */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        
        {/* Buscador */}
        <div className="flex-1 relative">
            <span className="absolute left-3 top-3 text-gray-400">
                <Search size={18} />
            </span>
            <input 
                type="text" 
                placeholder="Buscar por nombre o código de barras..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            />
        </div>

        {/* Filtro Categoría */}
        <div className="relative">
             <span className="absolute left-3 top-3 text-gray-500">
                <Filter size={16} />
             </span>
            <select 
                className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg bg-gray-50 cursor-pointer outline-none focus:ring-2 focus:ring-gray-900 appearance-none"
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
            >
                <option value="todos">Todas las categorías</option>
                <option value="1">Aceites y Grasas</option>
                <option value="2">Granos y Harinas</option>
                <option value="3">Conservas</option>
                <option value="4">Lácteos y Huevos</option>
                <option value="5">Condimentos</option>
            </select>
        </div>
      </div>

      {/* TABLA DE PRODUCTOS */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
                <tr>
                    <th className="p-4">Código (EAN)</th>
                    <th className="p-4">Producto</th>
                    <th className="p-4">Categoría</th>
                    <th className="p-4 text-center">Stock</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {productosFiltrados.length > 0 ? (
                    productosFiltrados.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                                {item.codigo ? (
                                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 border border-gray-200">
                                        {item.codigo}
                                    </span>
                                ) : (
                                    <span className="text-xs text-gray-300 italic">Sin código</span>
                                )}
                            </td>

                            <td className="p-4 font-medium text-gray-900">{item.nombre}</td>
                            
                            <td className="p-4 text-sm text-gray-500">
                                {/* NOTA: Esto asume que tus IDs de categoría en base de datos coinciden con estos números */}
                                {item.id_categoria === 1 && "Aceites"}
                                {item.id_categoria === 2 && "Granos"}
                                {item.id_categoria === 3 && "Conservas"}
                                {item.id_categoria === 4 && "Lácteos"}
                                {item.id_categoria === 5 && "Condimentos"}
                                {/* Si viene una categoría que no está en la lista, mostramos el ID */}
                                {![1,2,3,4,5].includes(item.id_categoria) && `Cat. ${item.id_categoria}`}
                            </td>

                            <td className="p-4 text-center">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    item.stock < 10 ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'
                                }`}>
                                    {item.stock} u.
                                </span>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={4} className="p-8 text-center text-gray-400">
                            No se encontraron productos.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventario;