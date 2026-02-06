import React from 'react';

//Props: qué necesita el componente 
interface InputProps {
  type: 'text' | 'password' | 'email';
  placeholder: string;
  value: string;
  id: string; //para conectar label e input
  onChange: (val: string) => void; //recibe un string y no devuelve nada. Solo sirve para avisar de un cambio. 
}

export const Input = ({ type, placeholder, value, onChange, id }: InputProps) => (
  <div className="w-full">
      {/* Label invisible pero accesible */}
    <label htmlFor={id} className="sr-only">
      {placeholder}
    </label>
    
    <input
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      // e -> evento que se dispara cuando el usuario escribe
      // e.target -> selecciona ese input y e.target.value -> coge el nuevo valor del input
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-100 border-none rounded-[30px] py-4 px-6 text-gray-700 focus:ring-2 focus:ring-gray-200 outline-none transition-all"
    />
  </div>
);

export default Input; 