import { useEffect, useState } from "react";
import { buscarProductoOpenFoodFacts } from "../services/productSearch.service";
import { createIngredienteEntry } from "../services/ingresoGeneral.service";
import { getCategorias, getProveedores, type Categoria, type Proveedor } from "../services/recursos.service";

export type Movimiento = {
  id: number;
  nombre: string;
  stock: number;
  hora: string;
};

export const useIngresarProductoForm = () => {
  const [codigoBarras, setCodigoBarras] = useState("");
  const [nombre, setNombre] = useState("");
  const [stock, setStock] = useState<number | "">("");
  const [categoria, setCategoria] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [listaCategorias, setListaCategorias] = useState<Categoria[]>([]);
  const [listaProveedores, setListaProveedores] = useState<Proveedor[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: "exito" | "error" } | null>(null);
  const [historial, setHistorial] = useState<Movimiento[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      const [cats, provs] = await Promise.all([getCategorias(), getProveedores()]);
      setListaCategorias(cats);
      setListaProveedores(provs);
    };
    cargarDatos();
  }, []);

  const buscarProductoOFF = async () => {
    if (!codigoBarras) return;

    setBuscando(true);
    setMensaje(null);

    try {
      const resultado = await buscarProductoOpenFoodFacts(codigoBarras);
      if (resultado.found && resultado.nombre) {
        setNombre(resultado.nombre);
        setMensaje({ texto: "Producto encontrado en la base de datos mundial.", tipo: "exito" });
      } else {
        setMensaje({ texto: "No encontrado en Open Food Facts. Introducelo manual.", tipo: "error" });
        setNombre("");
      }
    } catch (error) {
      console.error(error);
      setMensaje({ texto: "Error al conectar con Open Food Facts", tipo: "error" });
    } finally {
      setBuscando(false);
    }
  };

  const resetForm = () => {
    setNombre("");
    setStock("");
    setCodigoBarras("");
    setCategoria("");
    setProveedor("");
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();

    if (!nombre || stock === "" || !categoria || !proveedor) {
      setMensaje({ texto: "Por favor, rellena todos los campos (incluyendo categoria y proveedor).", tipo: "error" });
      return;
    }

    try {
      await createIngredienteEntry({
        nombre,
        stock: Number(stock),
        id_categoria: Number(categoria),
        id_proveedor: Number(proveedor),
        precio_unidad: 0,
        unidad_medida: "unidad",
      });

      setMensaje({ texto: "Producto guardado correctamente en la Base de Datos.", tipo: "exito" });

      const horaActual = new Date().toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const nuevoMovimiento: Movimiento = {
        id: Date.now(),
        nombre,
        stock: Number(stock),
        hora: horaActual,
      };
      setHistorial((prev) => [nuevoMovimiento, ...prev].slice(0, 3));

      resetForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error de conexion con el servidor.";
      setMensaje({ texto: message, tipo: "error" });
    }
  };

  return {
    codigoBarras,
    setCodigoBarras,
    nombre,
    setNombre,
    stock,
    setStock,
    categoria,
    setCategoria,
    proveedor,
    setProveedor,
    listaCategorias,
    listaProveedores,
    buscando,
    mensaje,
    historial,
    buscarProductoOFF,
    handleSubmit,
  };
};
