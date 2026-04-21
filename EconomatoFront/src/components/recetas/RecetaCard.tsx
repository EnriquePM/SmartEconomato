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
      className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
    >
      <div className="flex justify-between mb-4">
        <span className="text-[10px] font-black bg-acento/10 text-acento px-3 py-1 rounded-full uppercase">
          {receta.receta_ingrediente?.length || 0} Ingredientes
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation(); 
            onEdit(receta);
          }}
          className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-200"
        >
          <Pencil size={12} /> Editar
        </button>
      </div>

      <h3 className="text-2xl font-black text-gray-800 group-hover:text-acento transition-colors">
        {receta.nombre}
      </h3>
      
      <p className="text-gray-400 text-sm mt-2 mr-5 line-clamp-4">
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

      <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
        <span className="text-xs font-bold text-gray-400">
          Raciones: {receta.cantidad_platos}
        </span>
        <div onClick={(e) => e.stopPropagation()}>
          <PDFDownloadLink
            document={<RecetaPDF receta={receta} />}
            fileName={`Receta_${receta.nombre.replace(/\s+/g, '_')}.pdf`}
            style={{ textDecoration: 'none' }}
          >
            {({ loading }) => (
              <div className="flex items-center gap-2 group/print cursor-pointer">
                <p className="text-acento font-bold text-xs opacity-0 group-hover/print:opacity-100 transition-opacity duration-300 uppercase">
                  {loading ? 'Generando...' : 'Imprimir'}
                </p>
                <div className="text-acento">
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