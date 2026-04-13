import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/select"; 
import { Globe, Loader2, Camera, Eraser } from "lucide-react";
import { ModalScanner } from "../components/ModalScanner";

import { getCategorias, getProveedores, type Categoria, type Proveedor } from "../services/recursos.service";

const IngresoGeneral = () => {
  const [activeTab, setActiveTab] = useState<'ingredientes' | 'utensilios'>('ingredientes');

  const [listaCategorias, setListaCategorias] = useState<Categoria[]>([]);
  const [listaProveedores, setListaProveedores] = useState<Proveedor[]>([]);
  const [cargandoListas, setCargandoListas] = useState(true);

  const formInicial = {
    codigo: "",
    nombre: "",
    stock: "" as number | "",
    unidad_medida: "",
    precio_unidad: "" as number | "", 
    id_categoria: "",
    id_proveedor: ""
  };

  const [form, setForm] = useState(formInicial);

  const [buscandoOFF, setBuscandoOFF] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ texto: string, tipo: 'exito' | 'error' } | null>(null);
  
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

  const opcionesCategorias = listaCategorias.map(c => ({ value: c.id_categoria.toString(), label: c.nombre }));
  const opcionesProveedores = listaProveedores.map(p => ({ value: p.id_proveedor.toString(), label: p.nombre }));
  const opcionesUnidad = [
    { value: "kg", label: "Kilos (kg)" },
    { value: "g", label: "Gramos (g)" },
    { value: "l", label: "Litros (L)" },
    { value: "ml", label: "Mililitros (ml)" },
    { value: "ud", label: "Unidades (ud)" }
  ];

  const buscarProductoOFF = async (codigoDesdeScanner?: string | React.MouseEvent) => {
    const codigoABuscar = typeof codigoDesdeScanner === 'string' ? codigoDesdeScanner : form.codigo;
    if (!codigoABuscar) return;
    
    setBuscandoOFF(true);
    setMensaje(null);
    try {
      const respuesta = await fetch(`https://world.openfoodfacts.org/api/v0/product/${codigoABuscar}.json`);
      const data = await respuesta.json();
      if (data.status === 1) {
        const productoOFF = data.product;
        setForm(prev => ({ 
          ...prev, 
          codigo: codigoABuscar, 
          nombre: productoOFF.product_name_es || productoOFF.product_name || ""
        }));
        setMensaje({ texto: "¡Producto encontrado!", tipo: 'exito' });
      } else {
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
    
    const faltaUnidad = activeTab === 'ingredientes' && !form.unidad_medida;
    const faltaCategoria = activeTab === 'ingredientes' && !form.id_categoria;

    if (!form.nombre || form.stock === "" || faltaUnidad || faltaCategoria || form.precio_unidad === "" || !form.id_proveedor) {
      setMensaje({ texto: "Rellena todos los campos obligatorios.", tipo: 'error' });
      return;
    }

    setGuardando(true);
    const endpoint = activeTab === 'ingredientes' ? 'ingredientes' : 'materiales';
    
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
      setForm(formInicial);

    } catch (error) {
      setMensaje({ texto: "Error al conectar con el servidor.", tipo: 'error' });
    } finally {
      setGuardando(false);
    }
  };

  const limpiarFormulario = () => {
    setForm(formInicial);
    setMensaje(null);
  };

  return (
    <div className="h-full flex flex-col animate-fade-in-up overflow-hidden pb-2">
      
      {/* HEADER COMPACTO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center shrink-0 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Registro de Entradas</h1>
          <p className="text-gray-500 mt-1 font-medium text-sm">Añade nuevos elementos al inventario general</p>
        </div>
      </div>

      {/* TABS SELECTOR */}
      <div className="flex gap-2 mt-2 pl-2 relative items-end shrink-0">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-200 z-0"></div>
        <button 
            onClick={() => { setActiveTab('ingredientes'); setMensaje(null); }}
            className={`px-10 py-3 rounded-t-[1.5rem] text-sm font-bold transition-all relative z-10 border-t border-l border-r ${activeTab === 'ingredientes' ? 'bg-white text-red-600 border-gray-200 border-b-white -mb-px pt-3 shadow-[0_-2px_3px_rgba(0,0,0,0.02)]' : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200 py-2'}`}
        >
            PRODUCTOS
        </button>
        <button 
            onClick={() => { setActiveTab('utensilios'); setMensaje(null); }}
            className={`px-10 py-3 rounded-t-[1.5rem] text-sm font-bold transition-all relative z-10 border-t border-l border-r ${activeTab === 'utensilios' ? 'bg-white text-red-600 border-gray-200 border-b-white -mb-px pt-3 shadow-[0_-2px_3px_rgba(0,0,0,0.02)]' : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200 py-2'}`}
        >
            UTENSILIOS
        </button>
      </div>

      {/* FORMULARIO CONTENEDOR */}
      <div className="w-full flex-1 bg-white p-5 rounded-b-2xl rounded-tr-2xl shadow-sm border border-gray-100 flex flex-col justify-center min-h-0">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 h-full max-h-full min-h-0">
          
          {/* 1. BUSCADOR */}
          <div className="bg-gray-50 p-3 rounded-2xl border border-dashed border-gray-200 shrink-0">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Referencia / Código de Barras</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex gap-2">
                <Input 
                  id="ean" 
                  placeholder="Escribe el código para buscar o escanéalo..." 
                  value={form.codigo} 
                  onChange={(val) => setForm({...form, codigo: val})} 
                />
                <button
                  type="button"
                  onClick={() => setMostrarScanner(true)}
                  className="bg-gray-200 text-gray-700 px-4 rounded-xl hover:bg-gray-300 transition-colors flex items-center justify-center shrink-0 shadow-sm"
                  title="Escanear con cámara"
                >
                  <Camera size={20} />
                </button>
              </div>
              
              <Button
                variant="primario"
                onClick={buscarProductoOFF}
                disabled={buscandoOFF || !form.codigo}
                className="px-6 py-2 sm:py-0 text-xs flex items-center justify-center gap-2"
              >
                {buscandoOFF ? <Loader2 size={16} className="animate-spin" /> : <Globe size={16} />}
                BUSCAR EN OFF
              </Button>
            </div>
          </div>

          {/* 2. GRID DE DATOS */}
          <div className="flex-1 mt-1">
            <div className="grid grid-cols-12 gap-x-6 gap-y-3 content-start">
              
              <div className="col-span-12">
                <Input 
                  label="Nombre"
                  id="nombre" 
                  placeholder={`Ej: ${activeTab === 'ingredientes' ? 'Azúcar Glass' : 'Pinzas de cocina'}`} 
                  value={form.nombre} 
                  onChange={(val) => setForm({...form, nombre: val})} 
                />
              </div>

              <div className={activeTab === 'ingredientes' ? "col-span-4" : "col-span-6"}>
                <Input 
                  label="Stock Inicial"
                  id="stock" 
                  type="number" 
                  placeholder="0" 
                  value={form.stock.toString()} 
                  onChange={(val) => setForm({...form, stock: val === "" ? "" : Number(val)})} 
                />
              </div>

              {activeTab === 'ingredientes' && (
                <div className="col-span-4">
                  <label className="block text-[13px] font-medium text-gray-700 mb-1">Unidad</label>
                  <Select 
                    placeholder="Selecciona..."
                    options={opcionesUnidad}
                    value={form.unidad_medida}
                    onChange={(val) => setForm({...form, unidad_medida: val})}
                  />
                </div>
              )}

              <div className={activeTab === 'ingredientes' ? "col-span-4" : "col-span-6"}>
                <Input 
                  label={activeTab === 'ingredientes' ? 'Precio x Ud (€)' : 'Coste (€)'}
                  id="precio" 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  value={form.precio_unidad.toString()} 
                  onChange={(val) => setForm({...form, precio_unidad: val === "" ? "" : Number(val)})} 
                />
              </div>

              {activeTab === 'ingredientes' && (
                <div className="col-span-6">
                  <label className="block text-[13px] font-medium text-gray-700 mb-1">Categoría</label>
                  <Select 
                    placeholder="Selecciona categoría..."
                    options={opcionesCategorias}
                    value={form.id_categoria}
                    onChange={(val) => setForm({...form, id_categoria: val})}
                  />
                </div>
              )}

              <div className={activeTab === 'ingredientes' ? "col-span-6" : "col-span-12"}>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Proveedor</label>
                <Select 
                  placeholder="Selecciona proveedor..."
                  options={opcionesProveedores}
                  value={form.id_proveedor}
                  onChange={(val) => setForm({...form, id_proveedor: val})}
                />
              </div>
            </div>
          </div>

          {/* 👇 3. ZONA INFERIOR: ¡Centrada! (py-6 asegura mismo espacio por arriba y por abajo) */}
          <div className="shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4 py-6 mt-auto border-t border-gray-100">
            
            {/* Lado izquierdo: Mensaje */}
            <div className="w-full sm:w-1/2">
              {mensaje && (
                <div className={`py-3 px-4 rounded-xl text-sm font-bold text-center transition-all ${mensaje.tipo === 'exito' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                  {mensaje.texto}
                </div>
              )}
            </div>

            {/* Lado derecho: Botones */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button 
                  type="button"
                  variant="gris"
                  onClick={limpiarFormulario}
                  className="px-5 py-2.5 text-xs tracking-widest flex items-center justify-center gap-2"
              >
                  <Eraser size={16} /> LIMPIAR
              </Button>

              <Button 
                  variant="primario"
                  onClick={handleSubmit}
                  disabled={guardando}
                  className="px-8 py-2.5 text-xs tracking-widest flex items-center justify-center gap-2 shadow-md"
              >
                  {guardando && <Loader2 size={16} className="animate-spin" />}
                  {guardando ? "PROCESANDO..." : `REGISTRAR ${activeTab === 'ingredientes' ? 'PRODUCTO' : 'UTENSILIO'}`}
              </Button>
            </div>
          </div>

        </form>
      </div>

      {mostrarScanner && (
        <ModalScanner 
          onClose={() => setMostrarScanner(false)}
          onScan={(codigoLeido) => {
            setMostrarScanner(false);
            buscarProductoOFF(codigoLeido);
          }}
        />
      )}

    </div>
  );
};

export default IngresoGeneral;