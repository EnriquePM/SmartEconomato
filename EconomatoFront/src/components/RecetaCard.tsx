import { Printer, Eye } from "lucide-react";
import type { Receta } from "../models/Receta";
import { useNavigate } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { RecetaPDF } from "../pages/RecetaPDF";

const RecetaCard = ({ receta }: { receta: Receta }) => {
  const ingredientes_count = receta.receta_ingrediente?.length ?? 0;
  const navigate = useNavigate();

  return (
    <div className="bg-white/70 backdrop-blur-md p-3 px-5 rounded-pill border border-red-200/60 hover:bg-white/90 transition-all duration-300 cursor-pointer group flex flex-col">

      <div className="flex md:hidden items-center justify-between w-full">
        <h3 className="text-sm font-black text-gray-800 tracking-tight leading-none">
          {receta.nombre}
        </h3>
        <div
          onClick={() => navigate('/recetas')}
          className="bg-white/70 backdrop-blur-sm p-2 rounded-xl text-acento shadow-sm border border-white/80"
        >
          <Eye size={16} strokeWidth={3} />
        </div>
      </div>

      <div className="hidden md:flex flex-col h-full">

        <div className="flex justify-between items-center mb-3 shrink-0">
          <span className="text-[9px] font-black bg-white/70 backdrop-blur-sm text-acento px-3 py-1 rounded-full uppercase tracking-tighter border border-white/80 shadow-sm">
            {ingredientes_count} Ingredientes
          </span>
          <div className="bg-white/70 backdrop-blur-sm p-2 rounded-xl text-acento shadow-sm border border-white/80">
            <Eye size={16} strokeWidth={3} />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-black text-gray-800 group-hover:text-acento transition-colors leading-tight tracking-tight">
            {receta.nombre}
          </h3>
          <p className="text-gray-400 text-xs mt-1.5 line-clamp-2 font-medium leading-relaxed italic">
            {receta.descripcion}
          </p>
        </div>

        <div className="pt-3 flex justify-between items-center shrink-0">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-gray-300 uppercase italic">Raciones</span>
            <span className="text-sm font-black text-gray-700">{receta.cantidad_platos} pax</span>
          </div>

          <div className="flex items-center gap-2 group/btn">
            <span className="text-acento font-black text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
              Imprimir
            </span>
            <PDFDownloadLink
              document={<RecetaPDF receta={receta} />}
              fileName={`Receta_${receta.nombre}.pdf`}
              style={{ textDecoration: 'none' }}
              onClick={(e) => e.stopPropagation()}
            >
              {() => (
                <div className="bg-white/70 backdrop-blur-sm p-2.5 rounded-lg shadow-sm border border-white/60">
                  <Printer size={14} className="text-acento" strokeWidth={3} />
                </div>
              )}
            </PDFDownloadLink>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RecetaCard;