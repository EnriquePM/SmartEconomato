import { useState, useMemo } from "react";
import { Search, Filter, RefreshCw } from "lucide-react";

// Hooks
import { useInventario } from "../hooks/useInventario";
import { useCategories } from "../hooks/useCategoria";

// Componentes UI
import Select from "../components/ui/select";
import { Input } from "../components/ui/Input";

const Inventario = () => {
  // 1. OBTENCIÓN DE DATOS (Hooks dinámicos)
  const { productos, loading: loadingProd, error, refetch } = useInventario();
  const categorias = useCategories();

  // 2. ESTADOS DE LA INTERFAZ
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");

  // 3. LÓGICA DE FILTRADO (Memorizada para mayor rendimiento)
const productosFiltrados = useMemo(() => {
  return productos.filter((p) => {
    const term = busqueda.toLowerCase().trim();
    const nombre = p.nombre ? p.nombre.toLowerCase() : "";
    const codigo = p.id ? String(p.id).toLowerCase() : ""; // Forzamos string por si es numérico

    const coincideTexto = nombre.includes(term) || codigo.includes(term);
    
    const coincideCat = 
      filtroCategoria === "todos" || 
      p.categoria === filtroCategoria;

    return coincideTexto && coincideCat;
  });
}, [productos, busqueda, filtroCategoria]);

  // 4. PREPARAR OPCIONES PARA EL SELECT
  const opcionesSelect = useMemo(() => [
    { value: "todos", label: "Todas las categorías" },
    ...categorias
  ], [categorias]);

  // Estados de carga y error
  if (loadingProd) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <RefreshCw className="animate-spin text-red-600" size={40} />
        <p className="text-gray-500 font-medium">Cargando inventario dinámico...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center bg-red-50 rounded-xl border border-red-100">
        <p className="text-red-600 font-bold mb-4">{error}</p>
        <button 
          onClick={refetch}
          className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
        >
          Reintentar conexión
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* CABECERA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventario General</h1>
          <p className="text-gray-500">Gestión de stock</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold border border-blue-100">
          Total: {productosFiltrados.length} productos
        </div>
      </div>

      {/* BARRA DE HERRAMIENTAS */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        {/* Buscador */}
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            <Search size={18} />
          </span>
          <Input 
            id="search-inventory"
            type="text"
            placeholder="Buscar por nombre o código..."
            value={busqueda}           
            onChange={setBusqueda}     
            className="pl-12"          
          />
        </div>

        {/* Filtro de Categoría Dinámico */}
        <div className="w-full md:w-72 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            <Filter size={16} />
          </span>
          <Select 
            id="category-filter"
            value={filtroCategoria}
            onChange={setFiltroCategoria}
            options={opcionesSelect}
            className="pl-12"
            placeholder="Filtrar por categoría"
          />
        </div>
      </div>

      {/* TABLA DE RESULTADOS */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-400 uppercase text-xs font-bold">
              <tr>
                <th className="p-4">Código</th>
                <th className="p-4">Nombre</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Proveedor</th>
                <th className="p-4 text-center">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {productosFiltrados.length > 0 ? (
                productosFiltrados.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                     <td className="p-4">
                      <span className="p-4 text-sm text-gray-500">
                        {item.id}
                      </span>
                      </td>
                       <td className="p-4">
                      <span className="p-4 text-sm text-gray-500">
                        {item.nombre}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {item.categoria}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {item.proveedor}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        item.stock <= item.stockMinimo 
                        ? 'bg-red-50 text-red-700 border-red-100' 
                        : 'bg-green-50 text-green-700 border-green-100'
                      }`}>
                        {item.stock} u.
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-400">
                    No se encontraron productos con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventario;