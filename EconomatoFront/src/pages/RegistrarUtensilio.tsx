import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input"; 

// Interfaces para TypeScript (para que sepa qué forma tienen tus datos)
interface Categoria {
  id_categoria: number;
  nombre: string;
}

interface Proveedor {
  id_proveedor: number;
  nombre: string;
}

const RegistrarUtensilio = () => {
  // --- ESTADOS DEL FORMULARIO ---
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [stock, setStock] = useState("");
  
  // Estados para lo que seleccionamos
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState("");

  // --- ESTADOS DE DATOS (Listas que vienen del Back) ---
  const [listaCategorias, setListaCategorias] = useState<Categoria[]>([]);
  const [listaProveedores, setListaProveedores] = useState<Proveedor[]>([]);
  const [cargando, setCargando] = useState(true);

  // Estados de UI
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{texto: string, tipo: 'exito' | 'error'} | null>(null);

  // --- 1. CARGAR DATOS AL INICIAR ---
  useEffect(() => {
    const cargarDatos = async () => {
        try {
            // Hacemos las dos peticiones a la vez
            const [resCat, resProv] = await Promise.all([
                fetch("http://localhost:3000/api/categorias"),
                fetch("http://localhost:3000/api/proveedores")
            ]);

            // Procesar Categorías
            if (resCat.ok) {
                const data = await resCat.json();
                setListaCategorias(data);
                // Si hay datos, pre-seleccionamos el primero para que el select no se quede vacío
                if (data.length > 0) setCategoriaSeleccionada(data[0].id_categoria);
            }

            // Procesar Proveedores
            if (resProv.ok) {
                const data = await resProv.json();
                setListaProveedores(data);
                if (data.length > 0) setProveedorSeleccionado(data[0].id_proveedor);
            }

        } catch (error) {
            console.error("Error cargando listas:", error);
            setMensaje({ texto: "Error conectando con la base de datos", tipo: "error" });
        } finally {
            setCargando(false);
        }
    };

    cargarDatos();
  }, []);

  // --- 2. ENVIAR FORMULARIO ---
  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();

    if (!nombre) {
        setMensaje({ texto: "El nombre es obligatorio.", tipo: 'error' });
        return;
    }

    setGuardando(true);

    // Preparamos el objeto para tu Controller 'createMaterial'
    const nuevoMaterial = {
        nombre: nombre,
        // Convertimos a número porque el select devuelve string
        id_categoria: Number(categoriaSeleccionada), 
        // id_proveedor: Number(proveedorSeleccionado), // <-- DESCOMENTAR SI TU BD YA TIENE ESTE CAMPO
        stock : Number(stock),
        precio_unidad: 0,   // Valor por defecto
        unidad_medida: "U." // Valor por defecto
    };

    try {
        const response = await fetch("http://localhost:3000/api/materiales", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoMaterial)
        });

        if (!response.ok) throw new Error("Error al guardar");

        setMensaje({ texto: "Utensilio registrado correctamente.", tipo: 'exito' });
        
        // Limpiar campos de texto (no limpiamos los selects para facilitar registros masivos)
        setNombre("");
        setStock("");
        setCodigo("");

    } catch (error) {
        console.error(error);
        setMensaje({ texto: "Error al guardar el utensilio.", tipo: 'error' });
    } finally {
        setGuardando(false);
    }
  };

  return (
    <main className="w-full space-y-8 animate-fade-in"> 
      
      <header className="text-left">
        <h1 className="text-3xl font-bold text-gray-900">Registrar Utensilio</h1>
        <p className="text-gray-500 mt-2">Los datos de categorías y proveedores se cargan desde la BD.</p>
      </header>

      <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          
          {/* CÓDIGO */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Código / Referencia</label>
            <Input id="codigo" type="text" placeholder="Ej: REF-9901" value={codigo} onChange={setCodigo} />
          </div>

          {/* NOMBRE */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Nombre</label>
            <Input id="nombre" type="text" placeholder="Ej: Cuchillo Cebollero" value={nombre} onChange={setNombre} />
          </div>

          <hr className="border-gray-100" />

          {/* GRID DE SELECTS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             
             {/* STOCK (Solo visual por ahora) */}
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Stock Inicial</label>
                <Input id="stock" type="text" placeholder="0" value={stock} onChange={setStock} />
             </div>

             {/* SELECT CATEGORÍA (DINÁMICO) */}
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                    Categoría {cargando && <span className="text-xs font-normal text-gray-400">Loading...</span>}
                </label>
                <div className="relative">
                    <select 
                      value={categoriaSeleccionada}
                      onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                      className="w-full bg-gray-100 border-none rounded-[30px] py-4 px-6 text-gray-700 focus:ring-2 focus:ring-gray-200 outline-none appearance-none cursor-pointer"
                      disabled={cargando}
                    >
                        {/* Mapeamos la lista que vino del backend */}
                        {listaCategorias.map((cat) => (
                            <option key={cat.id_categoria} value={cat.id_categoria}>
                                {cat.nombre}
                            </option>
                        ))}
                        
                        {listaCategorias.length === 0 && !cargando && <option>No hay categorías</option>}
                    </select>
                </div>
             </div>

             {/* SELECT PROVEEDOR (DINÁMICO) */}
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                    Proveedor {cargando && <span className="text-xs font-normal text-gray-400">Loading...</span>}
                </label>
                <div className="relative">
                    <select 
                      value={proveedorSeleccionado}
                      onChange={(e) => setProveedorSeleccionado(e.target.value)}
                      className="w-full bg-gray-100 border-none rounded-[30px] py-4 px-6 text-gray-700 focus:ring-2 focus:ring-gray-200 outline-none appearance-none cursor-pointer"
                      disabled={cargando}
                    >
                        {listaProveedores.map((prov) => (
                            <option key={prov.id_proveedor} value={prov.id_proveedor}>
                                {prov.nombre}
                            </option>
                        ))}

                        {listaProveedores.length === 0 && !cargando && <option>No hay proveedores</option>}
                    </select>
                </div>
             </div>

          </div>

          {/* MENSAJES DE ALERTA */}
          {mensaje && (
            <div className={`p-4 rounded-xl text-center font-medium ${mensaje.tipo === 'exito' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {mensaje.texto}
            </div>
          )}

          {/* BOTÓN */}
          <div className="pt-4">
               <Button text={guardando ? "Guardando..." : "Registrar Utensilio"} onClick={handleSubmit} />
          </div>

        </form>
      </section>
    </main>
  );
};

export default RegistrarUtensilio;