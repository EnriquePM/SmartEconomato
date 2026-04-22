import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, User, Settings, LogOut } from 'lucide-react';
import type { Usuario } from '../../models/user.model';
import { useAuth } from '../../context/AuthContext';


import defaultAvatar from '../../assets/Avatares/chef.png';

export const UserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  const [avatarActual, setAvatarActual] = useState(() => {
    return localStorage.getItem("avatarUsuario") || defaultAvatar;
  });
  

    const [user, setUser] = useState<Usuario | null>(null);

    useEffect(() => {

      const dataUser = localStorage.getItem('usuario'); 
      if (dataUser) {
        setUser(JSON.parse(dataUser));
      }

      const actualizarFoto = () => {
        const nuevaFoto = localStorage.getItem("avatarUsuario");
        if (nuevaFoto) {
          setAvatarActual(nuevaFoto);
        }
    };

 
    window.addEventListener("avatar-actualizado", actualizarFoto);


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
        <img
          className="w-9 h-9 rounded-full border border-gray-200 shadow-sm bg-white p-0.5 object-contain"
          src={avatarActual} 
          alt="Avatar"
        />
        <div className="flex-1 ms-3 text-left overflow-hidden">
          <p className="text-sm font-bold text-gray-700 truncate">{user?.username || "Cargando..."}</p>
          <p className="text-xs text-gray-500 truncate">{user?.rol|| "Cargando..."}</p>
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
            <li className="border-t border-gray-100 mt-1 pt-1">
              <button 
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 font-medium transition-colors text-left"
              >
                <LogOut size={16} /> 
                <span>Cerrar Sesión</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};