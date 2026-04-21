
interface InputProps {
  // 1. Añadimos 'date' por si lo necesitas para caducidad
  type: 'text' | 'password' | 'email' | 'number' | 'date'; 
  placeholder: string;
  // 2. Permitimos que value sea string o number, pero aseguramos que no sea null
  value: string | number; 
  id?: string;
  label?: string;
  // 3. El cambio: aceptamos que devuelva string o number según necesites
  onChange: (val: any) => void; 
  className?: string; 
  disabled?: boolean;
  min?: number;
}

export const Input = ({ 
  type, 
  placeholder, 
  value, 
  onChange, 
  id, 
  label, 
  className = "", 
  disabled = false,
  min
}: InputProps) => (
  <div className="w-full text-left">
    {label && (
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-500 mb-1 ml-1"
      >
        {label}
      </label>
    )}
    
    <input
      id={id}
      type={type}
      value={value ?? ""} 
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled} 
      min={type === 'number' ? min : undefined}
      className={`
        w-full bg-input rounded-full py-3 px-6 
        text-sm font-semibold text-gray-800 
        placeholder:text-gray-400 
        border border-gray-300
        focus:border-acento focus:bg-white 
    
    outline-none transition-all duration-200
    ${className}
        ${className}
      `}
    />
  </div>
);

export default Input;