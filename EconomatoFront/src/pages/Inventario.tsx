import { useEffect, useState } from "react";

// --- IMPORTACIÓN DE COMPONENTES ---
import { TablaInventario } from "../components/TablaInventario"; // La tabla bonita estilo tarjeta
import { Buscador } from "../components/Buscador";             // El input de búsqueda
import { Ordenador } from "../components/Ordenador";           // El desplegable para ordenar
import { Button } from "../components/ui/Button";              // TU botón (sin modificar)

// --- IMPORTACIÓN DE TIPOS ---
import type { Ingrediente } from "../types/ingrediente";

const Inventario = () => {
  // =========================================
  // 1. ESTADOS (La memoria de la página)
  // =========================================
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState<string>("");
  const [orden, setOrden] = useState<string>("alfabetico");

  // =========================================
  // 2. EFECTO DE CARGA (Al abrir la página)
  // =========================================
  useEffect(() => {
    fetch("http://localhost:3000/ingredientes") 
      .then((response) => {
        if (!response.ok) throw new Error("Error conectando con el servidor");
        return response.json();
      })
      .then((data) => setIngredientes(data))
      .catch((err) => {
        console.error(err);
        setError("No se pudieron cargar los datos. Revisa json-server.");
      });
  }, []);

  // =========================================
  // 3. LÓGICA (Filtrar, Ordenar y Limpiar)
  // =========================================

  // Función para el botón negro: Borra todo y deja la tabla como nueva
  const handleLimpiarFiltros = () => {
    setBusqueda("");        
    setOrden("alfabetico"); 
  };

  // Paso A: Filtrar
  const ingredientesFiltrados = ingredientes.filter((item) => {
    return item.nombre.toLowerCase().includes(busqueda.toLowerCase());
  });

  // Paso B: Ordenar
  const datosParaLaTabla = [...ingredientesFiltrados].sort((a, b) => {
    if (orden === "alfabetico") return a.nombre.localeCompare(b.nombre);
    if (orden === "stockMayor") return b.stock - a.stock;
    if (orden === "stockMenor") return a.stock - b.stock;
    if (orden === "proveedor") return a.id_proveedor - b.id_proveedor;
    return 0;
  });

  // =========================================
  // 4. VISTA (El diseño visual)
  // =========================================
  return (
    <main className="p-6 max-w-7xl mx-auto"> 
      {/* Encabezado */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Inventario</h1>
        <p className="text-gray-500 mt-2">Consulta y gestiona el stock de productos en tiempo real.</p>
      </header>

{/* --- BARRA DE HERRAMIENTAS RESPONSIVE --- */}
      <section 
        aria-label="Herramientas de filtrado" 
        className="flex flex-col lg:grid lg:grid-cols-3 gap-6 mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        {/* 1. BUSCADOR */}
        <div className="w-full">
           <Buscador valor={busqueda} onBuscar={setBusqueda} />
        </div>
        
        {/* 2. ORDENADOR */}
        <div className="w-full flex lg:justify-center">
           <div className="w-full lg:max-w-[200px]">
             <Ordenador ordenActual={orden} onCambioOrden={setOrden} />
           </div>
        </div>

        {/* 3. BOTÓN */}
        <div className="w-full flex justify-center lg:justify-end">
           {/* CAMBIO AQUÍ: 
               Añadimos 'mb-1' (o 'mb-2' si quieres más) para separarlo del suelo.
               Al separarse del suelo, visualmente "sube" y se alinea con el dropdown. 
           */}
           <div className="w-56 mb-1">
             <Button 
               text="Limpiar Filtros" 
               onClick={handleLimpiarFiltros} 
             />
           </div>
        </div>
      </section>
      
      {/* --- MENSAJES DE ERROR --- */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">Error de conexión</p>
          <p>{error}</p>
        </div>
      )}
      
      {/* --- TABLA DE RESULTADOS --- */}
      {!error && ingredientes.length > 0 && (
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
           <TablaInventario data={datosParaLaTabla} />
           
           {/* Mensaje vacío si buscamos algo raro */}
           {datosParaLaTabla.length === 0 && (
             <div className="text-center py-12 text-gray-500">
               <p className="text-lg">No hemos encontrado "{busqueda}" 🕵️‍♂️</p>
               <p className="text-sm mt-2">Prueba a limpiar los filtros.</p>
             </div>
           )}
        </section>
      )}

      {/* --- ESTADO DE CARGA --- */}
      {!error && ingredientes.length === 0 && (
        <p className="text-center mt-12 text-gray-400 animate-pulse">Cargando datos...</p>
      )}
    </main>
  );
};

export default Inventario;