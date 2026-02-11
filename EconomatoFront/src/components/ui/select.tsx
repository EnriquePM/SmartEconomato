import React from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  id?: string;
  label?: string;
  value: string | number;
  // Añadimos la posibilidad de que options sea undefined inicialmente mientras carga la API
  options?: Option[]; 
  onChange: (val: string) => void;
  className?: string;
  children?: React.ReactNode;
  placeholder?: string; // Añadimos una prop opcional para el texto inicial
}

export const Select = ({ 
  id, 
  label, 
  value, 
  options, 
  onChange, 
  className = "", 
  children,
  placeholder = "Seleccione una opción..." 
}: SelectProps) => (
  <div className="w-full text-left">
    {label && (
      <label 
        htmlFor={id} 
        className="block text-size-etiqueta text-etiqueta mb-2 ml-4 uppercase tracking-wide"
      >
        {label}
      </label>
    )}
    
    <div className="relative w-full">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full bg-input border-none rounded-pill py-3 pl-10 pr-10
          text-size-input font-semibold text-escritura
          focus:ring-2 focus:ring-gray-200 outline-none 
          transition-all appearance-none cursor-pointer
          ${className}
        `}
      >
        {/* 1. Opción por defecto para que el select no esté vacío al inicio */}
        <option value="" disabled>{placeholder}</option>

        {/* 2. Renderizado dinámico */}
        {options 
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children
        }
      </select>

      {/* Icono de flecha */}
      <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
    </div>
  </div>
);

export default Select;