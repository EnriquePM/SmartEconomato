import { useState } from "react";
import { Button } from "../components/ui/Button";
// 1. IMPORTAMOS LOS NUEVOS ICONOS
import { Globe, Search, Loader2 } from "lucide-react";

// Definimos un tipo simple para el historial local
type Movimiento = {
  id: number;
  nombre: string;
  stock: number;
  hora: string;
};

const IngresarProducto = () => {
  // ESTADOS
  const [codigoBarras, setCodigoBarras] = useState("");
  const [nombre, setNombre] = useState("");
  const [stock, setStock] = useState<number | "">(""); 
  const [categoria, setCategoria] = useState("1");
  const [proveedor, setProveedor] = useState("101");
  const [buscando, setBuscando] = useState(false);
  
  const [mensaje, setMensaje] = useState<{texto: string, tipo: 'exito' | 'error'} | null>(null);
  const [historial, setHistorial] = useState<Movimiento[]>([]);

  // FUNCIÓN: BUSCAR EN OPEN FOOD FACTS
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
            setMensaje({ texto: "¡Producto encontrado en la base de datos mundial!", tipo: 'exito' });
        } else {
            setMensaje({ texto: "No encontrado en Open Food Facts. Introdúcelo manual.", tipo: 'error' });
            setNombre("");
        }
    } catch (error) {
        console.error(error);
        setMensaje({ texto: "Error al conectar con Open Food Facts", tipo: 'error' });
    } finally {
        setBuscando(false);
    }
  };

  // FUNCIÓN: GUARDAR LOCAL
  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();

    if (!nombre || stock === "") {
        setMensaje({ texto: "Por favor, rellena todos los campos.", tipo: 'error' });
        return;
    }

    const nuevoProducto = {
      codigo: codigoBarras,
      nombre: nombre,
      stock: Number(stock),
      id_categoria: Number(categoria),
      id_proveedor: Number(proveedor)
    };

    try {
      const respuesta = await fetch("http://localhost:3000/ingredientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoProducto),
      });

      if (respuesta.ok) {
        setMensaje({ texto: "Producto guardado correctamente en TU inventario.", tipo: 'exito' });
        
        const horaActual = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        const nuevoMovimiento: Movimiento = {
            id: Date.now(),
            nombre: nombre,
            stock: Number(stock),
            hora: horaActual
        };
        setHistorial(prev => [nuevoMovimiento, ...prev].slice(0, 3));

        setNombre("");
        setStock("");
        setCodigoBarras("");
      } else {
        throw new Error("Error al guardar");
      }
    } catch (error) {
      console.error(error);
      setMensaje({ texto: "Error de conexión con el servidor local.", tipo: 'error' });
    }
  };

  return (
    <main className="w-full space-y-8"> 
      
      <header className="text-left">
        <h1 className="text-3xl font-bold text-gray-900">Ingresar Nuevo Producto</h1>
        <p className="text-gray-500 mt-2">Escanea el código o escribe los datos manualmente.</p>
      </header>

      <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          
          {/* ZONA: CÓDIGO DE BARRAS */}
          <div className="flex gap-4 items-end">
            <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Código de Barras (EAN)</label>
                <input 
                type="text" 
                placeholder="Ej: 5449000000996 (Coca-Cola)"
                value={codigoBarras}
                onChange={(e) => setCodigoBarras(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono"
                />
            </div>
            <div className="pb-1">
                {/* 2. BOTÓN ACTUALIZADO CON ICONOS LUCIDE */}
                <button
                    type="button"
                    onClick={buscarProductoOFF}
                    disabled={buscando}
                    // Añadido 'flex items-center gap-2' para alinear icono y texto
                    className="bg-gray-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {buscando ? (
                        <>
                            <Loader2 size={20} className="animate-spin" /> {/* Icono de carga animado */}
                            <span>Buscando...</span>
                        </>
                    ) : (
                        <>
                            <Globe size={20} /> {/* Icono del mundo */}
                            <span>Buscar en OFF</span>
                        </>
                    )}
                </button>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* DATOS DEL PRODUCTO */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nombre del Producto</label>
            <input 
              type="text" 
              placeholder="Se rellenará solo o escríbelo tú..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none transition-all bg-gray-50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Stock Inicial</label>
                <input 
                  type="number" 
                  placeholder="0"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                />
             </div>

             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Categoría</label>
                <select 
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white cursor-pointer focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                >
                    <option value="1">Aceites y Grasas</option>
                    <option value="2">Granos y Harinas</option>
                    <option value="3">Conservas</option>
                    <option value="4">Lácteos y Huevos</option>
                    <option value="5">Condimentos</option>
                </select>
             </div>

             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Proveedor</label>
                <select 
                  value={proveedor}
                  onChange={(e) => setProveedor(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white cursor-pointer focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                >
                    <option value="101">Mercadona Tech</option>
                    <option value="102">Carrefour</option>
                    <option value="103">Makro Mayorista</option>
                    <option value="104">Lidl</option>
                </select>
             </div>
          </div>

          {mensaje && (
            <div className={`p-4 rounded-lg text-center font-medium ${mensaje.tipo === 'exito' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {mensaje.texto}
            </div>
          )}

          <div className="pt-4">
             <div className="w-full"> 
               <Button 
                 text="Guardar en Inventario Local" 
                 onClick={handleSubmit} 
               />
            </div>
          </div>

        </form>
      </section>

      {/* Historial */}
      {historial.length > 0 && (
        <section className="animate-fade-in-up w-full">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                Historial de sesión
            </h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <ul>
                    {historial.map((item, index) => (
                        <li key={item.id} className={`p-4 flex justify-between items-center ${index !== historial.length - 1 ? 'border-b border-gray-100' : ''}`}>
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs">
                                  OK
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900">{item.nombre}</p>
                                  <p className="text-xs text-gray-500">{item.hora}</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 text-gray-600 text-xs font-bold px-3 py-1 rounded-md">
                                Stock: {item.stock}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
      )}

    </main>
  );
};

export default IngresarProducto;