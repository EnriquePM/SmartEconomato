import { useState, useEffect } from "react";
import { Search, Filter, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import Select from "../components/ui/select";
import Input from "../components/ui/Input";

// Definición de tipos
interface Producto {
  id: string | number;
  codigo?: string;
  nombre: string;
  stock: number;
  id_categoria: number | string; 
  id_proveedor?: number;
  categoria?: string; 
  ubicacion?: string; 
  estado?: string;
}

const Inventario = () => {
  // --- ESTADOS ---
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  
  // Estado para la vista (Productos vs Utensilios) y Ordenación
  const [vista, setVista] = useState<'ingredientes' | 'utensilios'>('ingredientes');
  const [orden, setOrden] = useState<{ campo: string, asc: boolean } | null>(null);

  // --- EFECTO DE CARGA DE DATOS ---
  useEffect(() => {
    // Seleccionamos la URL según la pestaña activa
    const endpoint = vista === 'ingredientes' 
        ? "http://localhost:3000/ingredientes" 
        : "http://localhost:3000/utensilios";

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
          if (vista === 'utensilios') {
             // Normalizamos datos de utensilios
             const utensiliosFormateados = data.map((u: any) => ({
                 ...u,
                 id_categoria: u.categoria || "General" 
             }));
             setProductos(utensiliosFormateados);
          } else {
             setProductos(data);
          }
      })
      .catch((err) => {
        console.error(`Error cargando ${vista}:`, err);
        setProductos([]); 
      });
    
    // Reseteamos filtros al cambiar de pestaña
    setBusqueda("");
    setFiltroCategoria("todos");
    setOrden(null);

  }, [vista]);

  // --- LÓGICA DE FILTRADO ---
  const productosFiltrados = productos.filter((producto) => {
    const texto = busqueda.toLowerCase();
    const coincideTexto = 
        producto.nombre.toLowerCase().includes(texto) || 
        (producto.codigo && producto.codigo.toLowerCase().includes(texto));

    const coincideCategoria = 
        filtroCategoria === "todos" || 
        producto.id_categoria.toString() === filtroCategoria;

    return coincideTexto && coincideCategoria;
  });

  // --- LÓGICA DE ORDENACIÓN ---
  const productosFinales = [...productosFiltrados].sort((a, b) => {
      if (!orden) return 0;
      let valorA, valorB;
      
      if (orden.campo === 'nombre') {
          valorA = a.nombre.toLowerCase();
          valorB = b.nombre.toLowerCase();
      } else if (orden.campo === 'stock') {
          valorA = a.stock;
          valorB = b.stock;
      } else if (orden.campo === 'categoria') {
          valorA = a.id_categoria;
          valorB = b.id_categoria;
      } else {
          return 0;
      }

      if (valorA < valorB) return orden.asc ? -1 : 1;
      if (valorA > valorB) return orden.asc ? 1 : -1;
      return 0;
  });

  // Funciones auxiliares de ordenación
  const cambiarOrden = (campo: string) => {
      if (orden && orden.campo === campo) {
          setOrden({ campo, asc: !orden.asc });
      } else {
          setOrden({ campo, asc: true });
      }
  };

  const IconoOrden = ({ campo }: { campo: string }) => {
      if (orden?.campo !== campo) return <ArrowUpDown size={14} className="text-gray-300" />;
      return orden.asc ? <ArrowUp size={14} className="text-red-600" /> : <ArrowDown size={14} className="text-red-600" />;
  };

  // Renderizado condicional de categorías
  const renderizarCategoria = (producto: Producto) => {
    if (vista === 'utensilios') return <span className="capitalize">{producto.id_categoria}</span>;
    switch (Number(producto.id_categoria)) {
        case 1: return "Aceites";
        case 2: return "Granos";
        case 3: return "Conservas";
        case 4: return "Lácteos";
        case 5: return "Condimentos";
        default: return "Varios";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* CABECERA */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventario General</h1>
          <p className="text-gray-500">Gestión de stock y existencias en tiempo real.</p>
        </div>
        
        <div className="flex gap-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center border ${
                vista === 'utensilios' 
                ? 'bg-red-50 text-red-700 border-red-100' 
                : 'bg-blue-50 text-blue-700 border-blue-100'
            }`}>
                Total: {productos.length} {vista === 'ingredientes' ? 'productos' : 'utensilios'}
            </span>
        </div>
      </div>

      {/* --- ZONA DE PESTAÑAS (DISEÑO PULIDO) --- */}
      <div className="flex gap-2 mt-4 pl-2 relative items-end">
        {/* Línea base gris */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-200 z-0"></div>

        {/* PESTAÑA PRODUCTOS */}
        <button
          onClick={() => setVista('ingredientes')}
          className={`px-8 py-4 rounded-t-[1.5rem] text-sm font-bold transition-all relative z-10 border-t border-l border-r ${
            vista === 'ingredientes'
              ? 'bg-white text-red-600 border-gray-200 border-b-white -mb-px pt-4 shadow-[0_-2px_3px_rgba(0,0,0,0.02)]'
              : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200 py-3'
          }`}
        >
          PRODUCTOS
        </button>

        {/* PESTAÑA UTENSILIOS */}
        <button
          onClick={() => setVista('utensilios')}
          className={`px-8 py-4 rounded-t-[1.5rem] text-sm font-bold transition-all relative z-10 border-t border-l border-r ${
            vista === 'utensilios'
              ? 'bg-white text-red-600 border-gray-200 border-b-white -mb-px pt-4 shadow-[0_-2px_3px_rgba(0,0,0,0.02)]'
              : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200 py-3'
          }`}
        >
          UTENSILIOS
        </button>
      </div>

      {/* BARRA DE HERRAMIENTAS */}
      <div className="bg-white p-4 rounded-b-xl rounded-tr-[2rem] shadow-sm border border-gray-100 border-t-0 flex flex-col md:flex-row gap-4 mt-0">
        
        {/* Buscador */}
        <div className="flex-1 relative">
            <span className="absolute left-3 top-3 text-gray-400"><Search size={18} /></span>
            <Input 
                id="buscador-inventario" 
                type="text" 
                placeholder={`Buscar ${vista === 'ingredientes' ? 'producto' : 'utensilio'}...`}
                value={busqueda}           
                onChange={setBusqueda}     
                className="pl-12"          
            />
        </div>

        {/* Filtro Categoría */}
        <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secundario z-10 pointer-events-none">
                <Filter size={16} />
            </span>
            <Select 
                value={filtroCategoria}
                onChange={(val) => setFiltroCategoria(val)} 
                className="pl-12" 
            >
                <option value="todos">Todas las categorías</option>
                {vista === 'ingredientes' ? (
                    <>
                        <option value="1">Aceites y Grasas</option>
                        <option value="2">Granos y Harinas</option>
                        <option value="3">Conservas</option>
                        <option value="4">Lácteos y Huevos</option>
                        <option value="5">Condimentos</option>
                    </>
                ) : (
                    <>
                        <option value="Menaje">Menaje General</option>
                        <option value="Cuchillos">Cuchillería</option>
                        <option value="Sartenes">Sartenes y Ollas</option>
                        <option value="Electrico">Pequeño Electrodoméstico</option>
                        <option value="Limpieza">Material de Limpieza</option>
                        <option value="Textil">Textil / Uniformes</option>
                    </>
                )}
            </Select>
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
                    <tr>
                        <th className="p-4">Código</th>
                        <th className="p-4 cursor-pointer" onClick={() => cambiarOrden('nombre')}>
                            <div className="flex items-center gap-2">
                                {vista === 'ingredientes' ? 'Producto' : 'Utensilio'} <IconoOrden campo="nombre" />
                            </div>
                        </th>
                        <th className="p-4 cursor-pointer" onClick={() => cambiarOrden('categoria')}>
                            <div className="flex items-center gap-2">
                                Categoría <IconoOrden campo="categoria" />
                            </div>
                        </th>
                        <th className="p-4 text-center cursor-pointer" onClick={() => cambiarOrden('stock')}>
                            <div className="flex items-center justify-center gap-2">
                                Stock <IconoOrden campo="stock" />
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {productosFinales.length > 0 ? (
                        productosFinales.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    {item.codigo ? (
                                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 border border-gray-200">{item.codigo}</span>
                                    ) : (
                                        <span className="text-xs text-gray-300 italic">Sin código</span>
                                    )}
                                </td>
                                <td className="p-4 font-medium text-gray-900">{item.nombre}</td>
                                <td className="p-4 text-sm text-gray-500">{renderizarCategoria(item)}</td>
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
                                No se encontraron {vista === 'ingredientes' ? 'productos' : 'utensilios'}.
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