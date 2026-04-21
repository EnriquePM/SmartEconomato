import React from 'react';
import { Pencil, Printer } from 'lucide-react';
import type { Receta } from '../../models/Receta';
import { RecetaPDF } from '../pdf/RecetaPDF';
import { PDFDownloadLink } from '@react-pdf/renderer';

interface RecetaCardProps {
  receta: Receta; 
  onClick: (receta: Receta) => void;
  onEdit: (receta: Receta) => void;
}

export const RecetaCard: React.FC<RecetaCardProps> = ({ receta, onClick, onEdit }) => {
  return (
    <div 
      onClick={() => onClick(receta)}
      className="bg-gray-100 p-6 rounded-[2.5rem] border border-gray-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
    >
      <div className="flex mb-2 justify-end"> 
  <button
    onClick={(e) => {
      e.stopPropagation();
      onEdit(receta);
    }}
    className="group/edit inline-flex items-center gap-0 hover:gap-2 rounded-full bg-gray-100 px-2 py-2 transition-all duration-300 hover:bg-gray-200 hover:px-3 text-gray-600"
  >
 
    <Pencil size={14} className="shrink-0" />


    <span className="max-w-0 overflow-hidden opacity-0 group-hover/edit:max-w-[50px] group-hover/edit:opacity-100 transition-all duration-300 text-xs font-bold whitespace-nowrap">
      Editar
    </span>
  </button>
</div>

      <h3 className="text-2xl font-black text-primario group-hover:text-white/90 transition-colors">
        {receta.nombre}
      </h3>
      
      <p className="text-secundario text-sm mt-2 mr-5 line-clamp-3">
        {receta.descripcion}
      </p>

      {/* Tira de Alérgenos */}
      {receta.receta_alergeno && receta.receta_alergeno.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {receta.receta_alergeno.map((ra) => (
            ra.alergeno.icono ? (
              <img
                key={ra.id_alergeno}
                src={ra.alergeno.icono}
                alt={ra.alergeno.nombre}
                title={ra.alergeno.nombre}
                className="w-7 h-7 object-contain rounded-md bg-amber-50 p-0.5 border border-amber-100"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <span
                key={ra.id_alergeno}
                title={ra.alergeno.nombre}
                className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold"
              >
                {ra.alergeno.nombre}
              </span>
            )
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-300 flex justify-between items-center">
        <span className="text-xs font-bold text-secundario">
          Raciones: {receta.cantidad_platos}
        </span>
        <div onClick={(e) => e.stopPropagation()}>
          <PDFDownloadLink
            document={<RecetaPDF receta={receta} />}
            fileName={`Receta_${receta.nombre.replace(/\s+/g, '_')}.pdf`}
            style={{ textDecoration: 'none' }}
          >
            {({ loading }) => (
              <div className="flex items-center gap-0 hover:gap-2 group/print cursor-pointer bg-white hover:bg-white px-2 py-2 rounded-full transition-all duration-300">
                <span className={`
                  text-acento font-bold text-xs whitespace-nowrap
                  max-w-0 opacity-0 overflow-hidden
                  group-hover/print:max-w-[100px] group-hover/print:opacity-100 
                  transition-all duration-300
                `}>
                  {loading ? 'Generando...' : 'Imprimir'}
                </span>
                <div className="text-acento shrink-0">
                  <Printer 
                    size={20} 
                    className={loading ? "animate-pulse" : ""} 
                  />
                </div>
              </div>
            )}
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
};