import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primario' | 'secundario' | 'gris';
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

   primario: `
  bg-acento text-white 
  hover:bg-[#F13838] 
  hover:brightness-110 
  shadow-sm hover:shadow-md
`,
    
    secundario: "bg-acento/10 text-acento hover:bg-acento hover:text-white",

    gris: "bg-gray-100 text-gray-500 hover:bg-gray-200"
  };

  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        py-4 px-8 rounded-pill flex items-center justify-center gap-3
        font-bold text-[12px] uppercase tracking-[0.1em]
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