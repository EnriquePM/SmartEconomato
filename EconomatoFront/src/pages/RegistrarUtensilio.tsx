import { useState } from "react";
// Importamos TUS componentes reutilizables
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input"; 
// Ya no necesitamos iconos extra
// import { Search } from "lucide-react"; 

// Tipo para el historial local (actualizado sin ubicación)
type Movimiento = {
  id: number;
  nombre: string;
  hora: string;
};

const RegistrarUtensilio = () => {
  // --- ESTADOS ---
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [stock, setStock] = useState("");
  
  // Selects
  const [categoria, setCategoria] = useState("Menaje");
  const [proveedor, setProveedor] = useState("101"); // Por defecto Mercadona Tech

  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{texto: string, tipo: 'exito' | 'error'} | null>(null);
  const [historial, setHistorial] = useState<Movimiento[]>([]);

  // --- LÓGICA DE GUARDADO ---
  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();

    // Validación básica
    if (!nombre || !stock) {
        setMensaje({ texto: "Por favor, rellena el nombre y el stock.", tipo: 'error' });
        return;
    }

    setGuardando(true);

    const nuevoUtensilio = {
      codigo,
      nombre,
      stock: Number(stock),
      categoria,
      id_proveedor: Number(proveedor), // Guardamos el ID del proveedor
      fecha_registro: new Date().toISOString()
    };

    console.log("Enviando a guardar:", nuevoUtensilio);

    // SIMULACIÓN DE GUARDADO
    setTimeout(() => {
        setMensaje({ texto: "Utensilio registrado correctamente.", tipo: 'exito' });
        
        // Añadir al historial visual
        const horaActual = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        setHistorial(prev => [{
            id: Date.now(),
            nombre: nombre,
            hora: horaActual
        }, ...prev].slice(0, 3));

        // Limpiar formulario
        setNombre("");
        setStock("");
        setCodigo("");
        // Mantenemos la categoría y proveedor por si quiere meter varios seguidos
        setGuardando(false);
    }, 800);
  };

  return (
    <main className="w-full space-y-8 animate-fade-in"> 
      
      <header className="text-left">
        <h1 className="text-3xl font-bold text-gray-900">
            Registrar Utensilio
        </h1>
        <p className="text-gray-500 mt-2">Da de alta herramientas, menaje y material de cocina.</p>
      </header>

      <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          
          {/* --- ZONA: CÓDIGO (SIN LUPA) --- */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Código / Referencia</label>
            <Input 
                id="codigo"
                type="text" 
                placeholder="Ej: REF-9901"
                value={codigo}
                onChange={setCodigo} 
            />
          </div>

          {/* --- ZONA: NOMBRE --- */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Nombre del Utensilio</label>
            <Input 
                id="nombre"
                type="text" 
                placeholder="Ej: Cuchillo Cebollero 20cm"
                value={nombre}
                onChange={setNombre}
            />
          </div>

          <hr className="border-gray-100" />

          {/* --- GRID DE 3 COLUMNAS: STOCK | CATEGORÍA | PROVEEDOR --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             
             {/* 1. STOCK */}
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Cantidad (Stock)</label>
                <Input 
                    id="stock"
                    type="text"
                    placeholder="0"
                    value={stock}
                    onChange={setStock}
                />
             </div>

             {/* 2. CATEGORÍA */}
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Categoría</label>
                <div className="relative">
                    <select 
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      className="w-full bg-gray-100 border-none rounded-[30px] py-4 px-6 text-gray-700 focus:ring-2 focus:ring-gray-200 outline-none transition-all cursor-pointer appearance-none"
                    >
                        <option value="Menaje">Menaje General</option>
                        <option value="Cuchillos">Cuchillería</option>
                        <option value="Sartenes">Sartenes y Ollas</option>
                        <option value="Electrico">Pequeño Electrodoméstico</option>
                        <option value="Limpieza">Material de Limpieza</option>
                        <option value="Textil">Textil / Uniformes</option>
                    </select>
                    {/* Flecha personalizada */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-gray-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
             </div>

             {/* 3. PROVEEDOR (NUEVO) */}
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Proveedor</label>
                <div className="relative">
                    <select 
                      value={proveedor}
                      onChange={(e) => setProveedor(e.target.value)}
                      className="w-full bg-gray-100 border-none rounded-[30px] py-4 px-6 text-gray-700 focus:ring-2 focus:ring-gray-200 outline-none transition-all cursor-pointer appearance-none"
                    >
                        <option value="101">Mercadona Tech</option>
                        <option value="102">Carrefour</option>
                        <option value="103">Makro Mayorista</option>
                        <option value="104">Lidl</option>
                        <option value="999">Otro / Genérico</option>
                    </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-gray-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
             </div>
          </div>

          {/* MENSAJES */}
          {mensaje && (
            <div className={`p-4 rounded-xl text-center font-medium animate-fade-in ${mensaje.tipo === 'exito' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {mensaje.texto}
            </div>
          )}

          {/* BOTÓN GUARDAR */}
          <div className="pt-4">
             <div className="w-full"> 
               <Button 
                 text={guardando ? "Guardando..." : "Registrar Utensilio"} 
                 onClick={handleSubmit} 
               />
            </div>
          </div>

        </form>
      </section>

      {/* HISTORIAL LOCAL */}
      {historial.length > 0 && (
        <section className="animate-fade-in-up w-full">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 ml-2">
                Añadidos recientemente
            </h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <ul>
                    {historial.map((item, index) => (
                        <li key={item.id} className={`p-4 flex justify-between items-center ${index !== historial.length - 1 ? 'border-b border-gray-100' : ''}`}>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                                    U
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900">{item.nombre}</p>
                                  <p className="text-xs text-gray-500">
                                    Registrado a las {item.hora}
                                  </p>
                                </div>
                            </div>
                            <div className="text-green-600 font-bold text-sm">
                                Guardado
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

export default RegistrarUtensilio;