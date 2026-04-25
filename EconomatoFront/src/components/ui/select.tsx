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
    <div className={`relative flex-1 group ${className}`}>
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full bg-input border border-gray-300
    focus:border-acento focus:bg-white rounded-pill py-3 px-6 pr-12 font-semibold text-gray-500 text-sm outline-none transition-all appearance-none cursor-pointer"
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>

  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 transition-colors duration-200 group-focus-within:text-acento">
    <ChevronDown size={20} />
  </div>
</div>
  );
};