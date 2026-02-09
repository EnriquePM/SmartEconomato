import { useState } from 'react';
import { Link } from 'react-router-dom';

export const UserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative border-t border-default pt-4 mt-2">
      {/* Botón del Perfil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-full p-2 text-body rounded-base hover:bg-neutral-tertiary transition-colors group"
      >
        <img
          className="w-9 h-9 rounded-full border border-default shadow-sm"
          src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
          alt="Avatar"
        />
        <div className="flex-1 ms-3 text-left overflow-hidden">
          <p className="text-sm font-bold text-heading truncate">Ayoze Pérez</p>
          <p className="text-xs text-body-soft truncate">Alumno</p>
        </div>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {/* Menú Desplegable*/}
      {isOpen && (
       <div className="absolute bottom-full left-0 w-full mb-2 bg-white border border-default rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-bottom-2 overflow-hidden">
          <ul className="py-2 text-sm text-body">
            <li>
              <Link to="/perfil" className="block px-4 py-2 hover:bg-neutral-tertiary hover:text-fg-brand">
                Mi Perfil
              </Link>
            </li>
            <li>
              <Link to="/ajustes" className="block px-4 py-2 hover:bg-neutral-tertiary hover:text-fg-brand">
                Ajustes de cuenta
              </Link>
            </li>
            <li className="border-t border-default mt-1">
              <Link to="/login" className="block px-4 py-2 text-fg-danger-strong hover:bg-danger-soft font-medium">
                Cerrar Sesión
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};