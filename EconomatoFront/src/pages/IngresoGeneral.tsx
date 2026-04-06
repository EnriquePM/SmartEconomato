import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Globe, Loader2, Camera } from "lucide-react";
import { ModalScanner } from "../components/ModalScanner";

// Servicios e Interfaces
import { getCategorias, getProveedores, type Categoria, type Proveedor } from "../services/recursos.service";

const IngresoGeneral = () => {
  const [activeTab, setActiveTab] = useState<'ingredientes' | 'utensilios'>('ingredientes');

  const [listaCategorias, setListaCategorias] = useState<Categoria[]>([]);
  const [listaProveedores, setListaProveedores] = useState<Proveedor[]>([]);
  const [cargandoListas, setCargandoListas] = useState(true);

  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    stock: "" as number | "",
    unidad_medida: "",
    precio_unidad: "" as number | "", 
    id_categoria: "",
    id_proveedor: ""
  });

  const [buscandoOFF, setBuscandoOFF] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ texto: string, tipo: 'exito' | 'error' } | null>(null);
  
  // Estado para controlar la cámara
  const [mostrarScanner, setMostrarScanner] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [cats, provs] = await Promise.all([getCategorias(), getProveedores()]);
        setListaCategorias(cats);
        setListaProveedores(provs);
      } catch (error) {
        console.error("Error al cargar recursos", error);
      } finally {
        setCargandoListas(false);
      }
    };
    cargarDatos();
  }, []);

  // --- BÚSQUEDA INTELIGENTE (Manual o por Cámara) ---
  const buscarProductoOFF = async (codigoDesdeScanner?: string | React.MouseEvent) => {
    // Si viene del escáner (string), usamos ese. Si no, usamos el del estado del formulario.
    const codigoABuscar = typeof codigoDesdeScanner === 'string' ? codigoDesdeScanner : form.codigo;

    if (!codigoABuscar) return;
    
    setBuscandoOFF(true);
    setMensaje(null);
    try {
      const respuesta = await fetch(`https://world.openfoodfacts.org/api/v0/product/${codigoABuscar}.json`);
      const data = await respuesta.json();
      if (data.status === 1) {
        const productoOFF = data.product;
        // Rellenamos el formulario automáticamente si lo encuentra
        setForm(prev => ({ 
          ...prev, 
          codigo: codigoABuscar, 
          nombre: productoOFF.product_name_es || productoOFF.product_name || ""
        }));
        setMensaje({ texto: "¡Producto encontrado!", tipo: 'exito' });
      } else {
        // Si no lo encuentra, dejamos el código escrito de todas formas
        setForm(prev => ({ ...prev, codigo: codigoABuscar }));
        setMensaje({ texto: "No encontrado en la base de datos mundial.", tipo: 'error' });
      }
    } catch (error) {
      setMensaje({ texto: "Error de conexión.", tipo: 'error' });
    } finally {
      setBuscandoOFF(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- LÓGICA DE VALIDACIÓN DINÁMICA ---
    const faltaUnidad = activeTab === 'ingredientes' && !form.unidad_medida;
    const faltaCategoria = activeTab === 'ingredientes' && !form.id_categoria;

    if (!form.nombre || form.stock === "" || faltaUnidad || faltaCategoria || form.precio_unidad === "" || !form.id_proveedor) {
      setMensaje({ texto: "Rellena todos los campos obligatorios.", tipo: 'error' });
      return;
    }

    setGuardando(true);
    const endpoint = activeTab === 'ingredientes' ? 'ingredientes' : 'materiales';
    
    // --- PAYLOAD INTELIGENTE ---
    const payload = {
      nombre: form.nombre,
      stock: Number(form.stock),
      id_categoria: activeTab === 'utensilios' ? 3 : Number(form.id_categoria),
      id_proveedor: Number(form.id_proveedor),
      precio_unidad: Number(form.precio_unidad), 
      unidad_medida: activeTab === 'utensilios' ? 'ud' : form.unidad_medida 
    };

    try {
      const res = await fetch(`http://localhost:3000/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Error en el guardado");

      setMensaje({ texto: `${activeTab === 'ingredientes' ? 'Producto' : 'Utensilio'} registrado con éxito.`, tipo: 'exito' });
      
      // Limpiar formulario
      setForm({ codigo: "", nombre: "", stock: "", unidad_medida: "", precio_unidad: "", id_categoria: "", id_proveedor: "" });

    } catch (error) {
      setMensaje({ texto: "Error al conectar con el servidor.", tipo: 'error' });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="h-full flex flex-col animate-fade-in-up pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Registro de Entradas</h1>
          <p className="text-gray-500 mt-1 font-medium">Añade nuevos elementos al inventario general</p>
        </div>
      </div>

      {/* TABS SELECTOR */}
      <div className="flex gap-2 mt-4 pl-2 relative items-end">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-200 z-0"></div>
        <button 
            onClick={() => { setActiveTab('ingredientes'); setMensaje(null); }}
            className={`px-10 py-4 rounded-t-[1.5rem] text-sm font-bold transition-all relative z-10 border-t border-l border-r ${activeTab === 'ingredientes' ? 'bg-white text-red-600 border-gray-200 border-b-white -mb-px pt-4 shadow-[0_-2px_3px_rgba(0,0,0,0.02)]' : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200 py-3'}`}
        >
            PRODUCTOS
        </button>
        <button 
            onClick={() => { setActiveTab('utensilios'); setMensaje(null); }}
            className={`px-10 py-4 rounded-t-[1.5rem] text-sm font-bold transition-all relative z-10 border-t border-l border-r ${activeTab === 'utensilios' ? 'bg-white text-red-600 border-gray-200 border-b-white -mb-px pt-4 shadow-[0_-2px_3px_rgba(0,0,0,0.02)]' : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200 py-3'}`}
        >
            UTENSILIOS
        </button>
      </div>

      {/* FORMULARIO CONTENEDOR */}
      <div className="w-full mt-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* BUSCADOR OPEN FOOD FACTS Y ESCÁNER */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Referencia / Código de Barras</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex gap-2">
                  <Input 
                    id="ean" 
                    placeholder="Escribe el código para buscar o escanéalo..." 
                    value={form.codigo} 
                    onChange={(val) => setForm({...form, codigo: val})} 
                  />
                  {/* BOTÓN DE CÁMARA */}
                  <button
                    type="button"
                    onClick={() => setMostrarScanner(true)}
                    className="bg-gray-200 text-gray-700 px-4 rounded-xl hover:bg-gray-300 transition-colors flex items-center justify-center shrink-0 shadow-sm"
                    title="Escanear con cámara"
                  >
                    <Camera size={20} />
                  </button>
                </div>
                
                <button
                  type="button"
                  onClick={buscarProductoOFF}
                  disabled={buscandoOFF || !form.codigo}
                  className="bg-black text-white px-6 py-3 sm:py-0 rounded-pill font-bold text-xs hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {buscandoOFF ? <Loader2 size={16} className="animate-spin" /> : <Globe size={16} />}
                  BUSCAR EN OFF
                </button>
              </div>
            </div>

            {/* GRID DE DATOS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
              
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-500 mb-1 ml-1">Nombre</label>
                <Input 
                  id="nombre" 
                  placeholder={`Ej: ${activeTab === 'ingredientes' ? 'Azúcar Glass' : 'Pinzas de cocina'}`} 
                  value={form.nombre} 
                  onChange={(val) => setForm({...form, nombre: val})} 
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-500 mb-1 ml-1">Stock Inicial</label>
                <Input 
                  id="stock" 
                  type="number" 
                  placeholder="0" 
                  value={form.stock.toString()} 
                  onChange={(val) => setForm({...form, stock: val === "" ? "" : Number(val)})} 
                />
              </div>

              {activeTab === 'ingredientes' && (
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-500 mb-1 ml-1">Unidad</label>
                  <div className="relative">
                    <select 
                        value={form.unidad_medida}
                        onChange={(e) => setForm({...form, unidad_medida: e.target.value})}
                        className="w-full bg-input border-none rounded-pill py-4 px-6 text-gray-700 focus:ring-2 focus:ring-slate-200 outline-none appearance-none cursor-pointer font-medium transition-all"
                    >
                        <option value="">Selecciona unidad...</option>
                        <option value="kg">Kilos (kg)</option>
                        <option value="g">Gramos (g)</option>
                        <option value="l">Litros (L)</option>
                        <option value="ml">Mililitros (ml)</option>
                        <option value="ud">Unidades (ud)</option>
                    </select>
                  </div>
                </div>
              )}

              <div className={activeTab === 'ingredientes' ? "w-full" : "w-full md:col-span-2"}>
                <label className="block text-sm font-medium text-gray-500 mb-1 ml-1">
                  {activeTab === 'ingredientes' ? 'Precio x Unidad (€)' : 'Coste (€)'}
                </label>
                <Input 
                  id="precio" 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  value={form.precio_unidad.toString()} 
                  onChange={(val) => setForm({...form, precio_unidad: val === "" ? "" : Number(val)})} 
                />
              </div>

              {activeTab === 'ingredientes' && (
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-500 mb-1 ml-1">Categoría</label>
                  <div className="relative">
                    <select 
                        value={form.id_categoria}
                        onChange={(e) => setForm({...form, id_categoria: e.target.value})}
                        className="w-full bg-input border-none rounded-pill py-4 px-6 text-gray-700 focus:ring-2 focus:ring-slate-200 outline-none appearance-none cursor-pointer font-medium transition-all"
                    >
                        <option value="">Selecciona una categoría...</option>
                        {listaCategorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
                    </select>
                  </div>
                </div>
              )}

              <div className={activeTab === 'ingredientes' ? "md:col-span-2" : "md:col-span-3"}>
                <label className="block text-sm font-medium text-gray-500 mb-1 ml-1">Proveedor</label>
                <div className="relative">
                  <select 
                      value={form.id_proveedor}
                      onChange={(e) => setForm({...form, id_proveedor: e.target.value})}
                      className="w-full bg-input border-none rounded-pill py-4 px-6 text-gray-700 focus:ring-2 focus:ring-slate-200 outline-none appearance-none cursor-pointer font-medium transition-all"
                  >
                      <option value="">Selecciona un proveedor...</option>
                      {listaProveedores.map(p => <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {mensaje && (
              <div className={`p-4 rounded-2xl text-sm font-bold text-center transition-all ${mensaje.tipo === 'exito' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                {mensaje.texto}
              </div>
            )}

            <div className="pt-6 border-t border-gray-50">
                <button 
                    onClick={handleSubmit}
                    disabled={guardando}
                    className="w-full bg-black text-white py-4 rounded-pill font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98] uppercase text-xs tracking-widest flex items-center justify-center gap-3"
                >
                    {guardando && <Loader2 size={18} className="animate-spin" />}
                    {guardando ? "Procesando..." : `Registrar ${activeTab === 'ingredientes' ? 'Producto' : 'Utensilio'}`}
                </button>
            </div>
          </form>
        </div>
      </div>

      {/* 👇 MODAL DEL ESCÁNER AUTOMATIZADO 👇 */}
      {mostrarScanner && (
        <ModalScanner 
          onClose={() => setMostrarScanner(false)}
          onScan={(codigoLeido) => {
            setMostrarScanner(false); // Cerramos el modal de la cámara
            buscarProductoOFF(codigoLeido); // Lanzamos la búsqueda de forma automática
          }}
        />
      )}

    </div>
  );
};

export default IngresoGeneral;