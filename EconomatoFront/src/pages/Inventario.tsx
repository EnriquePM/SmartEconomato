import { useState, useEffect } from "react";
import { Package, Search, Filter,  ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { authFetch } from "../services/auth-service";

// IMPORTAMOS NUESTROS COMPONENTES UI
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/select";

interface Producto {
  id: string | number;
  codigo?: string;
  nombre: string;
  stock: number;
  precio?: number;     
  id_categoria: number; 
  id_proveedor?: number; 
  alergenos?: { id_alergeno: number, nombre: string }[];
}

const Inventario = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  
  // ESTADO VISTA
  const [vista, setVista] = useState<'ingredientes' | 'utensilios'>('ingredientes');
  const [orden, setOrden] = useState<{ campo: string, asc: boolean } | null>(null);

  // --- EFECTO DE CARGA DE DATOS ---
  useEffect(() => {
    const endpoint = vista === 'ingredientes' 
        ? "http://localhost:3000/api/ingredientes" 
        : "http://localhost:3000/api/materiales";

    authFetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error("Error en la respuesta del servidor");
        return res.json();
      })
      .then((data) => {
          if (!Array.isArray(data)) {
              console.error("El servidor devolvió algo raro (no es una lista):", data);
              setProductos([]);
              return;
          }

          if (vista === 'utensilios') {
             const materialesAdaptados = data.map((m: any) => ({
                 id: m.id_material,
                 nombre: m.nombre,
                 codigo: 'MAT-' + m.id_material,
                 stock: 0,
                 id_categoria: m.categoria ? m.categoria.nombre : (m.id_categoria || "General"),
                 tipo: 'material'
             }));
             setProductos(materialesAdaptados);
          } else {
             const ingredientesAdaptados = data.map((i: any) => ({
                 id: i.id_ingrediente,
                 nombre: i.nombre,
                 codigo: i.codigo || 'ING-' + i.id_ingrediente,
                 stock: i.stock_actual || i.stock || 0,
                 id_categoria: i.id_categoria,
                 tipo: 'ingrediente',
                 alergenos: i.alergenos || []
             }));
             setProductos(ingredientesAdaptados);
          }
      })
      .catch((err) => {
        console.error(`Error cargando ${vista}:`, err);
        setProductos([]); 
      });
    
    // Reseteo de filtros visuales
    setBusqueda("");
    setFiltroCategoria("todos");
    setOrden(null);

  }, [vista]);

  // --- LÓGICA DE FILTRADO Y ORDENACIÓN ---
  const productosFiltrados = productos.filter((producto) => {
    const texto = busqueda.toLowerCase();
    const nombreMatch = producto.nombre ? producto.nombre.toLowerCase().includes(texto) : false;
    const codigoMatch = producto.codigo ? producto.codigo.toLowerCase().includes(texto) : false;
    
    const coincideTexto = nombreMatch || codigoMatch;

    const coincideCategoria = 
        filtroCategoria === "todos" || 
        producto.id_categoria.toString() === filtroCategoria;

    return coincideTexto && coincideCategoria;
  });

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

  // --- OPCIONES PARA EL SELECT DE FILTRO ---
  const opcionesFiltro = vista === 'ingredientes' ? [
    { value: "todos", label: "Todas las categorías" },
    { value: "1", label: "Aceites y Grasas" },
    { value: "2", label: "Granos y Harinas" },
    { value: "3", label: "Conservas" },
    { value: "4", label: "Lácteos y Huevos" },
    { value: "5", label: "Condimentos" }
  ] : [
    { value: "todos", label: "Todas las categorías" },
    { value: "Menaje", label: "Menaje General" },
    { value: "Cuchillos", label: "Cuchillería" },
    { value: "Sartenes", label: "Sartenes y Ollas" },
    { value: "Electrico", label: "Pequeño Electrodoméstico" },
    { value: "Limpieza", label: "Material de Limpieza" },
    { value: "Textil", label: "Textil / Uniformes" }
  ];

  return (
    <div className="space-y-0 animate-fade-in flex flex-col h-full">
      
      {/* CABECERA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Inventario General</h1>
          <p className="text-gray-500 mt-1 font-medium text-sm">Gestión de stock y existencias en tiempo real.</p>
        </div>
        
        <div className="flex gap-2">
            <span className={`text-xs font-bold px-4 py-2 rounded-full flex items-center border ${
                vista === 'utensilios' 
                ? 'bg-red-50 text-red-700 border-red-100' 
                : 'bg-blue-50 text-blue-700 border-blue-100'
            }`}>
                Total: {productos.length} {vista === 'ingredientes' ? 'productos' : 'utensilios'}
            </span>
        </div>
      </div>

      {/* --- ZONA DE PESTAÑAS ESTILO INGRESO --- */}
      <div className="flex gap-2 mt-2 pl-2 relative items-end shrink-0">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-200 z-0"></div>
        <button
          onClick={() => setVista('ingredientes')}
          className={`px-10 py-3 rounded-t-[1.5rem] text-sm font-bold transition-all relative z-10 border-t border-l border-r ${vista === 'ingredientes' ? 'bg-white text-red-600 border-gray-200 border-b-white -mb-px pt-3 shadow-[0_-2px_3px_rgba(0,0,0,0.02)]' : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200 py-2'}`}
        >
          PRODUCTOS
        </button>
        <button
          onClick={() => setVista('utensilios')}
          className={`px-10 py-3 rounded-t-[1.5rem] text-sm font-bold transition-all relative z-10 border-t border-l border-r ${vista === 'utensilios' ? 'bg-white text-red-600 border-gray-200 border-b-white -mb-px pt-3 shadow-[0_-2px_3px_rgba(0,0,0,0.02)]' : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200 py-2'}`}
        >
          UTENSILIOS
        </button>
      </div>

      {/* BARRA DE HERRAMIENTAS UNIFICADA */}
      <div className="bg-white p-5 rounded-b-2xl rounded-tr-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 shrink-0 mb-4">
        
        {/* Buscador personalizado */}
        <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
            <Input 
                type="text" 
                placeholder={`Buscar ${vista === 'ingredientes' ? 'producto' : 'utensilio'} por nombre o ID...`}
                value={busqueda}
                onChange={(val) => setBusqueda(val)}
                className="pl-12 !bg-gray-50/50"
            />
        </div>

        {/* Filtro Categoría con Select UI */}
        <div className="w-full md:w-72">
             <Select 
                options={opcionesFiltro}
                value={filtroCategoria}
                onChange={(val) => setFiltroCategoria(val)}
            />
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1 mb-6">
        <div className="overflow-x-auto h-full">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold sticky top-0 z-10">
                    <tr>
                        <th className="p-4 border-b border-gray-200">ID</th>
                        <th className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => cambiarOrden('nombre')}>
                            <div className="flex items-center gap-2">
                                {vista === 'ingredientes' ? 'Producto' : 'Utensilio'} <IconoOrden campo="nombre" />
                            </div>
                        </th>
                        <th className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => cambiarOrden('categoria')}>
                            <div className="flex items-center gap-2">
                                Categoría <IconoOrden campo="categoria" />
                            </div>
                        </th>
                        <th className="p-4 border-b border-gray-200">Alérgenos</th>
                        <th className="p-4 border-b border-gray-200 text-center cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => cambiarOrden('stock')}>
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
                                        <span className="text-sm font-medium text-gray-900">{item.codigo}</span>
                                    ) : (
                                        <span className="text-xs text-gray-300 italic">Sin ID</span>
                                    )}
                                </td>
                                <td className="p-4 font-bold text-gray-900 text-sm">{item.nombre}</td>
                                <td className="p-4 text-sm text-gray-500 font-medium">{renderizarCategoria(item)}</td>
                                <td className="p-4">
                                    {item.alergenos && item.alergenos.length > 0 ? (
                                        <div className="flex flex-wrap items-center">
                                            {item.alergenos.map((al: any, idx: number) => {
                                                const imgName = al.icono ? al.icono : `${al.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}.png`;
                                                return (
                                                    <div 
                                                        key={al.id_alergeno} 
                                                        className={`relative group flex items-center transition-all duration-300 hover:z-10 hover:-translate-y-1 hover:scale-110 ${idx > 0 ? '-ml-2' : ''}`}
                                                    >
                                                        <div className="absolute bottom-full left-1/2 min-w-max -translate-x-1/2 -translate-y-2 px-2 py-1 bg-gray-900 border border-gray-700 text-white text-[10px] uppercase font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg z-20">
                                                            {al.nombre}
                                                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-900"></div>
                                                        </div>
                                                        <img 
                                                            src={`/alergenos/${imgName}`}
                                                            alt={al.nombre}
                                                            className="w-8 h-8 rounded-full bg-white object-cover border-2 border-white shadow-sm"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                                const spanFallback = e.currentTarget.nextElementSibling as HTMLElement;
                                                                if (spanFallback) spanFallback.style.display = 'flex';
                                                            }}
                                                        />
                                                        <span className="hidden w-8 h-8 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-[9px] uppercase font-bold border-2 border-white shadow-sm tracking-tighter">
                                                            {al.nombre.substring(0, 3)}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <span className="text-[10px] font-black text-gray-300 px-2 py-1 bg-gray-50 rounded-full border border-gray-100 uppercase tracking-widest">Sin Alérgenos</span>
                                    )}
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-black tracking-widest ${
                                        item.stock < 10 ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'
                                    }`}>
                                        {item.stock} {vista === 'ingredientes' ? 'Uds.' : ''}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="p-12 text-center text-gray-400">
                                <Search size={32} className="mx-auto mb-3 opacity-20" />
                                <p className="text-sm font-bold uppercase tracking-widest">No se encontraron {vista === 'ingredientes' ? 'productos' : 'utensilios'}</p>
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