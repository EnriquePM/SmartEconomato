import { Search, ArrowUpDown, ArrowUp, ArrowDown, Pencil } from 'lucide-react';
import { Buscador } from '../components/ui/Buscador';
import { Select } from '../components/ui/Select';
import { useInventarioManager } from '../hooks/useInventarioManager';
import { ModalEditarProducto } from '../components/inventario/ModalEditarProducto';

const Inventario = () => {
  const {
    productos,
    productosFinales,
    busqueda,
    setBusqueda,
    filtroCategoria,
    setFiltroCategoria,
    filtroCaducidad,
    setFiltroCaducidad,
    vista,
    setVista,
    orden,
    cambiarOrden,
    renderizarCategoria,
    opcionesFiltro,
    itemEditando,
    abrirEditar,
    cerrarEditar,
    recargarInventario,
  } = useInventarioManager();

  const opcionesCaducidad = [
    { value: 'todos', label: 'Todas las caducidades' },
    { value: 'caducados', label: 'Caducados' },
    { value: '7dias', label: 'Caducan en 7 días' },
    { value: '30dias', label: 'Caducan en 30 días' },
    { value: '90dias', label: 'Caducan en 90 días' },
  ];

  const IconoOrden = ({ campo }: { campo: string }) => {
    if (orden?.campo !== campo) return <ArrowUpDown size={14} className="text-gray-300" />;
    return orden.asc ? <ArrowUp size={14} className="text-red-600" /> : <ArrowDown size={14} className="text-red-600" />;
  };

  return (
    <div className="space-y-0 animate-fade-in flex flex-col h-full gap-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 pb-4">
        <div>
          <h1>Inventario General</h1>
          <h2>Gestión de stock y existencias en tiempo real.</h2>
        </div>

        <div className="flex gap-2">
          <span
            className={`text-xs font-bold px-4 py-2 rounded-full flex items-center border ${
              vista === 'utensilios'
                ? 'bg-red-50 text-red-700 border-red-100'
                : 'bg-blue-50 text-blue-700 border-blue-100'
            }`}
          >
            Total: {productos.length} {vista === 'ingredientes' ? 'productos' : 'utensilios'}
          </span>
        </div>
      </div>

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

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 shrink-0 mb-4">
        <Buscador 
          value={busqueda} 
            onChange={setBusqueda} 
            placeholder="Buscar por nombre del producto o ID..." 
          />

        <div className="w-full md:w-80">
          <Select options={opcionesFiltro} value={filtroCategoria} onChange={(val) => setFiltroCategoria(val)} />
        </div>

        {vista === 'ingredientes' && (
          <div className="w-full md:w-80">
            <Select options={opcionesCaducidad} value={filtroCaducidad} onChange={(val) => setFiltroCaducidad(val as any)} />
          </div>
        )}
      </div>

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
                <th className="p-4 border-b border-gray-200 text-center">Acciones</th>
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
                          {item.alergenos.map((al, idx) => {
                            const imgName = al.icono
                              ? al.icono
                              : `${al.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}.png`;
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
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black tracking-widest ${
                          item.stock < 10 ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'
                        }`}
                      >
                        {item.stock} {item.unidad_medida || 'ud'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => abrirEditar(item)}
                        className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Editar"
                      >
                        <Pencil size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400">
                    <Search size={32} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-semibold tracking-widest">No se encontraron {vista === 'ingredientes' ? 'productos' : 'utensilios'}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {itemEditando && (
        <ModalEditarProducto
          item={itemEditando}
          vista={vista}
          onClose={cerrarEditar}
          onSaved={recargarInventario}
        />
      )}
    </div>
  );
};

export default Inventario;
