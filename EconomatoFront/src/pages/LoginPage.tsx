import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importar el hook

import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import FooterBar from '../components/ui/Footer';
import logoSmart from '../assets/logoSmart.png';
import fondo from '../assets/fondo.png';




const LoginPage = () => {
  const [user, setUser] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate(); // 2. Inicializarlo

  const handleLogin = () => {
    // 3. Simulación de validación 
    if (user === "admin" && password === "1234") {
      localStorage.setItem("isAuthenticated", "true"); // Guardamos la marca
      navigate("/"); // Redirigimos al Layout
    } else {
      alert("Usuario o contraseña incorrectos (Prueba admin / 1234)");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-4 py-4"  >
      {/* Banner Superior */}
      <div className="relative w-full h-64 md:h-75 overflow-hidden">
        <img 
          src={fondo} 
          alt="Cocina" 
          className="w-full h-full object-cover rounded-t-[15px] object-[50%_75%]" 
        />
        {/* Capa de degradado*/}
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

        <div className="md:w-1/3 w-full space-y-4 mt-8 md:mt-0">
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
          <Button text="Entrar" onClick={handleLogin} />
        </div>
  
      </main>
        <FooterBar />
    
    </div>
  );
};

export default LoginPage;