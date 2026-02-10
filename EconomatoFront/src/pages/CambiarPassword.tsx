import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle2, AlertCircle, Save } from 'lucide-react';

const CambiarPassword = () => {
  const navigate = useNavigate();
  
  const [passwords, setPasswords] = useState({
    nueva: '',
    confirmar: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Validaciones simples
    if (passwords.nueva.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    if (passwords.nueva !== passwords.confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    // 2. Simulación de guardado
    setLoading(true);
    
    // Aquí es donde conectaríamos con el Backend real.
    // Simulamos un retraso de 1 segundo
    setTimeout(() => {
      // Guardamos en localStorage que ya NO es la primera vez
      localStorage.setItem('firstLogin', 'false');
      
      // Redirigimos al Dashboard principal
      navigate('/'); 
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 animate-fade-in">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        
        {/* Cabecera bonita */}
        <div className="bg-blue-600 p-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Lock className="text-white w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Seguridad de la Cuenta</h2>
          <p className="text-blue-100 text-sm mt-2">
            Al ser tu primer acceso, necesitas establecer una contraseña personal.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Input 1: Nueva */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Nueva Contraseña</label>
            <div className="relative">
                <input
                    type="password"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Escribe tu nueva clave"
                    value={passwords.nueva}
                    onChange={(e) => setPasswords({...passwords, nueva: e.target.value})}
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            </div>
          </div>

          {/* Input 2: Confirmar */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Repetir Contraseña</label>
            <div className="relative">
                <input
                    type="password"
                    required
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 outline-none transition-all ${
                        passwords.confirmar && passwords.nueva !== passwords.confirmar 
                        ? 'border-red-300 focus:ring-red-200' 
                        : 'border-gray-200 focus:ring-blue-500'
                    }`}
                    placeholder="Confirma la clave"
                    value={passwords.confirmar}
                    onChange={(e) => setPasswords({...passwords, confirmar: e.target.value})}
                />
                <CheckCircle2 className={`w-5 h-5 absolute left-3 top-3.5 ${
                    passwords.confirmar && passwords.nueva === passwords.confirmar 
                    ? 'text-green-500' 
                    : 'text-gray-400'
                }`} />
            </div>
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 animate-pulse">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Botón de Guardar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-lg transition-all transform active:scale-95 flex justify-center items-center gap-2"
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              <>
                <Save size={18} />
                Guardar y Entrar
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CambiarPassword;