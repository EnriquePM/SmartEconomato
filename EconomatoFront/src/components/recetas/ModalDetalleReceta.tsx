import { useState } from "react";
import { X, ChefHat, Users, ClipboardList, CheckCircle2, Circle, CircleAlert, Pencil, FileText } from "lucide-react";
import type { Receta } from "../../models/Receta";
import { useAuth } from "../../context/AuthContext";
import { useDetalleReceta } from "../../hooks/useDetalleReceta";
import { AlertModal } from "../ui/AlertModal";

// IMPORTAMOS LOS COMPONENTES UI UNIFICADOS
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface ModalDetalleProps {
  receta: Receta;
  onClose: () => void;
  onEdit: (receta: Receta) => void;
  onRecetaHecha: () => void;
}

export const ModalDetalleReceta = ({ receta, onClose, onEdit, onRecetaHecha }: ModalDetalleProps) => {
  const { hasRole } = useAuth();
  const [ingredientesCheck, setIngredientesCheck] = useState<number[]>([]);
  const {
    racionesDeseadas,
    onChangeRaciones,
    elaborando,
    consumos,
    faltantes,
    canMake,
    alerta,
  } = useDetalleReceta(receta);

  const listaIngredientes = receta.receta_ingrediente || [];
  const canUseMakeAction = hasRole(["Profesor", "Jefe_Economato", "Jefe Economato", "Administrador"]);

  const formatCantidad = (value: number) => (Number.isInteger(value) ? String(value) : value.toFixed(2));

  const toggleCheck = (id: number) => {
    setIngredientesCheck((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleConfirmarHacer = () => {
    alerta.ejecutar(onRecetaHecha);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-6xl shadow-2xl flex flex-col h-[90vh] overflow-hidden animate-fade-in-up border border-gray-100">
        
        {/* HEADER UNIFICADO */}
        <div className="flex justify-between items-start md:items-center px-8 py-5 border-b border-gray-100 bg-white shrink-0">
          <div className="flex items-center p-2.5 gap-4">
            <div className="bg-acento p-3 rounded-xl text-white shadow-lg shrink-0">
              <ChefHat size={28} color="#ffffff" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight leading-none mb-1">
                {receta.nombre || "Receta sin nombre"}
              </h2>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Detalle de receta</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all shrink-0">
            <X size={22} />
          </button>
        </div>

        {/* CONTENIDO CENTRAL - overflow-hidden para quitar scroll general */}
        <div className="flex-1 overflow-hidden bg-white flex flex-col">
          
          {/* SECCIÓN DE ALÉRGENOS: Diseño en Rojo de Marca */}
          {receta.receta_alergeno && receta.receta_alergeno.length > 0 && (
            <div className="px-8 pt-6 pb-2 shrink-0">
              <div className="flex flex-wrap items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-[1.5rem]">
                <div className="flex items-center gap-2 mr-2 border-r border-red-200 pr-4">
                   <CircleAlert size={14} className="text-red-600" />
                   <span className="text-[10px] font-black text-red-700 uppercase tracking-widest">Alérgenos críticos:</span>
                </div>
                {receta.receta_alergeno.map((ra) => {
                  const imgName = ra.alergeno.icono ? ra.alergeno.icono : `${ra.alergeno.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}.png`;
                  return (
                    <div key={ra.id_alergeno} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-red-200 rounded-xl shadow-sm hover:border-red-400 transition-colors">
                      <img
                        src={`/alergenos/${imgName}`}
                        alt={ra.alergeno.nombre}
                        className="w-5 h-5 object-contain grayscale-[0.2] contrast-125"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <span className="text-[10px] font-black text-red-800 uppercase tracking-widest">
                        {ra.alergeno.nombre}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CONTENEDOR DE COLUMNAS - flex-1 y h-full para forzar scroll interno */}
          <div className="p-8 pt-4 flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
            
            {/* COLUMNA IZQUIERDA: Raciones + Ingredientes */}
            <div className="w-full lg:w-5/12 flex flex-col gap-6 h-full min-h-0">
              
              {/* Ajuste de Raciones (Shrink-0 para que no se encoja) */}
              <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100/50 shrink-0">
                <div className="flex items-center gap-2 mb-4 px-2">
                  <Users size={14} className="text-gray-400" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ajustar Raciones</span>
                </div>
                <div className="flex items-center gap-4 px-2">
                  <div className="w-24">
                    <Input
                      type="number"
                      placeholder=""
                      min={1}
                      value={racionesDeseadas.toString()}
                      onChange={(val) => onChangeRaciones(val)}
                      className="text-center text-xl font-black !py-3"
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Platos</span>
                </div>
              </div>

              {/* Lista de Ingredientes con SCROLL PROPIO */}
              <div className="flex-1 bg-gray-50 rounded-[2rem] p-6 flex flex-col border border-gray-100/50 overflow-hidden min-h-0">
                <div className="flex items-center gap-2 mb-4 px-2 shrink-0">
                  <ClipboardList size={14} className="text-gray-400" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Preparación Previa</span>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-global">
                  {listaIngredientes.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em]">Sin ingredientes</p>
                    </div>
                  ) : (
                    consumos.map((item) => {
                      const checked = ingredientesCheck.includes(item.id_ingrediente);
                      const conStock = item.disponible >= item.necesaria;
                      return (
                        <div
                          key={item.id_ingrediente}
                          onClick={() => toggleCheck(item.id_ingrediente)}
                          className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all shrink-0 border-2 ${
                            checked ? "bg-green-50 border-green-200 opacity-60" : "bg-white border-transparent shadow-sm hover:border-gray-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {checked ? <CheckCircle2 size={20} className="text-green-500 shrink-0" /> : <Circle size={20} className="text-gray-300 shrink-0" />}
                            <div>
                              <span className={`text-sm block ${checked ? "line-through text-green-700 font-bold" : "text-gray-800 font-black"}`}>
                                {item.nombre}
                              </span>
                              {!conStock && (
                                <span className="text-[9px] font-bold text-red-500 uppercase tracking-tighter mt-1 block">
                                  Faltan {(item.necesaria - item.disponible).toFixed(2)} {item.unidad}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-lg font-black text-gray-900 leading-none block">{formatCantidad(item.necesaria)}</span>
                            <span className="text-[9px] font-bold text-gray-400 uppercase">{item.unidad}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA: Paso a Paso con SCROLL PROPIO */}
            <div className="w-full lg:w-7/12 bg-gray-50 rounded-[2rem] p-6 md:p-8 flex flex-col border border-gray-100/50 h-full overflow-hidden min-h-0">
              <div className="flex items-center gap-2 mb-6 px-2 shrink-0">
                <FileText size={14} className="text-gray-400" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Paso a Paso</span>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-4 scrollbar-global">
                <p className="text-sm md:text-base leading-relaxed text-gray-700 font-medium whitespace-pre-line">
                  {receta.descripcion || "No hay instrucciones detalladas todavía."}
                </p>
              </div>

              {/* Notificaciones de error (Shrink-0 para que siempre se vean abajo) */}
              <div className="shrink-0 mt-6 space-y-3">
                {!canMake && (
                  <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
                    <div className="flex items-center gap-2 mb-3 text-acento">
                      <CircleAlert size={18} />
                      <span className="text-xs font-black uppercase tracking-widest">Stock Insuficiente</span>
                    </div>
                    <div className="space-y-1">
                      {faltantes.map((f) => (
                        <p key={f.id_ingrediente} className="text-xs text-acento/70">
                          <span className=" text-acento font-bold ">• {f.nombre}:</span> Requieres {formatCantidad(f.necesaria)} y tienes {formatCantidad(f.disponible)} {f.unidad}.
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                {!canUseMakeAction && (
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">
                    Solo Profesor y Jefe de Economato pueden elaborar recetas.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 border-t border-gray-100 bg-white flex justify-end gap-3 shrink-0">
          <Button variant="gris" onClick={() => onEdit(receta)} className="px-8 font-bold flex items-center gap-2">
            <Pencil size={16} /> EDITAR RECETA
          </Button>
          <Button 
            variant="primario" 
            onClick={alerta.solicitar} 
            disabled={!canMake || !canUseMakeAction || elaborando}
          >
            <ChefHat size={18} />
            {elaborando ? "ELABORANDO..." : "HACER RECETA"}
          </Button>
        </div>
      </div>

      <AlertModal 
        isOpen={alerta.isOpen}
        type={alerta.type}
        title={alerta.title}
        message={alerta.message}
        onConfirm={alerta.type === 'confirm' ? handleConfirmarHacer : alerta.cerrar}
        onCancel={alerta.cerrar}
        confirmText={alerta.type === 'confirm' ? "CONFIRMAR" : "ACEPTAR"}
      />
    </div>
  );
};