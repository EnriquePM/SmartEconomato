import { useState, useEffect } from "react";
import { Search, Filter, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

// --- INTERFACES ---
interface Categoria {
  id_categoria: number;
  nombre: string;
}

interface Producto {
  id: number;
  codigo?: string;
  nombre: string;
  stock: number;
  unidad?: string;      // Nuevo: Para saber si son Kg, Litros, etc.
  precio?: number;
  id_categoria: number; 
  tipo: 'ingrediente' | 'material'; // Tipado estricto
}

const Inventario = () => {
  // --- ESTADOS ---
  const [productos, setProductos] = useState<Producto[]>([]);
  const [listaCategorias, setListaCategorias] = useState<Categoria[]>([]); // Lista dinámica para el filtro
  
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  
  const [vista, setVista] = useState<'ingredientes' | 'utensilios'>('ingredientes');
  const [orden, setOrden] = useState<{ campo: string, asc: boolean } | null>(null);

  // --- EFECTO 1: CARGAR CATEGORÍAS (Para el filtro dinámico) ---
  useEffect(() => {
    fetch("http://localhost:3000/api/categorias")
      .then(res => res.json())
      .then(data => setListaCategorias(data))
      .catch(err => console.error("Error cargando categorías:", err));
  }, []);

  // --- EFECTO 2: CARGAR PRODUCTOS/MATERIALES ---
  useEffect(() => {
    const endpoint = vista === 'ingredientes' 
        ? "http://localhost:3000/api/ingredientes" 
        : "http://localhost:3000/api/materiales";

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error("Error en la respuesta del servidor");
        return res.json();
      })
      .then((data) => {
          if (!Array.isArray(data)) {
              console.error("El servidor no devolvió una lista:", data);
              setProductos([]);
              return;
          }

          // --- LOGICA DE ADAPTACIÓN DE DATOS ---
          if (vista === 'utensilios') {
             // Mapeo para Materiales
             const materialesAdaptados = data.map((m: any) => ({
                 id: m.id_material,
                 nombre: m.nombre,
                 // Convertimos código a String para evitar error .includes()
                 codigo: m.codigo ? m.codigo.toString() : `MAT-${m.id_material}`,
                 
                 stock: Number(m.stock || 0),        // Aseguramos número
                 unidad: m.unidad_medida || 'u.',    // Unidad por defecto
                 
                 // Usamos el ID numérico real de la categoría
                 id_categoria: m.id_categoria || 0,
                 tipo: 'material' as const           // Tipado estricto
             }));
             setProductos(materialesAdaptados);

          } else {
             // Mapeo para Ingredientes
             const ingredientesAdaptados = data.map((i: any) => ({
                 id: i.id_ingrediente,
                 nombre: i.nombre,
                 codigo: i.codigo || `ING-${i.id_ingrediente}`,
                 
                 stock: Number(i.stock_actual || i.stock || 0),
                 unidad: i.unidad_medida || 'u.',

                 id_categoria: i.id_categoria,
                 tipo: 'ingrediente' as const
             }));
             setProductos(ingredientesAdaptados);
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
    
    // Buscamos por nombre
    const nombreMatch = producto.nombre.toLowerCase().includes(texto);
    
    // Buscamos por código (Protegido con toString por seguridad)
    const codigoMatch = producto.codigo 
        ? producto.codigo.toString().toLowerCase().includes(texto) 
        : false;
    
    const coincideTexto = nombreMatch || codigoMatch;

    // Filtro de categoría (Numérico)
    const coincideCategoria = 
        filtroCategoria === "todos" || 
        producto.id_categoria.toString() === filtroCategoria;

    return coincideTexto && coincideCategoria;
  });

  // --- LÓGICA DE ORDENACIÓN ---
  const productosFinales = [...productosFiltrados].sort((a, b) => {
      if (!orden) return 0;
      let valorA: any, valorB: any;
      
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

  const cambiarOrden = (campo: string) => {
      setOrden(prev => (prev && prev.campo === campo ? { campo, asc: !prev.asc } : { campo, asc: true }));
  };

  const IconoOrden = ({ campo }: { campo: string }) => {
      if (orden?.campo !== campo) return <ArrowUpDown size={14} className="text-gray-300" />;
      return orden.asc ? <ArrowUp size={14} className="text-red-600" /> : <ArrowDown size={14} className="text-red-600" />;
  };

  // Función mejorada para mostrar el nombre de la categoría buscando en la lista cargada
  const renderizarCategoria = (idCat: number) => {
      // 1. Buscamos en la lista dinámica que cargamos de la BD
      const catEncontrada = listaCategorias.find(c => c.id_categoria === idCat);
      if (catEncontrada) return <span className="capitalize">{catEncontrada.nombre}</span>;

      // 2. Fallback manual (por si acaso falla la carga o son IDs antiguos)
      switch (idCat) {
          case 1: return "Aceites / Limpieza";
          case 2: return "Granos / Menaje";
          case 3: return "Conservas";
          case 4: return "Lácteos";
          case 5: return "Condimentos";
          default: return "Otro";
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

      {/* --- PESTAÑAS --- */}
      <div className="flex gap-2 border-b border-gray-200 items-end pl-2">
        <button
          onClick={() => setVista('ingredientes')}
          className={`
            relative px-8 py-3 rounded-t-[2rem] font-bold text-sm transition-all duration-200 border-t border-l border-r
            ${vista === 'ingredientes'
              ? 'bg-white text-red-600 border-red-500 border-b-white -mb-px z-10 shadow-[0_-4px_10px_-2px_rgba(255,0,0,0.1)] pt-4'
              : 'bg-gray-100 text-gray-400 border-transparent hover:bg-red-50 hover:text-red-500 mb-1 scale-95 origin-bottom'
            }
          `}
        >
          PRODUCTOS
        </button>

        <button
          onClick={() => setVista('utensilios')}
          className={`
            relative px-8 py-3 rounded-t-[2rem] font-bold text-sm transition-all duration-200 border-t border-l border-r
            ${vista === 'utensilios'
              ? 'bg-white text-red-600 border-red-500 border-b-white -mb-px z-10 shadow-[0_-4px_10px_-2px_rgba(255,0,0,0.1)] pt-4'
              : 'bg-gray-100 text-gray-400 border-transparent hover:bg-red-50 hover:text-red-500 mb-1 scale-95 origin-bottom'
            }
          `}
        >
          UTENSILIOS
        </button>
      </div>

      {/* BARRA DE HERRAMIENTAS */}
      <div className="bg-white p-4 rounded-b-xl rounded-tr-[2rem] shadow-sm border border-gray-100 border-t-0 flex flex-col md:flex-row gap-4">
        
        {/* Buscador */}
        <div className="flex-1 relative">
            <span className="absolute left-3 top-3 text-gray-400"><Search size={18} /></span>
            <input 
                type="text" 
                placeholder={`Buscar ${vista === 'ingredientes' ? 'producto' : 'utensilio'}...`}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            />
        </div>

        {/* --- FILTRO CATEGORÍA DINÁMICO --- */}
        <div className="relative">
             <span className="absolute left-3 top-3 text-gray-500"><Filter size={16} /></span>
            <select 
                className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg bg-gray-50 cursor-pointer outline-none focus:ring-2 focus:ring-red-500 appearance-none"
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
            >
                <option value="todos">Todas las categorías</option>

                {/* Si estamos en ingredientes, mostramos las categorías fijas (o podrías usar las dinámicas también) */}
                {vista === 'ingredientes' ? (
                    <>
                        {listaCategorias.map((cat) => (
                            <option key={cat.id_categoria} value={cat.id_categoria}>
                                {cat.nombre}
                            </option>
                        ))}
                        {listaCategorias.length === 0 && <option disabled>Cargando categorías...</option>}
                    </>
                ) : (
                    /* AQUÍ ESTÁ EL CAMBIO: Categorías dinámicas para Utensilios/Materiales */
                    <>
                        {listaCategorias.map((cat) => (
                            <option key={cat.id_categoria} value={cat.id_categoria}>
                                {cat.nombre}
                            </option>
                        ))}
                        {listaCategorias.length === 0 && <option disabled>Cargando categorías...</option>}
                    </>
                )}
            </select>
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 border border-gray-200">
                                        {item.codigo}
                                    </span>
                                ) : (
                                    <span className="text-xs text-gray-300 italic">Sin código</span>
                                )}
                            </td>
                            <td className="p-4 font-medium text-gray-900">{item.nombre}</td>
                            
                            {/* Renderizamos el nombre de la categoría basándonos en el ID */}
                            <td className="p-4 text-sm text-gray-500">
                                {renderizarCategoria(item.id_categoria)}
                            </td>
                            
                            <td className="p-4 text-center">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    item.stock < 10 ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'
                                }`}>
                                    {/* Mostramos Stock + Unidad Dinámica */}
                                    {item.stock} {item.unidad}
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
  );
};

export default Inventario;