import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Globe, Loader2, Package, Tool, History, CheckCircle2 } from "lucide-react";

// Servicios e Interfaces
import { getCategorias, getProveedores, type Categoria, type Proveedor } from "../services/recursos.service";

type Movimiento = {
  id: number;
  nombre: string;
  cantidad: number;
  tipo: 'ingrediente' | 'utensilio';
  hora: string;
};

const IngresoGeneral = () => {
  // --- ESTADO DE LA VISTA (PESTAÑAS) ---
  const [activeTab, setActiveTab] = useState<'ingredientes' | 'utensilios'>('ingredientes');

  // --- ESTADOS COMPARTIDOS (BACKEND) ---
  const [listaCategorias, setListaCategorias] = useState<Categoria[]>([]);
  const [listaProveedores, setListaProveedores] = useState<Proveedor[]>([]);
  const [cargandoListas, setCargandoListas] = useState(true);

  // --- ESTADOS FORMULARIO ---
  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    stock: "" as number | "",
    id_categoria: "",
    id_proveedor: ""
  });

  const [buscandoOFF, setBuscandoOFF] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ texto: string, tipo: 'exito' | 'error' } | null>(null);
  const [historial, setHistorial] = useState<Movimiento[]>([]);

  // --- 1. CARGA INICIAL ---
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

  // --- 2. LÓGICA DE BÚSQUEDA OPEN FOOD FACTS ---
  const buscarProductoOFF = async () => {
    if (!form.codigo) return;
    setBuscandoOFF(true);
    setMensaje(null);

    try {
      const respuesta = await fetch(`https://world.openfoodfacts.org/api/v0/product/${form.codigo}.json`);
      const data = await respuesta.json();

      if (data.status === 1) {
        const productoOFF = data.product;
        setForm(prev => ({ ...prev, nombre: productoOFF.product_name_es || productoOFF.product_name }));
        setMensaje({ texto: "¡Producto encontrado!", tipo: 'exito' });
      } else {
        setMensaje({ texto: "No encontrado en la base de datos mundial.", tipo: 'error' });
      }
    } catch (error) {
      setMensaje({ texto: "Error de conexión con la API de alimentos.", tipo: 'error' });
    } finally {
      setBuscandoOFF(false);
    }
  };

  // --- 3. ENVIAR A BASE DE DATOS ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.stock || !form.id_categoria || !form.id_proveedor) {
      setMensaje({ texto: "Rellena todos los campos obligatorios.", tipo: 'error' });
      return;
    }

    setGuardando(true);
    const endpoint = activeTab === 'ingredientes' ? 'ingredientes' : 'materiales';
    
    // Adaptar objeto según el endpoint
    const payload = {
      nombre: form.nombre,
      stock: Number(form.stock),
      id_categoria: Number(form.id_categoria),
      id_proveedor: Number(form.id_proveedor),
      precio_unidad: 0, // Valores por defecto
      unidad_medida: activeTab === 'ingredientes' ? "Kg." : "U."
    };

    try {
      const res = await fetch(`http://localhost:3000/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Error en el guardado");

      setMensaje({ texto: `${activeTab === 'ingredientes' ? 'Ingrediente' : 'Utensilio'} registrado con éxito.`, tipo: 'exito' });
      
      // Añadir al historial
      const nuevoMov: Movimiento = {
        id: Date.now(),
        nombre: form.nombre,
        cantidad: Number(form.stock),
        tipo: activeTab === 'ingredientes' ? 'ingrediente' : 'utensilio',
        hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      };
      setHistorial(prev => [nuevoMov, ...prev].slice(0, 5));

      // Limpiar formulario
      setForm({ codigo: "", nombre: "", stock: "", id_categoria: "", id_proveedor: "" });

    } catch (error) {
      setMensaje({ texto: "Error al conectar con el servidor.", tipo: 'error' });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="flex flex-col animate-fade-in space-y-6 pb-10">
      
      {/* HEADER Y PESTAÑAS */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Registro de Entradas</h1>
          <p className="text-gray-500 font-medium">Añade stock o nuevos elementos al sistema</p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-pill border border-gray-200 shadow-inner">
          <button 
            onClick={() => { setActiveTab('ingredientes'); setMensaje(null); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-pill font-bold text-xs transition-all duration-300 ${activeTab === 'ingredientes' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Package size={14} /> INGREDIENTES
          </button>
          <button 
            onClick={() => { setActiveTab('utensilios'); setMensaje(null); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-pill font-bold text-xs transition-all duration-300 ${activeTab === 'utensilios' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Tool size={14} /> UTENSILIOS
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA FORMULARIO (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* BÚSQUEDA OFF (Solo ingredientes) */}
              {activeTab === 'ingredientes' && (
                <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Escáner / Código EAN</label>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input 
                        id="ean" 
                        placeholder="Introduce código de barras..." 
                        value={form.codigo} 
                        onChange={(e) => setForm({...form, codigo: e.target.value})} 
                      />
                    </div>
                    <button
                      type="button"
                      onClick={buscarProductoOFF}
                      disabled={buscandoOFF}
                      className="bg-black text-white px-6 rounded-pill font-bold text-xs hover:bg-gray-800 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {buscandoOFF ? <Loader2 size={16} className="animate-spin" /> : <Globe size={16} />}
                      BUSCAR
                    </button>
                  </div>
                </div>
              )}

              {/* DATOS PRINCIPALES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Nombre del {activeTab === 'ingredientes' ? 'Producto' : 'Utensilio'}</label>
                  <input
                    id="nombre" 
                    placeholder="Ej: Harina de Trigo o Batidora Industrial" 
                    value={form.nombre} 
                    onChange={(e) => setForm({...form, nombre: e.target.value})} 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Stock Inicial / Cantidad</label>
                  <input 
                    id="stock" 
                    type="number" 
                    placeholder="0" 
                    value={form.stock} 
                    onChange={(e) => setForm({...form, stock: e.target.value === "" ? "" : Number(e.target.value)})} 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Categoría</label>
                  <select 
                    value={form.id_categoria}
                    onChange={(e) => setForm({...form, id_categoria: e.target.value})}
                    className="w-full bg-gray-100 border-none rounded-pill py-4 px-6 text-gray-700 focus:ring-2 focus:ring-gray-200 outline-none appearance-none cursor-pointer font-medium"
                  >
                    <option value="">Selecciona categoría...</option>
                    {listaCategorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Proveedor Asignado</label>
                  <select 
                    value={form.id_proveedor}
                    onChange={(e) => setForm({...form, id_proveedor: e.target.value})}
                    className="w-full bg-gray-100 border-none rounded-pill py-4 px-6 text-gray-700 focus:ring-2 focus:ring-gray-200 outline-none appearance-none cursor-pointer font-medium"
                  >
                    <option value="">Selecciona proveedor...</option>
                    {listaProveedores.map(p => <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>)}
                  </select>
                </div>
              </div>

              {mensaje && (
                <div className={`p-4 rounded-2xl text-sm font-bold text-center animate-bounce ${mensaje.tipo === 'exito' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                  {mensaje.texto}
                </div>
              )}

              {/*<div className="pt-4">
                <Button 
                  text={guardando ? "GUARDANDO..." : `REGISTRAR ${activeTab.toUpperCase()}`} 
                  onClick={handleSubmit} 
                />
              </div>*/}
            </form>
          </section>
        </div>

        {/* COLUMNA LATERAL: HISTORIAL (1/3) */}
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-fit">
            <div className="flex items-center gap-2 mb-6">
              <History size={18} className="text-gray-400" />
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Actividad Reciente</h3>
            </div>

            {historial.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-gray-300 text-sm font-medium italic">No hay registros en esta sesión</p>
              </div>
            ) : (
              <div className="space-y-4">
                {historial.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-green-500 shadow-sm">
                        <CheckCircle2 size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 leading-tight">{item.nombre}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{item.hora} • {item.tipo}</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-gray-900 bg-white px-3 py-1 rounded-lg border border-gray-200">
                      +{item.cantidad}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default IngresoGeneral;