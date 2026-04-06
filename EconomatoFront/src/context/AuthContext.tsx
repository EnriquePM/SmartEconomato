import { createContext, useContext, useState, type ReactNode } from 'react';

const normalizeRole = (role: string) =>
  role
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s_-]+/g, '');

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
      localStorage.removeItem('token');
    }
  };

  const hasRole = (roles: string[]) => {
    if (!usuario?.rol) return false;
    const normalizedCurrentRole = normalizeRole(usuario.rol);
    return roles.some((role) => normalizeRole(role) === normalizedCurrentRole);
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
