import { useState } from "react";
import { X, Search, Trash2, ChefHat, ShoppingCart, Plus, FileText, AlertTriangle, Loader2 } from "lucide-react";
import { useRecetaForm } from "../../hooks/useRecetasForm";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input"; 
import type { Receta } from "../../models/Receta";

interface ModalRecetaProps {
  onClose: () => void;
  onRecetaCreada: () => void; 
  recetaInicial?: Receta | null;
}

export const ModalReceta = ({ onClose, onRecetaCreada, recetaInicial = null }: ModalRecetaProps) => {
  const { form, lista, buscador, alergenos, acciones } = useRecetaForm({ onSuccess: onRecetaCreada, recetaInicial });
  
  const [eliminando, setEliminando] = useState(false);
  const [errorUI, setErrorUI] = useState<string | null>(null);
  
  // 👇 Estado para mostrar/ocultar nuestro nuevo Pop-up de confirmación
  const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState(false);

  // 1. Botón inicial: Solo abre el pop-up
  const intentarEliminar = () => {
    setMostrarConfirmacionEliminar(true);
  };

  // 2. Botón del pop-up: Ejecuta el borrado real
  const confirmarEliminacion = async () => {
    if (!recetaInicial?.id_receta) return;
    
    try {
      setEliminando(true);
      await acciones.handleEliminar();
    } catch (error) {
      console.error("Error al eliminar:", error);
      // Si falla, mostramos el error en nuestra UI y cerramos el pop-up
      setErrorUI("No se pudo eliminar. Puede que tenga pedidos asociados.");
      setMostrarConfirmacionEliminar(false);
    } finally {
      setEliminando(false);
    }
  };

  const handleGuardarLocal = () => {
    if (!form.nombre || form.nombre.trim() === "") {
      setErrorUI("Rellena los campos obligatorios.");
      return; 
    }

    if (lista.ingredientes.length === 0) {
      setErrorUI("Añade al menos un ingrediente.");
      return;
    }

    const tieneCantidadesInvalidas = lista.ingredientes.some(
      (ing: any) => !ing.cantidad || Number(ing.cantidad) <= 0
    );

    if (tieneCantidadesInvalidas) {
      setErrorUI("Todas las cantidades deben ser mayores que 0.");
      return;
    }
    
    setErrorUI(null);
    acciones.handleGuardar(); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-6xl shadow-2xl flex flex-col h-[90vh] overflow-hidden animate-fade-in-up border border-gray-100">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-white shrink-0">
          <div className="flex items-center p-2.5 gap-3">
            <div className="bg-acento p-2.5 rounded-xl text-white shadow-lg">
              <ChefHat size={25} color="#ffffff" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight leading-none">
                {recetaInicial ? "Editando Receta" : "Nueva Receta"}
              </h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                {recetaInicial ? acciones.titulo : "Ingredientes y Procesos"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all">
            <X size={22} />
          </button>
        </div>

        {/* CONTENIDO CENTRAL */}
        <div className="flex-1 p-8 overflow-y-auto flex flex-col gap-6 bg-white scrollbar-global">
          
          {/* SECCIÓN CONFIGURACIÓN: Nombre y Raciones */}
          <div className="grid grid-cols-12 gap-6 shrink-0 items-end px-2">
            <div className="col-span-8">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nombre de la Receta</label>
              <Input
                type="text" 
                placeholder="Ej. Tarta de Manzana"
                value={form.nombre}
                onChange={(val) => {
                    form.setNombre(val);
                    if (errorUI) setErrorUI(null);
                }}
              />
            </div>
            <div className="col-span-4">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Raciones</label>
              <Input 
                type="number"
                placeholder="0"
                value={form.raciones}
                onChange={(val) => form.setRaciones(val)}
                min={1}
              />
            </div>
          </div>

          {/* SECCIÓN ALÉRGENOS */}
          <div className="shrink-0 px-2 mt-1">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Alérgenos</label>
            {alergenos.lista.length === 0 ? (
              <p className="text-gray-400 text-sm italic">No hay alérgenos registrados en el sistema.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {alergenos.lista.map((al) => {
                  const seleccionado = alergenos.seleccionados.includes(al.id_alergeno);
                  return (
                    <button
                      type="button"
                      key={al.id_alergeno}
                      onClick={() => alergenos.toggle(al.id_alergeno)}
                      title={al.nombre}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-sm font-bold transition-all duration-150
                        ${seleccionado
                          ? 'bg-amber-50 border-amber-400 text-amber-800 shadow-md scale-105'
                          : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {al.icono ? (
                        <img src={al.icono} alt={al.nombre} className="w-6 h-6 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-black">A</span>
                      )}
                      <span>{al.nombre}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* COLUMNAS INFERIORES: Buscador + Ingredientes / Pasos de elaboración */}
          <div className="shrink-0 flex gap-6 px-2 mt-2 min-h-[450px]">
            
            {/* MITAD IZQUIERDA: Ingredientes */}
            <div className="w-1/2 flex flex-col gap-4">
              
              {/* BUSCADOR */}
              <div className="shrink-0">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 z-10" size={18} />
                    <Input 
                      type="text"
                      placeholder={buscador.cargando ? "Cargando almacén..." : "Buscar ingrediente..."} 
                      value={buscador.busqueda}
                      onChange={(val) => buscador.setBusqueda(val)}
                      disabled={buscador.cargando}
                      className="pl-12 !bg-gray-50/50" 
                    />
                  </div>

                  {/* SUGERENCIAS DEL BUSCADOR */}
                  {buscador.busqueda.length > 1 && buscador.sugerencias.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                      {buscador.sugerencias.map((ing: any) => (
                        <button
                          key={ing.id_ingrediente}
                          className="w-full flex justify-between items-center px-6 py-4 hover:bg-gray-50 text-left border-b border-gray-50 last:border-none transition-colors"
                          onClick={() => {
                            lista.agregarIngrediente(ing);
                            buscador.setBusqueda("");
                            if (errorUI) setErrorUI(null);
                          }}
                        >
                          <span className="font-bold text-gray-700 text-sm">{ing.nombre}</span>
                          <Plus size={16} className="text-gray-900" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* LISTA DE SELECCIONADOS */}
              <div className="flex-1 bg-gray-50 rounded-[2rem] p-6 overflow-hidden flex flex-col border border-gray-100/50">
                <div className="flex items-center gap-2 mb-4 px-2 shrink-0">
                  <ShoppingCart size={14} className="text-gray-400" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ingredientes añadidos ({lista.ingredientes.length})</span>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-global">
                  {lista.ingredientes.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em]">Sin ingredientes</p>
                    </div>
                  ) : (
                    lista.ingredientes.map((ing: any) => (
                      <div key={ing.id_ingrediente} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm shrink-0">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-gray-800 truncate leading-none">{ing.nombre}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase mt-1.5 tracking-tighter">Medida: {ing.unidad_medida}</p>
                        </div>
                        <div className="w-24">
                          <Input 
                            type="text"
                            placeholder="0.00"
                            value={ing.cantidad}
                            onChange={(val) => {
                              const saneado = val.replace(',', '.');
                              if (/^\d*\.?\d*$/.test(saneado)) {
                                lista.actualizarIngrediente(ing.id_ingrediente, 'cantidad', saneado);
                                if (errorUI) setErrorUI(null); 
                              }
                            }}
                            className="text-center !py-2 !rounded-xl !bg-gray-50/50 border border-gray-100"
                          />
                        </div>
                        <button onClick={() => lista.eliminarIngrediente(ing.id_ingrediente)} className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* MITAD DERECHA: Pasos de Elaboración */}
            <div className="w-1/2 bg-gray-50 rounded-[2rem] p-6 flex flex-col border border-gray-100/50">
              <div className="flex items-center gap-2 mb-4 px-2 shrink-0">
                <FileText size={14} className="text-gray-400" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pasos de Elaboración</span>
              </div>
              
              <div className="flex-1 relative">
                <textarea 
                  placeholder="1. Precalentar el horno a 180°C...&#10;2. Batir los huevos con el azúcar..."
                  value={form.descripcion}
                  onChange={(e) => form.setDescripcion(e.target.value)}
                  className="w-full h-full bg-white border border-gray-100 rounded-3xl p-6 text-sm font-semibold text-gray-800 placeholder:text-gray-300 focus:ring-2 focus:ring-gray-200 outline-none transition-all resize-none shadow-sm leading-relaxed"
                />
                <div className="absolute bottom-6 right-8 text-[10px] font-black text-gray-300 uppercase tracking-widest pointer-events-none">
                  Modo Redacción
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 border-t border-gray-100 bg-white flex justify-between items-center gap-3 shrink-0">
          
          {/* LADO IZQUIERDO: Botón de Borrar (ahora llama a intentarEliminar) */}
          <div>
            {recetaInicial && (
              <button
                type="button"
                onClick={intentarEliminar}
                disabled={eliminando || acciones.guardando}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
              >
                <Trash2 size={18} />
                {eliminando ? "ELIMINANDO..." : "ELIMINAR RECETA"}
              </button>
            )}
          </div>

          {/* LADO DERECHO: Mensaje de error, Descartar y Guardar */}
          <div className="flex items-center gap-4">
            {errorUI && (
              <span className="text-sm font-bold text-red-600 animate-pulse bg-red-50 px-4 py-2 rounded-xl border border-red-100">
                {errorUI}
              </span>
            )}
            
            <Button variant="gris" onClick={onClose} className="px-8 font-bold">
              DESCARTAR
            </Button>
            <Button 
              variant="primario" 
              onClick={handleGuardarLocal} 
              className="px-12 font-black uppercase tracking-widest shadow-lg"
              disabled={acciones.guardando || eliminando}
            >
              {acciones.guardando ? "GUARDANDO..." : (recetaInicial ? "GUARDAR CAMBIOS" : "GUARDAR RECETA")}
            </Button>
          </div>
        </div>
      </div>

      {/* 👇 NUEVO POP-UP DE CONFIRMACIÓN DE ELIMINACIÓN */}
      {mostrarConfirmacionEliminar && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-fade-in-up border border-gray-100 p-8 flex flex-col items-center text-center">
            
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-5 shadow-inner">
              <AlertTriangle size={32} strokeWidth={2.5} />
            </div>
            
            <h3 className="text-xl font-black text-gray-900 mb-2">¿Eliminar Receta?</h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              ¿Estás seguro de que quieres eliminar <span className="font-bold text-gray-800">"{recetaInicial?.nombre}"</span>? Esta acción no se puede deshacer.
            </p>
            
            <div className="flex gap-3 w-full">
              <Button 
                variant="gris" 
                onClick={() => setMostrarConfirmacionEliminar(false)} 
                className="flex-1 py-3 font-bold" 
                disabled={eliminando}
              >
                CANCELAR
              </Button>
              <Button 
                variant="primario" 
                onClick={confirmarEliminacion} 
                className="flex-1 py-3 font-bold !bg-red-600 hover:!bg-red-700 shadow-md shadow-red-200" 
                disabled={eliminando}
              >
                {eliminando ? <Loader2 size={18} className="animate-spin mx-auto" /> : "SÍ, ELIMINAR"}
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};