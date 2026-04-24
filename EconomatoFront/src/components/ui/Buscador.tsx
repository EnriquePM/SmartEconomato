import React from 'react';
import { Search } from 'lucide-react';
import { Input } from './Input';

interface BuscadorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
}

export const Buscador: React.FC<BuscadorProps> = ({
  value,
  onChange,
  placeholder = "Buscar...",
  id = "search-input",
  className = ""
}) => {
  return (
    <div className={`relative flex-1 ${className}`}>
     <div className="absolute left-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-acento text-white rounded-full z-10">
      <Search 
        size={18} 
        strokeWidth={2.5}
      />
    </div>
      <Input
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-14"
      />
    </div>
  );
};