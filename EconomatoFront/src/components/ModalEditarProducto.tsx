import { useState, useEffect } from 'react';
import { X, Package, Save } from 'lucide-react';
import type { InventarioItem, InventarioVista } from '../models/inventory.model';
import type { Alergeno, Categoria, Proveedor } from '../models/resources.model';
import { getCategorias, getProveedores, getAlergenos } from '../services/recursos.service';
import { updateIngredienteEntry, updateMaterialEntry } from '../services/ingresoGeneral.service';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';

interface Props {
  item: InventarioItem;
  vista: InventarioVista;
  onClose: () => void;
  onGuardado: (updated: InventarioItem) => void;
}

export const ModalEditarProducto = ({ item, vista, onClose, onGuardado }: Props) => {
  const [nombre, setNombre] = useState(item.nombre);
  const [stock, setStock] = useState(String(item.stock));
  const [stockMinimo, setStockMinimo] = useState(String(item.stock_minimo ?? 0));
  const [precio, setPrecio] = useState(String(item.precio ?? 0));
  const [unidadMedida, setUnidadMedida] = useState(item.unidad_medida ?? '');
  const [idCategoria, setIdCategoria] = useState(String(item.id_categoria ?? ''));
  const [idProveedor, setIdProveedor] = useState(String(item.id_proveedor ?? ''));
  const [alergenosSeleccionados, setAlergenosSeleccionados] = useState<number[]>(
    item.alergenos?.map((a) => a.id_alergeno) ?? []
  );

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [alergenos, setAlergenos] = useState<Alergeno[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargar = async () => {
      const [cats, provs, alrs] = await Promise.all([
        getCategorias(),
        getProveedores(),
        vista === 'ingredientes' ? getAlergenos() : Promise.resolve([])
      ]);
      setCategorias(cats);
      setProveedores(provs);
      setAlergenos(alrs);
    };
    void cargar();
  }, [vista]);

  const toggleAlergeno = (id: number) => {
    setAlergenosSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    setGuardando(true);
    setError(null);
    try {
      if (vista === 'ingredientes') {
        await updateIngredienteEntry(item.id, {
          nombre: nombre.trim(),
          stock: Number(stock),
          stock_minimo: Number(stockMinimo),
          precio_unidad: Number(precio),
          unidad_medida: unidadMedida,
          id_categoria: idCategoria ? Number(idCategoria) : undefined,
          id_proveedor: idProveedor ? Number(idProveedor) : undefined,
          alergenosIds: alergenosSeleccionados
        });
      } else {
        await updateMaterialEntry(item.id, {
          nombre: nombre.trim(),
          stock: Number(stock),
          stock_minimo: Number(stockMinimo),
          precio_unidad: Number(precio),
          unidad_medida: unidadMedida,
          id_categoria: idCategoria ? Number(idCategoria) : undefined
        });
      }
      onGuardado({
        ...item,
        nombre: nombre.trim(),
        stock: Number(stock),
        stock_minimo: Number(stockMinimo),
        precio: Number(precio),
        unidad_medida: unidadMedida,
        id_categoria: idCategoria ? Number(idCategoria) : null,
        categoria_nombre: categorias.find((c) => String(c.id_categoria) === idCategoria)?.nombre ?? item.categoria_nombre,
        id_proveedor: idProveedor ? Number(idProveedor) : undefined,
        alergenos: alergenos
          .filter((a) => alergenosSeleccionados.includes(a.id_alergeno))
          .map((a) => ({ id_alergeno: a.id_alergeno, nombre: a.nombre, icono: a.icono }))
      });
    } catch (e: any) {
      setError(e?.message ?? 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  const opcionesCategorias = [
    { value: '', label: 'Sin categoría' },
    ...categorias.map((c) => ({ value: String(c.id_categoria), label: c.nombre }))
  ];

  const opcionesProveedores = [
    { value: '', label: 'Sin proveedor' },
    ...proveedores.map((p) => ({ value: String(p.id_proveedor), label: p.nombre }))
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-fade-in-up border border-gray-100">

        <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-4">
            <div className="bg-acento p-3 rounded-xl text-white shadow-lg">
              <Package size={24} color="#ffffff" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight">
                Editar {vista === 'ingredientes' ? 'Producto' : 'Utensilio'}
              </h2>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{item.codigo ?? `ID: ${item.id}`}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-5 scrollbar-global">
          <Input type="text" label="Nombre" placeholder="Nombre del producto" value={nombre} onChange={setNombre} />

          <div className="grid grid-cols-2 gap-4">
            <Input type="number" label="Stock actual" placeholder="0" value={stock} onChange={setStock} min={0} />
            <Input type="number" label="Stock mínimo" placeholder="0" value={stockMinimo} onChange={setStockMinimo} min={0} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input type="number" label="Precio por unidad (€)" placeholder="0.00" value={precio} onChange={setPrecio} min={0} />
            <Input type="text" label="Unidad de medida" placeholder="kg, ud, L..." value={unidadMedida} onChange={setUnidadMedida} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1 ml-1">Categoría</label>
            <Select options={opcionesCategorias} value={idCategoria} onChange={setIdCategoria} />
          </div>

          {vista === 'ingredientes' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1 ml-1">Proveedor</label>
                <Select options={opcionesProveedores} value={idProveedor} onChange={setIdProveedor} />
              </div>

              {alergenos.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3 ml-1">
                    <label className="block text-sm font-medium text-gray-500">Alérgenos</label>
                    {alergenosSeleccionados.length > 0 && (
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                        {alergenosSeleccionados.length} seleccionado{alergenosSeleccionados.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {alergenosSeleccionados.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl">
                      {alergenos
                        .filter((al) => alergenosSeleccionados.includes(al.id_alergeno))
                        .map((al) => {
                          const imgName = al.icono ?? `${al.nombre.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')}.png`;
                          return (
                            <div key={al.id_alergeno} className="flex flex-col items-center gap-1">
                              <img
                                src={`/alergenos/${imgName}`}
                                alt={al.nombre}
                                className="w-10 h-10 object-contain drop-shadow-sm"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                              />
                              <span className="text-[10px] font-bold text-amber-700 leading-tight text-center max-w-[52px]">{al.nombre}</span>
                            </div>
                          );
                        })}
                    </div>
                  )}

                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                    {alergenos.map((al) => {
                      const seleccionado = alergenosSeleccionados.includes(al.id_alergeno);
                      const imgName = al.icono ?? `${al.nombre.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')}.png`;
                      return (
                        <button
                          key={al.id_alergeno}
                          type="button"
                          onClick={() => toggleAlergeno(al.id_alergeno)}
                          className={`relative flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border-2 transition-all duration-150 group ${
                            seleccionado
                              ? 'bg-amber-50 border-amber-400 shadow-md shadow-amber-100'
                              : 'bg-gray-50 border-gray-200 hover:border-amber-200 hover:bg-amber-50/40'
                          }`}
                        >
                          {seleccionado && (
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                              <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 fill-white" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.5 5L3.8 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                              </svg>
                            </span>
                          )}
                          <img
                            src={`/alergenos/${imgName}`}
                            alt={al.nombre}
                            className={`w-9 h-9 object-contain transition-transform duration-150 ${seleccionado ? 'scale-110 drop-shadow-md' : 'opacity-60 group-hover:opacity-90 group-hover:scale-105'}`}
                            onError={(e) => {
                              const img = e.currentTarget as HTMLImageElement;
                              img.style.display = 'none';
                              const fallback = img.nextElementSibling as HTMLElement | null;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <span
                            className="hidden w-9 h-9 rounded-full bg-gray-200 items-center justify-center text-[10px] font-black text-gray-500"
                            style={{ display: 'none' }}
                          >
                            {al.nombre.slice(0, 3).toUpperCase()}
                          </span>
                          <span className={`text-[10px] font-bold leading-tight text-center ${seleccionado ? 'text-amber-700' : 'text-gray-400'}`}>
                            {al.nombre}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {error && (
            <p className="text-sm font-bold text-red-500 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
              {error}
            </p>
          )}
        </div>

        <div className="px-8 py-6 border-t border-gray-100 flex justify-end gap-3 shrink-0">
          <Button variant="gris" onClick={onClose}>Cancelar</Button>
          <Button variant="primario" onClick={handleGuardar} loading={guardando} className="flex items-center gap-2">
            <Save size={16} /> Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  );
};
