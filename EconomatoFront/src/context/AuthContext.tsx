import { createContext, useContext, useState, type ReactNode } from 'react';

export interface UsuarioAuth {
  id: number;
  username: string;
  nombre: string;
  apellido1: string;
  apellido2?: string | null;
  email?: string | null;
  rol: string; // "Administrador" | "Profesor" | "Alumno"
}

interface AuthContextType {
  usuario: UsuarioAuth | null;
  setUsuario: (usuario: UsuarioAuth | null) => void;
  hasRole: (roles: string[]) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuarioState] = useState<UsuarioAuth | null>(() => {
    try {
      const stored = localStorage.getItem('usuario');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const setUsuario = (u: UsuarioAuth | null) => {
    setUsuarioState(u);
    if (u) {
      localStorage.setItem('usuario', JSON.stringify(u));
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      localStorage.removeItem('usuario');
      localStorage.removeItem('isAuthenticated');
    }
  };

  const hasRole = (roles: string[]) => {
    return usuario ? roles.includes(usuario.rol) : false;
  };

  const logout = () => {
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, hasRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
