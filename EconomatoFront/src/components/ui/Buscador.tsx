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
      <Search 
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 " 
        size={18} 
      />
      <Input
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-12 bg-input" 
      />
    </div>
  );
};