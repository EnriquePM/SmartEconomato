import { Button } from "../components/ui/Button";
import { Globe, Loader2 } from "lucide-react";
import { useIngresarProductoForm } from "../hooks/useIngresarProductoForm";

const IngresarProducto = () => {
  const {
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
  } = useIngresarProductoForm();

  return (
    <main className="w-full space-y-8"> 
      
      <header className="text-left">
        <h1 className="text-3xl font-bold text-gray-900">Ingresar Nuevo Producto</h1>
        <p className="text-gray-500 mt-2">Escanea el codigo o escribe los datos manualmente.</p>
      </header>

      <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8 w-full">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          
          {/* CODIGO DE BARRAS */}
          <div className="flex gap-4 items-end">
            <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Codigo de Barras (EAN)</label>
                <input 
                type="text" 
                placeholder="Ej: 5449000000996 (Coca-Cola)"
                value={codigoBarras}
                onChange={(e) => setCodigoBarras(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono"
                />
            </div>
            <div className="pb-1">
                <button
                    type="button" 
                    onClick={buscarProductoOFF}
                    disabled={buscando}
                    // Anadido 'flex items-center gap-2' para alinear icono y texto
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
              placeholder="Se rellenara solo o escribelo tu..."
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

             {/* 6. SELECT DE CATEGORIA DINAMICO */}
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Categoria</label>
                <select 
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white cursor-pointer focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                >
                    <option value="" disabled>-- Selecciona una categoria --</option>
                    {listaCategorias.map((cat) => (
                        <option key={cat.id_categoria} value={cat.id_categoria}>
                            {cat.nombre}
                        </option>
                    ))}
                </select>
             </div>

             {/* 7. SELECT DE PROVEEDOR DINAMICO */}
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Proveedor</label>
                <select 
                  value={proveedor}
                  onChange={(e) => setProveedor(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white cursor-pointer focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                >
                    <option value="" disabled>-- Selecciona un proveedor --</option>
                    {listaProveedores.map((prov) => (
                        <option key={prov.id_proveedor} value={prov.id_proveedor}>
                            {prov.nombre}
                        </option>
                    ))}
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
                 onClick={handleSubmit} 
               >
                 Guardar en Base de Datos
               </Button>
            </div>
          </div>

        </form>
      </section>

      {/* Historial (sin cambios) */}
      {historial.length > 0 && (
        <section className="animate-fade-in-up w-full">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                Historial de sesion
            </h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <ul>
                    {historial.map((item, index) => (
                        <li key={item.id} className={`p-4 flex justify-between items-center ${index !== historial.length - 1 ? 'border-b border-gray-100' : ''}`}>
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs">OK</div>
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
