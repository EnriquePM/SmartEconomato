// src/components/ui/Input.tsx
import React from 'react';

interface InputProps {
  type: 'text' | 'password' | 'email' | 'number';
  placeholder: string;
  value: string | number;
  id: string;
  label?: string;
  onChange: (val: string) => void;
  className?: string; 
}

export const Input = ({ type, placeholder, value, onChange, id, label, className = "" }: InputProps) => (
  <div className="w-full text-left">
    {label ? (
      <label 
        htmlFor={id} 
        className="block text-sm font-bold text-gray-700 mb-2"
      >
        {label}
      </label>
    ) : (
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
    )}
    
    <input
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`
        w-full bg-input border-none rounded-pill py-3 px-6 
        text-size-input font-semibold text-escritura 
        placeholder:text-relleno 
        focus:ring-2 focus:ring-gray-200 outline-none 
        transition-all 
        ${className}
      `}
    />
  </div>
);

export default Input;