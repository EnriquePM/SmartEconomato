import React from 'react';
import type { Receta } from '../../models/Receta';
import { Eye } from 'lucide-react';

interface RecetaCardHomeProps {
  receta: Receta;
}

export const RecetaCardHome: React.FC<RecetaCardHomeProps> = ({ receta }) => {
  return (
    <div className="bg-white/70 p-5 rounded-[2rem] border border-gray/10 group h-full flex flex-col justify-between">
      <h3 className="text-xl font-black text-primario group-hover:text-acento transition-colors leading-tight">
        {receta.nombre}
      </h3>
      <p className="text-secundario text-xs mt-2 line-clamp-3 flex-1">
        {receta.descripcion}
      </p>

      <div className="mt-2 pt-3 border-t border-gray/10 flex justify-between items-center">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          {receta.cantidad_platos} raciones
        </span>
        <div className="bg-white/70 backdrop-blur-sm p-2 rounded-full shadow-sm group-hover:bg-acento transition-colors border border-white/60">
  <Eye size={14} className="text-acento group-hover:text-white" />

</div>
      </div>
    </div>
  );
};