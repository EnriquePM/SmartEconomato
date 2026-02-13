import { useState, useMemo } from "react";
import { Search, Filter, Loader2 } from "lucide-react";
import { useInventario } from "../hooks/useInventario";
import { useCategorias } from "../hooks/useCategoria";
import { useProveedores } from "../hooks/useProveedor";
import Input from "../components/ui/Input"; 
import Select from "../components/ui/select";


const Inventario = () => {
  // --- ESTADOS DE UI ---
  const [vista, setVista] = useState<'ingredientes' | 'utensilios'>('ingredientes');
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [orden, setOrden] = useState<{ campo: string; asc: boolean }>({ campo: 'nombre', asc: true });

  // --- HOOKS DE DATOS (Arquitectura Limpia) ---
  const { items, loading, error, refetch } = useInventario(vista);
  const { categorias, options: categoriaOptions } = useCategorias();
  const { proveedores } = useProveedores();

  // --- LÓGICA DE FILTRADO Y ORDENACIÓN ---
  const productosFiltrados = useMemo(() => {
    // 1. Filtrar
  const filtrados = items.filter((item) => {
    const texto = busqueda.toLowerCase();
    
    // Buscamos por nombre (String) e id. 
    const nombreMatch = item.nombre.toLowerCase().includes(texto);
    const idMatch = item.id.toString().includes(texto);
    const categoriaMatch = filtroCategoria === "todos" || String(item.id_categoria) === filtroCategoria;
    /*Buscamos por código de barra, funcionalidad futura
    const codigoMatch = item.codigo 
      ? item.codigo.toString().toLowerCase().includes(texto) 
      : false;
    */
  
    return (nombreMatch || idMatch) && categoriaMatch;
  });

    // 2. Ordenar
    return [...filtrados].sort((a, b) => {
      let valorA = a[orden.campo as keyof typeof a] ?? '';
      let valorB = b[orden.campo as keyof typeof b] ?? '';

      if (typeof valorA === 'string') {
        valorA = valorA.toLowerCase();
        valorB = (valorB as string).toLowerCase();
      }

      if (valorA < valorB) return orden.asc ? -1 : 1;
      if (valorA > valorB) return orden.asc ? 1 : -1;
      return 0;
    });
  }, [items, busqueda, filtroCategoria, orden]);

  // --- HELPERS ---
  const getNombreCategoria = (idCat: number) => {
    return categorias.find(c => c.id === idCat)?.nombre || "Sin categoría";
  };
  const getNombreProveedor = (idPro: number | undefined) => {
  if (!idPro) return "Sin proveedor"; 
  return proveedores.find(p => p.id_proveedor === idPro)?.nombre || "Sin proveedor";
};

  const cambiarOrden = (campo: string) => {
    setOrden(prev => ({ campo, asc: prev.campo === campo ? !prev.asc : true }));
  };

  if (error) {
    return (
      <div className="p-10 text-center bg-red-50 rounded-xl border border-red-100">
        <p className="text-red-600 font-bold mb-4">Error al conectar con el servidor</p>
        <button onClick={refetch} className="bg-red-600 text-white px-6 py-2 rounded-full">Reintentar</button>
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
          Total: {productosFiltrados.length} registros
        </div>
      </div>

      {/* --- ZONA DE PESTAÑAS (DISEÑO SOLAPAS) --- */}
      <div className="flex gap-2 mt-8 pl-2 relative items-end">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-200 z-0"></div>

        <button
          onClick={() => { setVista('ingredientes'); setFiltroCategoria('todos'); }}
          className={`px-8 py-4 rounded-t-[1.5rem] text-sm font-bold transition-all relative z-10 border-t border-l border-r ${
            vista === 'ingredientes'
              ? 'bg-white text-red-600 border-gray-200 border-b-white -mb-px pt-4 shadow-[0_-2px_3px_rgba(0,0,0,0.02)]'
              : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200 py-3'
          }`}
        >
          PRODUCTOS
        </button>

        <button
          onClick={() => { setVista('utensilios'); setFiltroCategoria('todos'); }}
          className={`px-8 py-4 rounded-t-[1.5rem] text-sm font-bold transition-all relative z-10 border-t border-l border-r ${
            vista === 'utensilios'
              ? 'bg-white text-red-600 border-gray-200 border-b-white -mb-px pt-4 shadow-[0_-2px_3px_rgba(0,0,0,0.02)]'
              : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200 py-3'
          }`}
        >
          UTENSILIOS
        </button>
      </div>

      {/* BARRA DE HERRAMIENTAS - USANDO TUS COMPONENTES UI */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Input
            id="search-inventory"
            type="text"
            placeholder="Buscar por nombre o código..."
            value={busqueda}
            onChange={(val) => setBusqueda(val)}
            className="pl-12"
          />
        </div>

        <div className="min-w-[200px]">
          <Select
            id="categoria-filter"
            value={filtroCategoria}
            options={[
              { value: "todos", label: "Todas las categorías" },
              ...categoriaOptions
            ]}
            onChange={(val) => setFiltroCategoria(val)}
          />
        </div>
      </div>

      {/* TABLA DE RESULTADOS */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-400 uppercase text-xs font-bold">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Nombre</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Proveedor</th>
                <th className="p-4 text-center">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                 <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex justify-center items-center gap-3 text-gray-400">
                      <Loader2 className="animate-spin" />
                      <span>Cargando almacén...</span>
                    </div>
                  </td>
                </tr>
              ) : productosFiltrados.length > 0 ? (
                productosFiltrados.map((item) => (
                  <tr key={`${item.id}`} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 border border-gray-200">
                        {item.id}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-gray-900 tracking-tight">
                      {item.nombre}
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {getNombreCategoria(item.id_categoria)}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {getNombreProveedor(item.id_proveedor)}
                    </td>
                    <td className="p-4 text-center">
                      <div className={`inline-block px-3 py-1 rounded-lg text-xs font-black ${
                        item.stock < 10 
                          ? 'bg-red-50 text-red-600 border border-red-100' 
                          : 'bg-green-50 text-green-700 border border-green-100'
                      }`}>
                        {item.stock} <span className="opacity-60 text-[10px]">{item.unidad}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400 font-medium">
                    No se encontraron resultados en {vista}.
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