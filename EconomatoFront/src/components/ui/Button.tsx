import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primario' | 'secundario' | 'peligro' | 'gris';
  disabled?: boolean;
  loading?: boolean;
  className?: string; 
  type?: "button" | "submit" | "reset";
}

export const Button = ({ 
  children, 
  onClick, 
  variant = 'primario', 
  disabled, 
  loading, 
  className = "",
  type = "button"
}: ButtonProps) => {
  
  const variants = {
    // Cambiamos opacity-90 por un color sólido más oscuro para un hover profesional
   primario: `
  bg-acento text-white 
  hover:bg-[#F13838] 
  hover:brightness-110 
  shadow-sm hover:shadow-md
`,
    
    // Un secundario más limpio: Rojo suave que se vuelve sólido
    secundario: "bg-acento/10 text-acento hover:bg-acento hover:text-white",
    
    peligro: "bg-red-500 text-white hover:bg-red-600",
    gris: "bg-gray-100 text-gray-500 hover:bg-gray-200"
  };

  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        /* Mantenemos tus py-4 y rounded-pill originales */
        py-4 px-8 rounded-pill flex items-center justify-center gap-3
        
        /* Ajuste de letra: Subimos a 12px, negrita real y quitamos el uppercase agresivo */
        /* Si quieres mantener uppercase, usa text-[11px] para que no sea tan diminuta */
        font-bold text-[12px] uppercase tracking-[0.1em]
        
        /* Animación suave estilo Apple/Google */
        transition-all duration-300 active:scale-[0.96]
        
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} 
        ${className}
      `}
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : children}
    </button>
  );
};