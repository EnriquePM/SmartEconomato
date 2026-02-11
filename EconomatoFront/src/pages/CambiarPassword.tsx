import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import FooterBar from '../components/ui/Footer';
import logoSmart from '../assets/logoSmart.png';
import fondo from '../assets/fondo.png';

const CambiarPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Recuperamos los datos que nos pasó el Login
  const { username, oldPassword } = location.state || {};

  // Estados
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Protección de ruta
  useEffect(() => {
    if (!username || !oldPassword) {
      navigate('/login');
    }
  }, [username, oldPassword, navigate]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // 1. Validaciones
    if (!newPassword || !confirmPassword) {
      alert("Por favor, rellena ambos campos.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    
    setLoading(true);

    try {
      // 2. Llamada al Backend
      const response = await fetch('http://localhost:3000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          oldPassword: oldPassword, 
          newPassword: newPassword      
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Error al cambiar la contraseña");
        setLoading(false);
        return;
      }

      // 3. Éxito
      alert("¡Contraseña actualizada con éxito! Por favor, inicia sesión con tu nueva clave.");
      navigate('/login'); 

    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-4 py-4">
      {/* Banner Superior */}
      <div className="relative w-full h-64 md:h-75 overflow-hidden">
        <img 
          src={fondo} 
          alt="Cocina" 
          className="w-full h-full object-cover rounded-t-[15px] object-[50%_75%]" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white from-0% via-white/20 via-20% to-transparent to-30% rounded-t-[20px]"></div>
      </div>

      <main className="max-w-6xl mx-auto w-full px-20 py-12 mt-4 flex flex-col md:flex-row justify-between items-start">
        
        {/* Lado Izquierdo: Mensaje de Seguridad */}
        <div className="md:w-1/2">
          <img
            src={logoSmart}
            alt='Logo SmartEconomato' 
            className="h-16 w-auto object-contain mb-4"
          />
          <h1 className="text-5xl font-extrabold tracking-tight text-red-600">
            Paso Obligatorio
          </h1>
          <p className="text-xl text-gray-500 mt-4">
            Por motivos de seguridad, detectamos que es tu primer acceso.
          </p>
          <p className="text-lg text-gray-800 font-medium mt-2">
            Debes configurar una nueva contraseña personal para continuar.
          </p>
        </div>

        {/* Lado Derecho: Formulario */}
        <form onSubmit={handleSubmit} className="md:w-1/3 w-full space-y-6 mt-8 md:mt-0 bg-gray-50 p-6 rounded-xl border border-gray-100">
          
          <div className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Nueva Contraseña</label>
                <Input 
                    type="password" 
                    placeholder="Escribe tu nueva clave" 
                    value={newPassword} 
                    id={'newPass'}
                    onChange={setNewPassword} 
                />
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Confirmar Contraseña</label>
                <Input 
                    type="password" 
                    placeholder="Repite la clave" 
                    value={confirmPassword} 
                    id={'confirmPass'}
                    onChange={setConfirmPassword} 
                />
             </div>
          </div>
          
          <Button 
            text={loading ? "Actualizando..." : "Guardar y Salir"} 
            onClick={() => handleSubmit()} 
          />
        </form>
      </main>
      
      <FooterBar />
    </div>
  );
};

export default CambiarPassword;