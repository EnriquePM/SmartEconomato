import { useBascula } from '../../hooks/useBascula';
import { Scale } from 'lucide-react';
import { Button } from './Button';

type BasculaWidgetProps = {
    onCapturarPeso?: (peso: string) => void;
};

export const BasculaWidget = ({ onCapturarPeso }: BasculaWidgetProps) => {
    const { peso, conectado, error, soportado, conectar, desconectar } = useBascula();

    const puedeCapturar = conectado && peso !== null && peso.trim() !== '';

    return (
        <div className="relative bg-white border border-gray-200 shadow-sm rounded-xl p-4 w-full md:w-[280px] z-10 flex flex-col gap-3 transition-all">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2 text-gray-700 font-bold">
                    <Scale size={18} className="text-blue-500" />
                    <span>Báscula</span>
                </div>
                {conectado ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" title="Puerto serie conectado"></div>
                ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" title="Puerto serie desconectado"></div>
                )}
            </div>
            
            <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-black text-gray-900 tracking-tight">
                    {peso !== null ? peso : '0.00'}
                </span>
                <span className="text-sm font-bold text-gray-400">kg</span>
            </div>

            {!soportado && (
                <p className="text-xs font-semibold text-red-600">
                    Este navegador no soporta Web Serial. Usa Chrome o Edge.
                </p>
            )}

            {error && (
                <p className="text-xs font-semibold text-red-600">{error}</p>
            )}

            <div className="flex gap-2 mt-1">
                {!conectado ? (
                    <Button
                        variant="secundario"
                        className="!rounded-full w-full"
                        onClick={() => void conectar(9600)}
                    >
                        Conectar puerto serie
                    </Button>
                ) : (
                    <Button
                        variant="gris"
                        className="!rounded-full w-full"
                        onClick={() => void desconectar()}
                    >
                        Desconectar
                    </Button>
                )}
            </div>

            <Button
                variant="secundario"
                className="!rounded-full w-full"
                disabled={!puedeCapturar}
                onClick={() => {
                    if (!puedeCapturar || !peso || !onCapturarPeso) {
                        return;
                    }
                    onCapturarPeso(peso);
                }}
            >
                Capturar peso en cantidad recibida
            </Button>
        </div>
    );
};
