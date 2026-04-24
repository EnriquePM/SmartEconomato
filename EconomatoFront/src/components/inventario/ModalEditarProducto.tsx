import { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { AlertModal } from '../ui/AlertModal';
import type { InventarioItem, InventarioVista, SelectOption } from '../../models/inventory.model';
import { getCategorias, getProveedores } from '../../services/recursos.service';
import { updateIngrediente, updateMaterial } from '../../services/inventarioService';

interface Props {
  item: InventarioItem;
  vista: InventarioVista;
  onClose: () => void;
  onSaved: () => void;
}

interface EditForm {
  nombre: string;
  stock: number | '';
  precio_unidad: number | '';
  id_categoria: string;
  id_proveedor: string;
  unidad_medida: string;
  fecha_caducidad: string;
}

const opcionesUnidad: SelectOption[] = [
  { value: 'kg', label: 'Kilos (kg)' },
  { value: 'g', label: 'Gramos (g)' },
  { value: 'l', label: 'Litros (L)' },
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'ud', label: 'Unidades (ud)' },
];

const toDateInput = (isoDate: string | null | undefined): string => {
  if (!isoDate) return '';
  return isoDate.slice(0, 10);
};

export const ModalEditarProducto = ({ item, vista, onClose, onSaved }: Props) => {
  const [form, setForm] = useState<EditForm>({
    nombre: item.nombre,
    stock: item.stock,
    precio_unidad: item.precio ?? '',
    id_categoria: item.id_categoria ? String(item.id_categoria) : '',
    id_proveedor: item.id_proveedor ? String(item.id_proveedor) : '',
    unidad_medida: item.unidad_medida || 'ud',
    fecha_caducidad: toDateInput(item.fecha_caducidad),
  });

  const [opcionesCategorias, setOpcionesCategorias] = useState<SelectOption[]>([]);
  const [opcionesProveedores, setOpcionesProveedores] = useState<SelectOption[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [alerta, setAlerta] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'confirm';
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, type: 'confirm', title: '', message: '', onConfirm: () => {} });

  const cerrarAlerta = () => setAlerta(prev => ({ ...prev, isOpen: false }));

  useEffect(() => {
    const cargar = async () => {
      const [cats, provs] = await Promise.all([getCategorias(), getProveedores()]);
      setOpcionesCategorias([
        { value: '', label: 'Selecciona categoría...' },
        ...cats.map(c => ({ value: String(c.id_categoria), label: c.nombre })),
      ]);
      setOpcionesProveedores([
        { value: '', label: 'Selecciona proveedor...' },
        ...provs.map(p => ({ value: String(p.id_proveedor), label: p.nombre })),
      ]);
      setCargando(false);
    };
    void cargar();
  }, []);

  const setCampo = <K extends keyof EditForm>(key: K, value: EditForm[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const ejecutarGuardado = async () => {
    cerrarAlerta();
    setGuardando(true);
    try {
      const id = Number(item.id);
      if (vista === 'ingredientes') {
        await updateIngrediente(id, {
          nombre: form.nombre,
          stock: Number(form.stock) || 0,
          precio_unidad: Number(form.precio_unidad) || 0,
          id_categoria: Number(form.id_categoria) || undefined,
          id_proveedor: Number(form.id_proveedor) || undefined,
          unidad_medida: form.unidad_medida,
          fecha_caducidad: form.fecha_caducidad || null,
        });
      } else {
        await updateMaterial(id, {
          nombre: form.nombre,
          stock: Number(form.stock) || 0,
          precio_unidad: Number(form.precio_unidad) || 0,
          id_categoria: Number(form.id_categoria) || undefined,
        });
      }
      setAlerta({
        isOpen: true,
        type: 'success',
        title: '¡Guardado!',
        message: `${vista === 'ingredientes' ? 'Producto' : 'Utensilio'} actualizado correctamente.`,
        onConfirm: () => { cerrarAlerta(); onSaved(); onClose(); },
      });
    } catch (error) {
      setAlerta({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Error al guardar los cambios.',
        onConfirm: cerrarAlerta,
      });
    } finally {
      setGuardando(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || form.stock === '') {
      setAlerta({
        isOpen: true,
        type: 'error',
        title: 'Campos incompletos',
        message: 'El nombre y el stock son obligatorios.',
        onConfirm: cerrarAlerta,
      });
      return;
    }
    setAlerta({
      isOpen: true,
      type: 'confirm',
      title: 'Confirmar cambios',
      message: `¿Guardar los cambios en "${form.nombre}"?`,
      onConfirm: ejecutarGuardado,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <h3 className="text-base font-black text-gray-800 uppercase tracking-widest">
            Editar {vista === 'ingredientes' ? 'Producto' : 'Utensilio'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {cargando ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 size={32} className="animate-spin text-red-500" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-5">
            <Input
              label="Nombre"
              type="text"
              placeholder="Nombre del artículo"
              value={form.nombre}
              onChange={val => setCampo('nombre', val)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Stock"
                type="number"
                placeholder="0"
                value={String(form.stock)}
                onChange={val => setCampo('stock', val === '' ? '' : Number(val))}
              />
              <Input
                label="Precio (€)"
                type="number"
                placeholder="0.00"
                value={String(form.precio_unidad)}
                onChange={val => setCampo('precio_unidad', val === '' ? '' : Number(val))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2 ml-1">Categoría</label>
              <Select
                options={opcionesCategorias}
                value={form.id_categoria}
                onChange={val => setCampo('id_categoria', val)}
              />
            </div>

            {vista === 'ingredientes' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2 ml-1">Unidad de Medida</label>
                  <Select
                    options={opcionesUnidad}
                    value={form.unidad_medida}
                    onChange={val => setCampo('unidad_medida', val)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2 ml-1">Proveedor</label>
                  <Select
                    options={opcionesProveedores}
                    value={form.id_proveedor}
                    onChange={val => setCampo('id_proveedor', val)}
                  />
                </div>
                <Input
                  label="Fecha de Caducidad (opcional)"
                  type="date"
                  placeholder=""
                  value={form.fecha_caducidad}
                  onChange={val => setCampo('fecha_caducidad', val)}
                />
              </>
            )}

            <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
              <Button type="button" variant="gris" onClick={onClose}>CANCELAR</Button>
              <Button variant="primario" type="submit" disabled={guardando}>
                {guardando ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {guardando ? 'GUARDANDO...' : 'GUARDAR'}
              </Button>
            </div>
          </form>
        )}
      </div>

      <AlertModal
        isOpen={alerta.isOpen}
        type={alerta.type}
        title={alerta.title}
        message={alerta.message}
        onConfirm={alerta.onConfirm}
        onCancel={cerrarAlerta}
        confirmText={alerta.type === 'confirm' ? 'GUARDAR' : 'ACEPTAR'}
      />
    </div>
  );
};
