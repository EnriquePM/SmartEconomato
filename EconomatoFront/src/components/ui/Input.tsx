import React from 'react';

interface InputProps {
  type: 'text' | 'password' | 'email';
  placeholder: string;
  value: string;
  id: string; 
  onChange: (val: string) => void; 
}

export const Input = ({ type, placeholder, value, onChange, id }: InputProps) => (
  <div className="w-full">
    <label htmlFor={id} className="sr-only">
      {placeholder}
    </label>
    
    <input
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-input border-none rounded-pill py-4 px-6 text-gray-700 focus:ring-2 focus:ring-slate-200 outline-none transition-all placeholder:text-secundario/50"
    />
  </div>
);

export default Input;