import { useEffect, useMemo, useState } from 'react';
import type { FormEvent, MouseEvent } from 'react';
import type { Categoria, Proveedor } from '../models/resources.model';
import type { SelectOption } from '../models/inventory.model';
import { getCategorias, getProveedores } from '../services/recursos.service';
import { createIngredienteEntry, createMaterialEntry } from '../services/ingresoGeneral.service';
import { buscarProductoOpenFoodFacts } from '../services/productSearch.service';

export type IngresoTab = 'ingredientes' | 'utensilios';

interface IngresoForm {
  codigo: string;
  nombre: string;
  stock: number | '';
  unidad_medida: string;
  precio_unidad: number | '';
  id_categoria: string;
  id_proveedor: string;
}

const formInicial: IngresoForm = {
  codigo: '',
  nombre: '',
  stock: '',
  unidad_medida: '',
  precio_unidad: '',
  id_categoria: '',
  id_proveedor: ''
};

export const useIngresoGeneralForm = () => {
  const [activeTab, setActiveTab] = useState<IngresoTab>('ingredientes');
  const [listaCategorias, setListaCategorias] = useState<Categoria[]>([]);
  const [listaProveedores, setListaProveedores] = useState<Proveedor[]>([]);
  const [cargandoListas, setCargandoListas] = useState(true);
  const [form, setForm] = useState<IngresoForm>(formInicial);
  const [buscandoOFF, setBuscandoOFF] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'exito' | 'error' } | null>(null);
  const [mostrarScanner, setMostrarScanner] = useState(false);
  const [alerta, setAlerta] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'confirm';
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    type: 'confirm',
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const cerrarAlerta = () => setAlerta((prev) => ({ ...prev, isOpen: false }));

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [cats, provs] = await Promise.all([getCategorias(), getProveedores()]);
        setListaCategorias(cats);
        setListaProveedores(provs);
      } catch (error) {
        console.error('Error al cargar recursos', error);
      } finally {
        setCargandoListas(false);
      }
    };
    void cargarDatos();
  }, []);

  const opcionesCategorias = useMemo<SelectOption[]>(() => [
    { value: '', label: 'Selecciona categoría...' },
    ...listaCategorias.map((c) => ({ value: c.id_categoria.toString(), label: c.nombre }))
  ], [listaCategorias]);

  const opcionesProveedores = useMemo<SelectOption[]>(() => [
    { value: '', label: 'Selecciona proveedor...' },
    ...listaProveedores.map((p) => ({ value: p.id_proveedor.toString(), label: p.nombre }))
  ], [listaProveedores]);

  const opcionesUnidad: SelectOption[] = [
     { value: '', label: 'Selecciona unidad...' },{ value: 'kg', label: 'Kilos (kg)' }, { value: 'g', label: 'Gramos (g)' },
    { value: 'l', label: 'Litros (L)' }, { value: 'ml', label: 'Mililitros (ml)' },
    { value: 'ud', label: 'Unidades (ud)' }
  ];

  const setCampo = <K extends keyof IngresoForm>(key: K, value: IngresoForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const limpiarFormulario = () => {
    setForm(formInicial);
    setMensaje(null);
  };

  const ejecutarEnvioReal = async () => {
    cerrarAlerta();
    setGuardando(true);
    try {
      if (activeTab === 'ingredientes') {
        await createIngredienteEntry({
          nombre: form.nombre,
          stock: Number(form.stock),
          id_categoria: Number(form.id_categoria),
          id_proveedor: Number(form.id_proveedor),
          precio_unidad: Number(form.precio_unidad),
          unidad_medida: form.unidad_medida
        });
      } else {
        await createMaterialEntry({
          nombre: form.nombre,
          stock: Number(form.stock),
          id_categoria: Number(form.id_categoria),
          precio_unidad: Number(form.precio_unidad),
          unidad_medida: 'ud'
        });
      }

      setAlerta({
        isOpen: true,
        type: 'success',
        title: '¡Éxito!',
        message: `${activeTab === 'ingredientes' ? 'Producto' : 'Utensilio'} registrado correctamente.`,
        onConfirm: cerrarAlerta
      });
      setForm(formInicial);
    } catch (error) {
      setAlerta({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Error al conectar con el servidor.',
        onConfirm: cerrarAlerta
      });
    } finally {
      setGuardando(false);
    }
  };


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const faltaUnidad = activeTab === 'ingredientes' && !form.unidad_medida;
    const faltaCategoria = !form.id_categoria;
    const faltaProveedor = activeTab === 'ingredientes' && !form.id_proveedor;

    if (!form.nombre || form.stock === '' || faltaUnidad || faltaCategoria || form.precio_unidad === '' || faltaProveedor) {
      setAlerta({
        isOpen: true,
        type: 'error',
        title: 'Campos incompletos',
        message: 'Por favor, cumplimente todos los campos obligatorios.',
        onConfirm: cerrarAlerta
      });
      return;
    }

    setAlerta({
      isOpen: true,
      type: 'confirm',
      title: 'Confirmar Registro',
      message: `¿Estás seguro de que quieres registrar este ${activeTab === 'ingredientes' ? 'ingrediente' : 'material'}?`,
      onConfirm: ejecutarEnvioReal
    });
  };

  const buscarProductoOFF = async (codigoDesdeScanner?: string | MouseEvent) => {
    const codigoABuscar = typeof codigoDesdeScanner === 'string' ? codigoDesdeScanner : form.codigo;
    if (!codigoABuscar) return;
    setBuscandoOFF(true);
    try {
      const result = await buscarProductoOpenFoodFacts(codigoABuscar);
      if (result.found) {
        setForm((prev) => ({ ...prev, codigo: codigoABuscar, nombre: result.nombre || '' }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setBuscandoOFF(false);
    }
  };

  const cambiarTab = (tab: IngresoTab) => {
    setActiveTab(tab);
    setMensaje(null);
  };

  return {
    activeTab, setActiveTab: cambiarTab,
    form, setCampo, cargandoListas, buscandoOFF, guardando, mensaje,
    mostrarScanner, setMostrarScanner, opcionesCategorias, opcionesProveedores,
    opcionesUnidad, buscarProductoOFF, handleSubmit, limpiarFormulario,
    alerta: { ...alerta, cerrar: cerrarAlerta }
  };
};