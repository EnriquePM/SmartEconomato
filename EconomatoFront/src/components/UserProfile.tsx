import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, User, Settings, LogOut } from 'lucide-react';

// Importamos la imagen por defecto por si es la primera vez que entran
import defaultAvatar from '../assets/Avatares/chef.png';

export const UserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // ESTADO: Iniciamos con lo que haya en memoria O con el chef por defecto
  const [avatarActual, setAvatarActual] = useState(() => {
    return localStorage.getItem("avatarUsuario") || defaultAvatar;
  });

  // EFECTO MÁGICO: Escuchamos cuando alguien grita "avatar-actualizado"
  useEffect(() => {
    const actualizarFoto = () => {
      const nuevaFoto = localStorage.getItem("avatarUsuario");
      if (nuevaFoto) {
        setAvatarActual(nuevaFoto);
      }
    };

    // Nos suscribimos al evento
    window.addEventListener("avatar-actualizado", actualizarFoto);

    // Limpieza (muy importante en React)
    return () => {
      window.removeEventListener("avatar-actualizado", actualizarFoto);
    };
  }, []);

  return (
    <div className="relative border-t border-gray-200 pt-4 mt-2">
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-full p-2 rounded-lg hover:bg-gray-100 transition-colors group outline-none"
      >
        {/* Usamos el estado 'avatarActual' en vez de la variable fija */}
        <img
          className="w-9 h-9 rounded-full border border-gray-200 shadow-sm bg-white p-0.5 object-contain"
          src={avatarActual} 
          alt="Avatar"
        />
        <div className="flex-1 ms-3 text-left overflow-hidden">
          <p className="text-sm font-bold text-gray-700 truncate">Ayoze Pérez</p>
          <p className="text-xs text-gray-500 truncate">Alumno</p>
        </div>
        <ChevronUp 
            size={16} 
            className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Menú Desplegable (sin cambios) */}
      {isOpen && (
       <div className="absolute bottom-full left-0 w-full mb-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
          <ul className="py-2 text-sm text-gray-700">
            <li>
              <Link 
                to="/perfil" 
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <User size={16} /> 
                <span>Mi Perfil</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/ajustes" 
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Settings size={16} /> 
                <span>Ajustes de cuenta</span>
              </Link>
            </li>
            <li className="border-t border-gray-100 mt-1 pt-1">
              <Link 
                to="/login" 
                className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <LogOut size={16} /> 
                <span>Cerrar Sesión</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};