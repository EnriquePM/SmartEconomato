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
      setOrden(null);
    };

    void cargar();
  }, [vista]);

  const productosFiltrados = useMemo(() => {
    return productos.filter((producto) => {
      const texto = busqueda.toLowerCase();
      const nombreMatch = producto.nombre ? producto.nombre.toLowerCase().includes(texto) : false;
      const codigoMatch = producto.codigo ? producto.codigo.toLowerCase().includes(texto) : false;
      const coincideTexto = nombreMatch || codigoMatch;

      const coincideCategoria =
        filtroCategoria === 'todos' ||
        String(producto.id_categoria) === filtroCategoria;

      return coincideTexto && coincideCategoria;
    });
  }, [productos, busqueda, filtroCategoria]);

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

  return {
    productos,
    productosFinales,
    busqueda,
    setBusqueda,
    filtroCategoria,
    setFiltroCategoria,
    vista,
    setVista,
    orden,
    cambiarOrden,
    renderizarCategoria,
    opcionesFiltro
  };
};
