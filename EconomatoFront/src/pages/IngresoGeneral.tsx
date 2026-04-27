import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Globe, Loader2, Camera, Eraser, Search } from 'lucide-react';
import { ModalScanner } from '../components/ModalScanner';
import { useIngresoGeneralForm } from '../hooks/useIngresoGeneralForm';
import { AlertModal } from '../components/ui/AlertModal';

const IngresoGeneral = () => {
  const {
    activeTab,
    setActiveTab,
    form,
    setCampo,
    cargandoListas,
    buscandoOFF,
    guardando,
    mostrarScanner,
    setMostrarScanner,
    opcionesCategorias,
    opcionesProveedores,
    opcionesUnidad,
    buscarProductoOFF,
    handleSubmit,
    limpiarFormulario, alerta
  } = useIngresoGeneralForm();

  return (
    <div className="animate-fade-in-up pb-10">
      <div className="pb-6">
        <h1>Registrar Producto</h1>
        <h2>Añade nuevos elementos al inventario general</h2>
      </div>

      <div className="flex gap-2 pl-2 relative items-end mb-5">
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

      <div className="w-full bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Referencia / Código de Barras</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex gap-2">
                 <div className="relative flex-1">
                  <Search 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" 
                    size={18} 
                  />
                  
                  <Input
                    type="text"
                    id="ean"
                    placeholder="Escribe el código para buscar o escanéalo..."
                    value={form.codigo}
                    onChange={(val) => setCampo('codigo', val)}
                    className="pl-12 w-full" 
                  />
                </div>
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

    <div className="max-h-[320px] overflow-y-auto custom-scrollbar p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
        
        <div className="col-span-1">
          <Input
            type="text"
            label="Nombre"
            placeholder="Nombre del artículo"
            value={form.nombre}
            onChange={(val) => setCampo('nombre', val)}
          />
        </div>

        <div>
          <Input
            label="Stock Inicial"
            type="number"
            placeholder="0"
            value={String(form.stock)}
            onChange={(val) => setCampo('stock', val === '' ? '' : Number(val))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2 ml-1">
            {activeTab === 'ingredientes' ? 'Unidad de Medida' : 'Categoría'}
          </label>
          <Select
            options={activeTab === 'ingredientes' ? opcionesUnidad : opcionesCategorias}
            value={activeTab === 'ingredientes' ? form.unidad_medida : form.id_categoria}
            onChange={(val) => setCampo(activeTab === 'ingredientes' ? 'unidad_medida' : 'id_categoria', val)}
          />
        </div>

        <div>
          <Input
            label={activeTab === 'ingredientes' ? 'Precio x Ud (€)' : 'Coste (€)'}
            type="number"
            placeholder="0.00"
            value={String(form.precio_unidad)}
            onChange={(val) => setCampo('precio_unidad', val === '' ? '' : Number(val))}
          />
        </div>

        {activeTab === 'ingredientes' ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2 ml-1">Categoría</label>
              <Select
                options={opcionesCategorias}
                value={form.id_categoria}
                onChange={(val) => setCampo('id_categoria', val)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2 ml-1">Proveedor</label>
              <Select
                options={opcionesProveedores}
                value={form.id_proveedor}
                onChange={(val) => setCampo('id_proveedor', val)}
              />
            </div>
            <div>
              <Input
                label="Fecha de caducidad (opcional)"
                id="fecha_caducidad"
                type="date"
                placeholder=""
                value={form.fecha_caducidad || ''}
                onChange={(val) => setCampo('fecha_caducidad', val)}
              />
            </div>
          </>
        ) : (
          <div className="md:col-span-2"></div> 
        )}
      </div>
    </div>

          <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-6 border-t border-gray-100">

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="gris"
                onClick={limpiarFormulario}
              >
                <Eraser size={16} /> LIMPIAR
              </Button>

              <Button
                variant="primario"
                type="submit"
                disabled={guardando || cargandoListas}
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
     <AlertModal 
        isOpen={alerta.isOpen}
        type={alerta.type}
        title={alerta.title}
        message={alerta.message}
        onConfirm={alerta.onConfirm}
        onCancel={alerta.cerrar}
        confirmText={alerta.type === 'confirm' ? "REGISTRAR" : "ACEPTAR"}
      />
      </div>
  );
};

export default IngresoGeneral;
