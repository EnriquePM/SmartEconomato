import { useState, useEffect } from 'react';
import { X, Package, Save } from 'lucide-react';
import type { InventarioItem, InventarioVista } from '../models/inventory.model';
import type { Alergeno, Categoria, Proveedor } from '../models/resources.model';
import { getCategorias, getProveedores, getAlergenos } from '../services/recursos.service';
import { updateIngredienteEntry, updateMaterialEntry } from '../services/ingresoGeneral.service';
import { Input } from './ui/Input';
import { Select } from './ui/select';
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
                  <label className="block text-sm font-medium text-gray-500 mb-3 ml-1">Alérgenos</label>
                  <div className="flex flex-wrap gap-2">
                    {alergenos.map((al) => {
                      const seleccionado = alergenosSeleccionados.includes(al.id_alergeno);
                      const imgName = al.icono ?? `${al.nombre.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')}.png`;
                      return (
                        <button
                          key={al.id_alergeno}
                          type="button"
                          onClick={() => toggleAlergeno(al.id_alergeno)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-full border-2 transition-all text-xs font-bold ${
                            seleccionado
                              ? 'bg-amber-50 border-amber-400 text-amber-700'
                              : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={`/alergenos/${imgName}`}
                            alt={al.nombre}
                            className="w-5 h-5 object-contain"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                          />
                          {al.nombre}
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
