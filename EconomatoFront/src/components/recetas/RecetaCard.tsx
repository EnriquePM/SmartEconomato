import React from 'react';
import { Pencil, Printer, Soup} from 'lucide-react'; // Importamos Utensils
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
      className="relative group overflow-hidden bg-white rounded-[2rem] shadow-md border border-gray-100 hover:shadow-xl transition-all duration-500 cursor-pointer min-h-[160px] h-full flex flex-col">
    
      <div className="absolute bottom-[-60px] right-[-40px] text-acento/10   group-hover:scale-105 transition-all duration-700 pointer-events-none">
        <Soup
          size={180} 
          strokeWidth={1} 
        />
      </div>
      <div className="p-5 flex flex-col h-full relative z-10">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">
            Receta
          </span>
          
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(receta); }}
            className="p-2 rounded-full bg-gray-50 text-gray-400 hover:bg-acento hover:text-white transition-all shadow-sm border border-gray-100"
          >
            <Pencil size={11} />
          </button>
        </div>

        <div className="flex-1 mt-1">
          <h3 className="text-lg font-extrabold text-gray-800 leading-tight line-clamp-2 group-hover:text-acento transition-colors">
            {receta.nombre}
          </h3>
          <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-snug font-medium">
            {receta.descripcion || "Detalles de la receta..."}
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-acento/40 group-hover:bg-acento transition-colors" />
            <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-600 transition-colors">
              {receta.cantidad_platos} pers.
            </span>
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            <PDFDownloadLink
              document={<RecetaPDF receta={receta} />}
              fileName={`Receta_${receta.nombre.replace(/\s+/g, '_')}.pdf`}
              style={{ textDecoration: 'none' }}
            >
              {({ loading }) => (
                <div className="flex items-center gap-1 text-acento font-bold text-[10px] uppercase tracking-wider bg-acento/5 px-2 py-1 rounded-lg hover:bg-acento/10 transition-all border border-acento/10">
                  <Printer size={12} className={loading ? "animate-pulse" : ""} />
                  {loading ? '...' : 'PDF'}
                </div>
              )}
            </PDFDownloadLink>
          </div>
        </div>
      </div>
    </div>
  );
};