import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Globe, Loader2, Camera, Eraser } from 'lucide-react';
import { ModalScanner } from '../components/ModalScanner';
import { useIngresoGeneralForm } from '../hooks/useIngresoGeneralForm';

const IngresoGeneral = () => {
  const {
    activeTab,
    setActiveTab,
    form,
    setCampo,
    cargandoListas,
    buscandoOFF,
    guardando,
    mensaje,
    mostrarScanner,
    setMostrarScanner,
    opcionesCategorias,
    opcionesProveedores,
    opcionesUnidad,
    buscarProductoOFF,
    handleSubmit,
    limpiarFormulario
  } = useIngresoGeneralForm();

  return (
    <div className="animate-fade-in-up pb-10">
      <div className="pb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Registro de Entradas</h1>
        <p className="text-gray-500 mt-1 font-medium text-sm">Añade nuevos elementos al inventario general</p>
      </div>

      <div className="flex gap-2 pl-2 relative items-end">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-200 z-0"></div>
        <button
          onClick={() => setActiveTab('ingredientes')}
          className={`px-10 py-3 rounded-t-[1.5rem] text-sm font-bold transition-all relative z-10 border-t border-l border-r ${activeTab === 'ingredientes' ? 'bg-white text-red-600 border-gray-200 border-b-white -mb-px pt-3 shadow-[0_-2px_3px_rgba(0,0,0,0.02)]' : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200 py-2'}`}
        >
          PRODUCTOS
        </button>
        <button
          onClick={() => setActiveTab('utensilios')}
          className={`px-10 py-3 rounded-t-[1.5rem] text-sm font-bold transition-all relative z-10 border-t border-l border-r ${activeTab === 'utensilios' ? 'bg-white text-red-600 border-gray-200 border-b-white -mb-px pt-3 shadow-[0_-2px_3px_rgba(0,0,0,0.02)]' : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200 py-2'}`}
        >
          UTENSILIOS
        </button>
      </div>

      <div className="w-full bg-white p-8 sm:p-10 rounded-b-3xl rounded-tr-3xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Referencia / Código de Barras</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex gap-2">
                <Input
                  type="text"
                  id="ean"
                  placeholder="Escribe el código para buscar o escanéalo..."
                  value={form.codigo}
                  onChange={(val) => setCampo('codigo', val)}
                />
                <button
                  type="button"
                  onClick={() => setMostrarScanner(true)}
                  className="bg-gray-200 text-gray-700 px-5 rounded-xl hover:bg-gray-300 transition-colors flex items-center justify-center shadow-sm"
                  title="Escanear con cámara"
                >
                  <Camera size={20} />
                </button>
              </div>

              <Button
                variant="primario"
                onClick={buscarProductoOFF}
                disabled={buscandoOFF || !form.codigo}
                className="px-8 py-3 sm:py-0 text-xs flex items-center justify-center gap-2 font-bold"
              >
                {buscandoOFF ? <Loader2 size={16} className="animate-spin" /> : <Globe size={16} />}
                BUSCAR EN OFF
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-x-6 gap-y-8">
            <div className="col-span-12">
              <Input
                type="text"
                label="Nombre"
                id="nombre"
                placeholder={`Ej: ${activeTab === 'ingredientes' ? 'Azúcar Glass' : 'Pinzas de cocina'}`}
                value={form.nombre}
                onChange={(val) => setCampo('nombre', val)}
              />
            </div>

            <div className={activeTab === 'ingredientes' ? 'col-span-12 md:col-span-4' : 'col-span-12 md:col-span-6'}>
              <Input
                label="Stock Inicial"
                id="stock"
                type="number"
                placeholder="0"
                value={String(form.stock)}
                onChange={(val) => setCampo('stock', val === '' ? '' : Number(val))}
              />
            </div>

            {activeTab === 'ingredientes' && (
              <div className="col-span-12 md:col-span-4">
                <label className="block text-[13px] font-bold text-gray-700 mb-2 ml-1">Unidad</label>
                <Select
                  options={opcionesUnidad}
                  value={form.unidad_medida}
                  onChange={(val) => setCampo('unidad_medida', val)}
                />
              </div>
            )}

            <div className={activeTab === 'ingredientes' ? 'col-span-12 md:col-span-4' : 'col-span-12 md:col-span-6'}>
              <Input
                label={activeTab === 'ingredientes' ? 'Precio x Ud (€)' : 'Coste (€)'}
                id="precio"
                type="number"
                placeholder="0.00"
                value={String(form.precio_unidad)}
                onChange={(val) => setCampo('precio_unidad', val === '' ? '' : Number(val))}
              />
            </div>

            <div className="col-span-12 md:col-span-6">
              <label className="block text-[13px] font-bold text-gray-700 mb-2 ml-1">Categoría</label>
              <Select
                options={opcionesCategorias}
                value={form.id_categoria}
                onChange={(val) => setCampo('id_categoria', val)}
              />
            </div>

            {activeTab === 'ingredientes' && (
              <div className="col-span-12 md:col-span-6">
                <label className="block text-[13px] font-bold text-gray-700 mb-2 ml-1">Proveedor</label>
                <Select
                  options={opcionesProveedores}
                  value={form.id_proveedor}
                  onChange={(val) => setCampo('id_proveedor', val)}
                />
              </div>
            )}
            
            {activeTab === 'ingredientes' && (
              <div className="col-span-12 md:col-span-6">
                <Input
                  label="Fecha de caducidad (opcional)"
                  id="fecha_caducidad"
                  type="date"
                  placeholder=""
                  value={form.fecha_caducidad || ''}
                  onChange={(val) => setCampo('fecha_caducidad', val)}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-100">
            <div className="w-full sm:w-1/2">
              {mensaje && (
                <div className={`py-3 px-4 rounded-xl text-sm font-bold text-center transition-all ${mensaje.tipo === 'exito' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                  {mensaje.texto}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="gris"
                onClick={limpiarFormulario}
                className="px-6 py-3 text-xs tracking-widest flex items-center justify-center gap-2 font-bold"
              >
                <Eraser size={16} /> LIMPIAR
              </Button>

              <Button
                variant="primario"
                type="submit"
                disabled={guardando || cargandoListas}
                className="px-10 py-3 text-xs tracking-widest flex items-center justify-center gap-2 shadow-lg font-black"
              >
                {guardando && <Loader2 size={16} className="animate-spin" />}
                {guardando ? 'PROCESANDO...' : `REGISTRAR ${activeTab === 'ingredientes' ? 'PRODUCTO' : 'UTENSILIO'}`}
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
            void buscarProductoOFF(codigoLeido);
          }}
        />
      )}
    </div>
  );
};

export default IngresoGeneral;
