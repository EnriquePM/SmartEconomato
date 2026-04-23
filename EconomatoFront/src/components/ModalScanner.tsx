import { useEffect } from "react";
// 👇 Importamos los formatos para hacerla súper precisa
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { X, ScanLine } from "lucide-react";

interface ModalScannerProps {
  onScan: (codigo: string) => void;
  onClose: () => void;
}

export const ModalScanner = ({ onScan, onClose }: ModalScannerProps) => {
  
  useEffect(() => {
    let isMounted = true;
    let html5QrCode: Html5Qrcode;

    const temporizador = setTimeout(() => {
      if (!isMounted) return;

      // 1. FORZAMOS a la cámara a buscar SOLO códigos de supermercado
      html5QrCode = new Html5Qrcode("reader", {
        verbose: false,
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E
        ]
      });

      html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 15, // 2. Aumentamos la velocidad de procesado
        },
        (decodedText) => {
          if (isMounted) {
            // 3. Pausamos la cámara al instante para que no lea 2 veces el mismo código
            if (html5QrCode.getState() === 2) { // 2 = SCANNING
               html5QrCode.pause(true);
            }
            onScan(decodedText);
          }
        },
        (_errorMessage) => {
          // Silenciamos los errores de enfoque
        }
      ).catch((err) => {
        console.error("No se pudo iniciar la cámara", err);
      });
    }, 50);

    return () => {
      isMounted = false;
      clearTimeout(temporizador);
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().then(() => html5QrCode.clear()).catch(console.error);
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        
        {/* CABECERA */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <ScanLine className="text-blue-600" size={20} />
            <h3 className="font-black text-gray-800">Escáner Activo</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* CÁMARA */}
        <div className="p-4 bg-black w-full flex justify-center items-center min-h-[300px] relative">
          <div id="reader" className="w-full rounded-xl overflow-hidden shadow-inner"></div>
          
          {/* Guía visual */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-[80%] h-[40%] border-2 border-red-500/50 rounded-xl relative">
              <div className="w-full h-0.5 bg-red-500 absolute top-1/2 -translate-y-1/2 animate-pulse shadow-[0_0_8px_red]"></div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-5 text-center bg-white space-y-2">
          <p className="text-sm font-bold text-gray-800">
            Alinea el código de barras con la línea roja
          </p>
          <p className="text-xs text-gray-500">
            Si estás en PC, aleja el producto un palmo para que no se vea borroso.
          </p>
        </div>

      </div>
    </div>
  );
};