import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps {
  children: ReactNode; // Cambiamos text por children para admitir iconos + texto
  onClick?: () => void;
  variant?: 'primario' | 'secundario' | 'peligro' | 'gris'; //para cambiar la apariencia del botón
  disabled?: boolean;
  loading?: boolean;
  className?: string; 
}

export const Button = ({ 
  children, 
  onClick, 
  variant = 'primario', 
  disabled, 
  loading, 
  className = "" 
}: ButtonProps) => {
  
  // Mapeo de estilos según la variante
  const variants = {
    primario: "bg-primario text-white hover:opacity-90",
    secundario: "bg-red-600 text-white hover:bg-red-700 shadow-lg",
    peligro: "bg-red-500 text-white hover:bg-red-600",
    gris: "bg-gray-100 text-gray-500 hover:bg-gray-200"
  };

  return (
    <button 
      onClick={onClick}
      // Para evitar que el usuario mande muchas veces el form: El botón se bloquea si tú lo decides (disabled={true})
      // El botón se deshabilita si está en estado de carga o si se pasa la prop disabled
      disabled={disabled || loading}
      className={`
        py-4 rounded-pill font-bold transition-all active:scale-[0.98] 
        uppercase text-[10px] tracking-widest flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} 
        ${className}
      `}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : children}
    </button>
    // Si está cargando, mostramos el spinner; si no, mostramos el contenido normal del botón (texto, iconos, etc.)
  );
};