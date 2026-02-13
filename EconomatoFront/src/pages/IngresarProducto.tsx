
/*
import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input"; // Asegúrate de que esta importación existe
import { Globe, Search, Loader2 } from "lucide-react";

// 1. IMPORTAMOS EL SERVICIO
import { getCategorias, getProveedores, type Categoria, type Proveedor } from "../services/recursos.service";

type Movimiento = {
  id: number;
  nombre: string;
  stock: number;
  hora: string;
};

const IngresarProducto = () => {
  // 1. ESTADOS DEL FORMULARIO
  const [codigoBarras, setCodigoBarras] = useState("");
  const [nombre, setNombre] = useState("");
  const [stock, setStock] = useState<number | "">(""); 

  // 2. ESTADOS DE SELECCIÓN
  const [categoria, setCategoria] = useState(""); 
  const [proveedor, setProveedor] = useState("");

  // 3. ESTADOS PARA LAS LISTAS QUE VIENEN DEL BACKEND
  const [listaCategorias, setListaCategorias] = useState<Categoria[]>([]);
  const [listaProveedores, setListaProveedores] = useState<Proveedor[]>([]);

  const [buscando, setBuscando] = useState(false);
  const [mensaje, setMensaje] = useState<{texto: string, tipo: 'exito' | 'error'} | null>(null);
  const [historial, setHistorial] = useState<Movimiento[]>([]);

  // 4. USE EFFECT: CARGAR DATOS
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [cats, provs] = await Promise.all([
          getCategorias(),
          getProveedores()
        ]);
        setListaCategorias(cats);
        setListaProveedores(provs);
      } catch (error) {
        console.error("Error al cargar categorías/proveedores", error);
      }
    };
    cargarDatos();
  }, []);

  // --- BUSCAR EN OPEN FOOD FACTS ---
  const buscarProductoOFF = async () => {
    if (!codigoBarras) return;
    setBuscando(true);
    setMensaje(null);

    try {
        const respuesta = await fetch(`https://world.openfoodfacts.org/api/v0/product/${codigoBarras}.json`);
        const data = await respuesta.json();

        if (data.status === 1) {
            const productoOFF = data.product;
            const nombreEncontrado = productoOFF.product_name_es || productoOFF.product_name;
            setNombre(nombreEncontrado);
            setMensaje({ texto: "¡Producto encontrado en Open Food Facts!", tipo: 'exito' });
        } else {
            setMensaje({ texto: "No encontrado. Introdúcelo manualmente.", tipo: 'error' });
            setNombre("");
        }
    } catch (error) {
        console.error(error);
        setMensaje({ texto: "Error al conectar con la API mundial.", tipo: 'error' });
    } finally {
        setBuscando(false);
    }
  };

  // 5. LÓGICA DE ENVÍO CORREGIDA
  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();

    if (!nombre || stock === "" || !categoria || !proveedor) {
        setMensaje({ texto: "Por favor, rellena todos los campos.", tipo: 'error' });
        return;
    }

    const nuevoProducto = {
      nombre: nombre,
      stock: Number(stock),
      id_categoria: Number(categoria),
      id_proveedor: Number(proveedor),
      // Si tu backend acepta imagen o stock_minimo, añádelos aquí
    };

    try {
      const respuesta = await fetch("http://localhost:3000/api/ingredientes", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoProducto),
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        setMensaje({ texto: "Producto guardado correctamente.", tipo: 'exito' });
        
        const horaActual = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        const nuevoMovimiento: Movimiento = {
            id: Date.now(),
            nombre: nombre,
            stock: Number(stock),
            hora: horaActual
        };
        setHistorial(prev => [nuevoMovimiento, ...prev].slice(0, 3));

        // Limpiar
        setNombre("");
        setStock("");
        setCodigoBarras("");
        setCategoria(""); 
        setProveedor("");
      } else {
        throw new Error(data.error || "Error al guardar");
      }
    } catch (error: any) {
      setMensaje({ texto: error.message || "Error de conexión con el servidor.", tipo: 'error' });
    }
  };

  return (
    <main className="w-full space-y-8 animate-fade-in p-4"> 
      <header className="text-left">
        <h1 className="text-3xl font-bold text-gray-900">Ingresar Nuevo Producto</h1>
        <p className="text-gray-500 mt-2">Escanea el código o escribe los datos manualmente.</p>
      </header>

      <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
                <Input 
                  id="codigo-barras" 
                  type="text" 
                  label="Código de Barras (EAN)"
                  placeholder="Ej: 5449000000996"
                  value={codigoBarras}
                  onChange={(e) => setCodigoBarras(e.target.value)} 
                />
            </div>
            <button
                type="button" 
                onClick={buscarProductoOFF}
                disabled={buscando}
                className="bg-gray-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2 mb-[2px]"
            >
                {buscando ? <Loader2 size={20} className="animate-spin" /> : <Globe size={20} />}
                <span>{buscando ? "Buscando..." : "Buscar en OFF"}</span>
            </button>
          </div>

          <Input 
            id="nombre-producto"
            label="Nombre del Producto"
            type="text" 
            value={nombre}
            onChange={(e) => setNombre(e.target.value)} 
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <Input 
               id="stock-inicial"
               label="Stock Inicial"
               type="number" 
               value={stock}
               onChange={(e) => setStock(e.target.value === "" ? "" : Number(e.target.value))} 
             />

             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Categoría</label>
                <select 
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                >
                    <option value="">-- Selecciona --</option>
                    {listaCategorias.map((cat) => (
                        <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>
                    ))}
                </select>
             </div>

             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Proveedor</label>
                <select 
                  value={proveedor}
                  onChange={(e) => setProveedor(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                >
                    <option value="">-- Selecciona --</option>
                    {listaProveedores.map((prov) => (
                        <option key={prov.id_proveedor} value={prov.id_proveedor}>{prov.nombre}</option>
                    ))}
                </select>
             </div>
          </div>

          {mensaje && (
            <div className={`p-4 rounded-lg text-center font-bold ${mensaje.tipo === 'exito' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {mensaje.texto}
            </div>
          )}

          <Button text="Guardar en Base de Datos" onClick={handleSubmit} />
        </form>
      </section>

      {historial.length > 0 && (
        <section className="w-full">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">Historial de sesión</h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {historial.map((item) => (
                    <div key={item.id} className="p-4 flex justify-between items-center border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs">OK</div>
                            <div>
                              <p className="font-bold text-gray-900">{item.nombre}</p>
                              <p className="text-xs text-gray-500">{item.hora}</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 text-gray-600 text-xs font-bold px-3 py-1 rounded-md">
                            + {item.stock} u.
                        </div>
                    </div>
                ))}
            </div>
        </section>
      )}
    </main>
  );
};

export default IngresarProducto;

*/