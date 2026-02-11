import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import FooterBar from '../components/ui/Footer';
import logoSmart from '../assets/logoSmart.png';
import fondo from '../assets/fondo.png';

const LoginPage = () => {
  const navigate = useNavigate();

  // Estados
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    // Si viene de un formulario (Enter), prevenimos la recarga
    if (e) e.preventDefault(); 
    
    // 1. Validación básica
    if (!user || !password) {
      alert("Por favor, rellena todos los campos.");
      return;
    }

    setLoading(true);

    try {
      // 2. Llamada al Backend
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user,
          contrasenya: password, 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Ocurrió un error al iniciar sesión");
        setLoading(false);
        return;
      }

      console.log("Respuesta del servidor:", data);

      // 3. Lógica de Redirección (Sin alertas molestas)
      if (data.requiereCambioPass) {
        // CASO: PRIMER LOGIN
        navigate("/cambiar-password", {
            state: {
                username: user,       
                oldPassword: password 
            }
        });
        return;
      } 
      
      // CASO: LOGIN NORMAL
      localStorage.setItem("isAuthenticated", "true");
      if (data.token) localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      
      navigate("/"); // O '/inventario'

    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar con el servidor. ¿Está encendido el Backend?");
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

      <main className="max-w-6xl mx-auto w-full px-20 py-12 mt-4 flex flex-col md:flex-row justify-between">
        <div className="md:w-1/2">
          <img
            src={logoSmart}
            alt='Logo SmartEconomato' 
            className="h-16 w-auto object-contain mb-4"
          />
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
            Bienvenido a SmartEconomato
          </h1>
          <p className="text-xl text-gray-500 mt-2">
            Un economato a tu medida
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="md:w-1/3 w-full space-y-4 mt-8 md:mt-0">
          <Input 
            type="text" 
            placeholder="Usuario" 
            value={user} 
            id={'usuario'}
            onChange={setUser} 
          />
          <Input 
            type="password" 
            placeholder="Contraseña" 
            value={password} 
            id={'contraseña'}
            onChange={setPassword} 
          />
          
          <Button 
            text={loading ? "Entrando..." : "Entrar"} 
            onClick={() => handleLogin()} 
          />
        </form>
      </main>
      <FooterBar />
    </div>
  );
};

export default LoginPage;