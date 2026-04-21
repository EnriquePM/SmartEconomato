import React from 'react';
import { ChevronDown } from 'lucide-react'; // Importamos el icono

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  id?: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({ id, value, options, onChange, className = '' }) => {
  return (
    <div className="relative w-full">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-input border-none rounded-pill py-3 px-6 pr-12 text-gray-700 focus:ring-2 focus:ring-slate-200 outline-none transition-all appearance-none cursor-pointer ${className}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        <ChevronDown size={20} />
      </div>
    </div>
  );
};