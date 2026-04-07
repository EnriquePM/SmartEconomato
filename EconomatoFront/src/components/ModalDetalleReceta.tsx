import { useMemo, useState } from "react";
import { X, ChefHat, Users, ClipboardList, CheckCircle2, Circle, CircleAlert, Pencil } from "lucide-react";
import type { Receta } from "../models/Receta";
import { recetaService } from "../services/recetaService";
import { useAuth } from "../context/AuthContext";

interface ModalDetalleProps {
  receta: Receta;
  onClose: () => void;
  onEdit: (receta: Receta) => void;
  onRecetaHecha: () => void;
}

type ConsumoIngrediente = {
  id_ingrediente: number;
  nombre: string;
  unidad: string;
  necesaria: number;
  disponible: number;
};

export const ModalDetalleReceta = ({ receta, onClose, onEdit, onRecetaHecha }: ModalDetalleProps) => {
  const { hasRole } = useAuth();
  const [racionesDeseadas, setRacionesDeseadas] = useState<number>(Math.max(1, Number(receta.cantidad_platos || 1)));
  const [ingredientesCheck, setIngredientesCheck] = useState<number[]>([]);
  const [elaborando, setElaborando] = useState(false);

  const listaIngredientes = receta.receta_ingrediente || [];

  const consumos = useMemo<ConsumoIngrediente[]>(() => {
    const platosOriginales = Math.max(1, Number(receta.cantidad_platos || 1));
    const factor = racionesDeseadas / platosOriginales;

    return listaIngredientes.map((ri) => {
      const rendimiento = Number(ri.rendimiento || 100);
      const rendimientoFactor = rendimiento > 0 ? rendimiento / 100 : 1;
      const cantidadBase = Number(ri.cantidad || 0);
      const necesaria = cantidadBase * factor / rendimientoFactor;

      return {
        id_ingrediente: ri.id_ingrediente,
        nombre: ri.ingrediente?.nombre || "Ingrediente desconocido",
        unidad: ri.ingrediente?.unidad_medida || "ud",
        necesaria,
        disponible: Number(ri.ingrediente?.stock || 0)
      };
    });
  }, [listaIngredientes, receta.cantidad_platos, racionesDeseadas]);

  const faltantes = consumos.filter((item) => item.disponible < item.necesaria);
  const canMake = listaIngredientes.length > 0 && faltantes.length === 0;
  const canUseMakeAction = hasRole(["Profesor", "Jefe_Economato", "Jefe Economato", "Administrador"]);

  const formatCantidad = (value: number) => (Number.isInteger(value) ? String(value) : value.toFixed(2));

  const toggleCheck = (id: number) => {
    setIngredientesCheck((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const onChangeRaciones = (rawValue: string) => {
    if (!rawValue) {
      setRacionesDeseadas(1);
      return;
    }
    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setRacionesDeseadas(1);
      return;
    }
    setRacionesDeseadas(parsed);
  };

  const handleHacerReceta = async () => {
    if (!receta.id_receta) return;

    try {
      setElaborando(true);
      await recetaService.makeReceta(receta.id_receta, racionesDeseadas);
      alert("Receta elaborada correctamente. El inventario ya se ha descontado.");
      onRecetaHecha();
    } catch (error: any) {
      alert(error?.message || "No se pudo elaborar la receta");
    } finally {
      setElaborando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-0 md:p-4 animate-fade-in">
      <div className="bg-white w-full h-full md:h-[90vh] md:max-w-5xl md:rounded-[3rem] shadow-2xl flex flex-col overflow-hidden">
        <div className="relative h-32 bg-[#C00000] flex items-center px-8 shrink-0 rounded-t-[3rem] md:rounded-t-[3rem]">
          <div className="relative z-10 w-full flex justify-between items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {receta.nombre || "Receta sin nombre"}
              </h2>
              {/* Allergen icons in header */}
              {receta.receta_alergeno && receta.receta_alergeno.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {receta.receta_alergeno.map((ra) => {
                    const imgName = ra.alergeno.icono ? ra.alergeno.icono : `${ra.alergeno.nombre.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "")}.png`;
                    return (
                        <div key={ra.id_alergeno} className="relative group">
                          <img
                            src={`/alergenos/${imgName}`}
                            alt={ra.alergeno.nombre}
                            title={ra.alergeno.nombre}
                            className="w-8 h-8 object-contain rounded-lg bg-white/20 p-0.5"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                const spanFallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                                if (spanFallback) spanFallback.style.display = 'inline-flex';
                            }}
                          />
                          <span
                            title={ra.alergeno.nombre}
                            className="hidden items-center px-2 py-0.5 rounded-lg bg-white/20 text-white text-xs font-bold"
                          >
                            {ra.alergeno.nombre.substring(0,3).toUpperCase()}
                          </span>
                        </div>
                    );
                  })}
                </div>
              )}
            </div>
            <button onClick={onClose} className="p-3 bg-white text-[#C00000] hover:bg-gray-100 rounded-full shadow-md transition-all active:scale-95">
              <X size={28} strokeWidth={3} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row">
          <div className="w-full lg:w-5/12 p-8 bg-gray-50 border-r border-gray-100 flex flex-col">
            <div className="mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-200 shrink-0">
              <div className="flex items-center gap-3 mb-4 text-gray-400">
                <Users size={20} />
                <span className="font-bold uppercase text-xs tracking-widest">Ajustar Raciones</span>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={racionesDeseadas}
                  onChange={(e) => onChangeRaciones(e.target.value)}
                  className="w-24 bg-gray-100 px-4 py-2 rounded-xl text-4xl font-black text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xl font-bold text-gray-400">Platos</span>
              </div>
              <p className="text-xs text-gray-400 mt-3 font-medium">* Las cantidades se recalcularán automáticamente</p>
            </div>

            <h3 className="flex items-center gap-2 text-xl font-black text-gray-800 mb-6 uppercase tracking-tight">
              <ClipboardList className="text-blue-600" /> Preparación Previa
            </h3>

            <div className="space-y-3 overflow-y-auto pr-2 pb-8 lg:pb-0">
              {listaIngredientes.length === 0 ? (
                <p className="text-gray-400 text-sm font-medium italic p-4 text-center bg-gray-100 rounded-2xl">No hay ingredientes registrados.</p>
              ) : (
                consumos.map((item) => {
                  const checked = ingredientesCheck.includes(item.id_ingrediente);
                  const conStock = item.disponible >= item.necesaria;

                  return (
                    <div
                      key={item.id_ingrediente}
                      onClick={() => toggleCheck(item.id_ingrediente)}
                      className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                        checked
                          ? "bg-green-50 border-green-200 opacity-60"
                          : "bg-white border-transparent shadow-sm hover:border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {checked ? <CheckCircle2 className="text-green-500" /> : <Circle className="text-gray-300" />}
                        <div>
                          <span className={`font-bold ${checked ? "line-through text-green-700" : "text-gray-700"}`}>
                            {item.nombre}
                          </span>
                          {!conStock && (
                            <p className="text-xs font-semibold text-red-500">
                              Falta stock ({formatCantidad(item.disponible)} {item.unidad})
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-blue-600">{formatCantidad(item.necesaria)}</span>
                        <span className="ml-1 text-xs font-bold text-gray-400 uppercase">{item.unidad}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="w-full lg:w-7/12 p-8 md:p-12 bg-white flex flex-col">
            <h3 className="flex items-center gap-2 text-xl font-black text-gray-800 mb-8 uppercase tracking-tight">
              <ChefHat className="text-blue-600" /> Paso a Paso
            </h3>

            <div className="prose prose-blue max-w-none flex-1">
              <p className="text-lg md:text-xl leading-relaxed text-gray-600 font-medium whitespace-pre-line">
                {receta.descripcion || "No hay instrucciones detalladas para esta receta todavía. ¡Toca improvisar!"}
              </p>
            </div>

            {!canMake && (
              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
                <div className="flex items-center gap-2 mb-1">
                  <CircleAlert size={16} />
                  <span>No hay stock suficiente para elaborar esta receta.</span>
                </div>
                {faltantes.map((f) => (
                  <p key={f.id_ingrediente}>
                    {f.nombre}: necesitas {formatCantidad(f.necesaria)} {f.unidad} y hay {formatCantidad(f.disponible)} {f.unidad}
                  </p>
                ))}
              </div>
            )}

            {!canUseMakeAction && (
              <p className="mt-4 text-sm font-semibold text-gray-500">
                Solo Profesor y Jefe de Economato pueden hacer la receta.
              </p>
            )}

            <div className="mt-8 flex flex-wrap justify-end gap-3">
              <button
                onClick={() => onEdit(receta)}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-5 py-3 text-sm font-black text-gray-700 transition-colors hover:bg-gray-200"
              >
                <Pencil size={16} /> Editar receta
              </button>
              <button
                onClick={handleHacerReceta}
                disabled={!canMake || !canUseMakeAction || elaborando}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-black text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
              >
                {elaborando ? "ELABORANDO..." : "HACER RECETA"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};