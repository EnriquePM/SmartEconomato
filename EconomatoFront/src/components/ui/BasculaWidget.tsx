import { useBascula } from '../../hooks/useBascula';
import { Scale } from 'lucide-react';

export const BasculaWidget = () => {
    const { peso, conectado } = useBascula();

    return (
        <div className="relative bg-white border border-gray-200 shadow-sm rounded-xl p-4 w-full md:w-[220px] z-10 flex flex-col gap-2 transition-all">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2 text-gray-700 font-bold">
                    <Scale size={18} className="text-blue-500" />
                    <span>Báscula</span>
                </div>
                {conectado ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" title="Servidor conectado"></div>
                ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" title="Servidor desconectado"></div>
                )}
            </div>
            
            <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-black text-gray-900 tracking-tight">
                    {peso !== null ? peso : '0.00'}
                </span>
                <span className="text-sm font-bold text-gray-400">kg</span>
            </div>
        </div>
    );
};
