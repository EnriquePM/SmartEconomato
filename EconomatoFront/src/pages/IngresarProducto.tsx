import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Globe, Search, Loader2 } from "lucide-react";
import Select from "../components/ui/select";
import Input from "../components/ui/Input";
import { useProveedores } from "../hooks/useProveedor";
import { useCategories } from "../hooks/useCategoria";
import type { Producto } from "../models/Producto";
import { crearIngrediente } from "../services/inventarioService";


// Definimos un tipo simple para el historial local
type Movimiento = {
  id: number;
  nombre: string;
  stock: number;
  hora: string;
};

const IngresarProducto = () => {
  const categorias = useCategories(); 
  const { options: proveedores } = useProveedores(); 
  // ESTADOS
  const [codigoBarras, setCodigoBarras] = useState("");
  const [nombre, setNombre] = useState("");
  const [stock, setStock] = useState<number | "">(""); 
  const [buscando, setBuscando] = useState(false);
  const [categoria, setCategoria] = useState("");
  const [proveedor, setProveedor] = useState("");
  
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

    const nuevoProducto: Producto = {
    id: codigoBarras,
    nombre: nombre,
    stock: Number(stock),
    stockMinimo: Number(stock),
    categoria: categoria,
    proveedor: proveedor,
    imagen: "default.png",
    tipo: "producto" //no estoy segura de esto!!!!!
 
  };

    try {
    // 3. LLAMADA AL SERVICIO
    await crearIngrediente(nuevoProducto);

    // 4. LÓGICA DE ÉXITO (UI)
    setMensaje({ texto: "Producto guardado correctamente.", tipo: 'exito' });
    
    const horaActual = new Date().toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const nuevoMovimiento: Movimiento = {
        id: Date.now(),
        nombre: nombre,
        stock: Number(stock),
        hora: horaActual
    };

    setHistorial(prev => [nuevoMovimiento, ...prev].slice(0, 3));

    // Limpiar campos
    setNombre("");
    setStock("");
    setCodigoBarras("");
    setCategoria("");
    setProveedor("");

  } catch (error) {
    // 5. MANEJO DE ERRORES
    console.error(error);
    setMensaje({ texto: "Error de conexión con el servidor local.", tipo: 'error' });
  }
};

  return (
    <main className="w-full space-y-8 animate-fade-in"> 
      
      <header className="text-left">
        <h1 className="text-3xl font-bold text-gray-900">Ingresar Nuevo Producto</h1>
        <p className="text-gray-500 mt-2">Escanea el código o escribe los datos manualmente.</p>
      </header>

      <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          
          {/* ZONA: CÓDIGO DE BARRAS */}
          <div className="flex gap-4 items-end">
            <div className="flex-1">
                <Input 
                  id="codigo-barras" 
                  type="text" 
                  label="Código de Barras (EAN)"
                  placeholder="Ej: 5449000000996"
                  value={codigoBarras}
                  onChange={setCodigoBarras} 
                />
            </div>
            <div className="pb-1">
                <button
                    type="button"
                    onClick={buscarProductoOFF}
                    disabled={buscando}
                    className="bg-gray-800 text-white font-bold py-3 px-6 rounded-pill hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center gap-2 mb-[2px]"
                >
                    {buscando ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            <span>Buscando...</span>
                        </>
                    ) : (
                        <>
                            <Globe size={20} />
                            <span>Buscar en OFF</span>
                        </>
                    )}
                </button>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* DATOS DEL PRODUCTO */}
          <Input 
            id="nombre-producto"
            label="Nombre del Producto"
            type="text" 
            placeholder="Se rellenará solo o escríbelo tú..."
            value={nombre}
            onChange={setNombre} 
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <Input 
               id="stock-inicial"
               label="Stock Inicial"
               type="number" 
               placeholder="0"
               value={stock}
               onChange={(val) => setStock(val === "" ? "" : Number(val))} 
             />

             {/* SELECT CATEGORÍA */}
             <Select 
                id="id_categoria"
                label="Categoría"
                value={categoria}
                options={categorias} // Viene del hook useCategories
                onChange={setCategoria}
                placeholder="Seleccione categoría"
             />

             {/* SELECT PROVEEDOR*/}
             <Select 
                id="id_proveedor"
                label="Proveedor"
                value={proveedor}
                options={proveedores} // Viene del hook useProveedores
                onChange={setProveedor}
                placeholder="Seleccione proveedor"
             />
          </div>

          {mensaje && (
            <div className={`p-4 rounded-lg text-center font-bold border ${
                mensaje.tipo === 'exito' 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : 'bg-red-50 text-red-700 border-red-200'
            }`}>
                {mensaje.texto}
            </div>
          )}

          <div className="pt-4">
             <Button 
                text="Guardar en Inventario Local" 
                onClick={handleSubmit} 
                className="w-full"
             />
          </div>

        </form>
      </section>

      {/* Historial de sesión */}
      {historial.length > 0 && (
        <section className="animate-fade-in-up w-full">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">
                Historial de sesión
            </h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                {historial.map((item) => (
                    <div key={item.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 font-bold text-xs border border-green-100">
                              OK
                            </div>
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