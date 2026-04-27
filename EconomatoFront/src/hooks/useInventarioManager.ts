import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { InventarioItem, InventarioVista, SelectOption } from '../models/inventory.model';
import { getInventarioIngredientes, getInventarioMateriales } from '../services/inventarioService';

type OrdenState = { campo: string; asc: boolean } | null;

export const useInventarioManager = () => {
  const [searchParams] = useSearchParams();
  const [productos, setProductos] = useState<InventarioItem[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [filtroCaducidad, setFiltroCaducidad] = useState('todos');
  const [vista, setVista] = useState<InventarioVista>(
    (searchParams.get('vista') as InventarioVista) || 'ingredientes'
  );
  const [orden, setOrden] = useState<OrdenState>(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = vista === 'ingredientes'
          ? await getInventarioIngredientes()
          : await getInventarioMateriales();

        setProductos(data);
      } catch (error) {
        console.error(`Error cargando ${vista}:`, error);
        setProductos([]);
      }

      setBusqueda('');
      setFiltroCategoria('todos');
      setFiltroCaducidad('todos');
      setOrden(null);
    };

    void cargar();
  }, [vista]);

  const productosFiltrados = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return productos.filter((producto) => {
      const texto = busqueda.toLowerCase();
      const nombreMatch = producto.nombre ? producto.nombre.toLowerCase().includes(texto) : false;
      const codigoMatch = producto.codigo ? producto.codigo.toLowerCase().includes(texto) : false;
      const coincideTexto = nombreMatch || codigoMatch;

      const coincideCategoria =
        filtroCategoria === 'todos' ||
        String(producto.id_categoria) === filtroCategoria;

      let coincideCaducidad = true;
      if (filtroCaducidad !== 'todos') {
        if (!producto.fecha_caducidad) return false;
        const fechaCad = new Date(producto.fecha_caducidad);
        fechaCad.setHours(0, 0, 0, 0);

        if (filtroCaducidad === 'caducados') {
          coincideCaducidad = fechaCad < hoy;
        } else {
          const diasMap: Record<string, number> = { '7dias': 7, '2semanas': 14, '30dias': 30 };
          const limite = new Date(hoy);
          limite.setDate(limite.getDate() + diasMap[filtroCaducidad]);
          coincideCaducidad = fechaCad >= hoy && fechaCad < limite;
        }
      }

      return coincideTexto && coincideCategoria && coincideCaducidad;
    });
  }, [productos, busqueda, filtroCategoria, filtroCaducidad]);

  const productosFinales = useMemo(() => {
    return [...productosFiltrados].sort((a, b) => {
      if (!orden) return 0;

      let valorA: string | number | null = null;
      let valorB: string | number | null = null;

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

      if (valorA === null && valorB === null) return 0;
      if (valorA === null) return orden.asc ? -1 : 1;
      if (valorB === null) return orden.asc ? 1 : -1;

      if (valorA < valorB) return orden.asc ? -1 : 1;
      if (valorA > valorB) return orden.asc ? 1 : -1;
      return 0;
    });
  }, [productosFiltrados, orden]);

  const opcionesCaducidad: SelectOption[] = [
    { value: 'todos', label: 'Todas las caducidades' },
    { value: 'caducados', label: 'Caducados' },
    { value: '7dias', label: 'Caducan en 7 días' },
    { value: '2semanas', label: 'Caducan en 2 semanas' },
    { value: '30dias', label: 'Caducan en 30 días' },
  ];

  const opcionesFiltro = useMemo<SelectOption[]>(() => {
    const categoriesById = new Map<string, string>();

    productos.forEach((p) => {
      if (p.id_categoria !== null) {
        const key = String(p.id_categoria);
        if (!categoriesById.has(key)) {
          categoriesById.set(key, p.categoria_nombre || 'Sin categoría');
        }
      }
    });

    return [
      { value: 'todos', label: 'Todas las categorías' },
      ...Array.from(categoriesById.entries()).map(([value, label]) => ({ value, label }))
    ];
  }, [productos]);

  const cambiarOrden = (campo: string) => {
    if (orden && orden.campo === campo) {
      setOrden({ campo, asc: !orden.asc });
      return;
    }

    setOrden({ campo, asc: true });
  };

  const renderizarCategoria = (producto: InventarioItem) => producto.categoria_nombre || 'Sin categoría';

  const actualizarProducto = (updated: InventarioItem) => {
    setProductos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  return {
    productos,
    productosFinales,
    busqueda,
    setBusqueda,
    filtroCategoria,
    setFiltroCategoria,
    filtroCaducidad,
    setFiltroCaducidad,
    opcionesCaducidad,
    vista,
    setVista,
    orden,
    cambiarOrden,
    renderizarCategoria,
    opcionesFiltro,
    actualizarProducto
  };
};
