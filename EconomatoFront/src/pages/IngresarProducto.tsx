import { useState } from "react";
import { Button } from "../components/ui/Button";

// Definimos un tipo simple para el historial local
type Movimiento = {
  id: number;
  nombre: string;
  stock: number;
  hora: string;
};

const IngresarProducto = () => {
  // 1. ESTADOS DEL FORMULARIO
  const [nombre, setNombre] = useState("");
  const [stock, setStock] = useState<number | "">(""); 
  const [categoria, setCategoria] = useState("1");
  const [proveedor, setProveedor] = useState("101");
  
  const [mensaje, setMensaje] = useState<{texto: string, tipo: 'exito' | 'error'} | null>(null);

  // 2. ESTADO PARA EL HISTORIAL
  const [historial, setHistorial] = useState<Movimiento[]>([]);

  // 3. LOGICA DE ENVÍO (Adaptada para evitar el error de TypeScript)
  // Aceptamos FormEvent (Enter en inputs) o MouseEvent (Clic en botón), y 'e' es opcional (?)
  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    // Si existe el evento (e), prevenimos la recarga de página
    if (e) e.preventDefault();

    if (!nombre || stock === "") {
        setMensaje({ texto: "Por favor, rellena todos los campos.", tipo: 'error' });
        return;
    }

    const nuevoProducto = {
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
        setMensaje({ texto: "Producto guardado correctamente.", tipo: 'exito' });
        
        // --- AÑADIR AL HISTORIAL ---
        const horaActual = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        const nuevoMovimiento: Movimiento = {
            id: Date.now(),
            nombre: nombre,
            stock: Number(stock),
            hora: horaActual
        };
        setHistorial(prev => [nuevoMovimiento, ...prev].slice(0, 3));

        // Limpiar formulario
        setNombre("");
        setStock("");
      } else {
        throw new Error("Error al guardar");
      }
    } catch (error) {
      console.error(error);
      setMensaje({ texto: "Error de conexión con el servidor.", tipo: 'error' });
    }
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      
      {/* ENCABEZADO */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Ingresar Nuevo Producto</h1>
        <p className="text-gray-500 mt-2">Añade nuevos artículos al sistema de inventario.</p>
      </header>

      {/* FORMULARIO */}
      <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Nombre */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nombre del Producto</label>
            <input 
              type="text" 
              placeholder="Ej: Leche, Pan..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 outline-none"
            />
          </div>

          {/* Grid de 3 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Stock</label>
                <input 
                  type="number" 
                  placeholder="0"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 outline-none"
                />
             </div>

             <div className="md:col-span-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Categoría</label>
                <select 
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white cursor-pointer focus:ring-2 focus:ring-gray-800 outline-none"
                >
                    <option value="1">Aceites y Grasas</option>
                    <option value="2">Granos y Harinas</option>
                    <option value="3">Conservas</option>
                    <option value="4">Lácteos y Huevos</option>
                    <option value="5">Condimentos</option>
                </select>
             </div>

             <div className="md:col-span-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Proveedor</label>
                <select 
                  value={proveedor}
                  onChange={(e) => setProveedor(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white cursor-pointer focus:ring-2 focus:ring-gray-800 outline-none"
                >
                    <option value="101">Mercadona Tech</option>
                    <option value="102">Carrefour</option>
                    <option value="103">Makro Mayorista</option>
                    <option value="104">Lidl</option>
                </select>
             </div>
          </div>

          {/* Mensajes */}
          {mensaje && (
            <div className={`p-3 rounded-md text-center text-sm font-bold ${mensaje.tipo === 'exito' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {mensaje.texto}
            </div>
          )}

          {/* Botón */}
          <div className="pt-2">
            <div className="w-full"> 
               {/* SOLUCIÓN AL ERROR:
                   Quitamos 'type="submit"' porque Button.tsx no lo acepta.
                   Usamos 'onClick' para llamar a la función manualmente. 
               */}
               <Button 
                 text="Guardar en Inventario" 
                 onClick={handleSubmit} 
               />
            </div>
          </div>
        </form>
      </section>

      {/* --- SECCIÓN NUEVA: ÚLTIMOS MOVIMIENTOS --- */}
      {historial.length > 0 && (
        <section className="animate-fade-in-up">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1">
                Últimos añadidos (Sesión actual)
            </h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <ul>
                    {historial.map((item, index) => (
                        <li key={item.id} className={`p-4 flex justify-between items-center ${index !== historial.length - 1 ? 'border-b border-gray-100' : ''}`}>
                            <div>
                                <p className="font-bold text-gray-900">{item.nombre}</p>
                                <p className="text-xs text-gray-500">Añadido a las {item.hora}</p>
                            </div>
                            <div className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
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