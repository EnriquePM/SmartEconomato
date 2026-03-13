
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
}

export const Input = ({ 
  type, 
  placeholder, 
  value, 
  onChange, 
  id, 
  label, 
  className = "", 
  disabled = false  
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
      // 4. IMPORTANTE: Si el value llega vacío, ponemos "" para que no sea 'undefined'
      value={value ?? ""} 
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled} 
      className={`
        w-full bg-gray-100 border-none rounded-full py-3 px-6 
        text-sm font-semibold text-gray-800 
        placeholder:text-gray-400 
        focus:ring-2 focus:ring-gray-200 outline-none 
        transition-all 
        ${className}
      `}
    />
  </div>
);

export default Input;