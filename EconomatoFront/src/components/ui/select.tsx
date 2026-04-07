import React from 'react';
import { ChevronDown } from 'lucide-react';

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
    <div className="relative w-full group">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full bg-white border border-gray-100 rounded-pill py-3 px-6 pr-12
          text-gray-500 text-sm font-bold tracking-tight transition-all 
          appearance-none cursor-pointer outline-none
          focus:ring-2 focus:ring-gray-200 outline-none 
          ${className}
        `}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="font-sans font-medium">
            {opt.label}
          </option>
        ))}
      </select>

      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        <ChevronDown size={18} strokeWidth={3} />
      </div>
    </div>
  );
};