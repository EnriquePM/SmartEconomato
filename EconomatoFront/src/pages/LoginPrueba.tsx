import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importar el hook

import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import FooterBar from '../components/ui/Footer';
import logoSmart from '../assets/logoSmart.png';
import fondo from '../assets/fondo.png';

const LoginPage2 = () => {
  const [user, setUser] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  // Estado para saber si es primera vez o login normal
  const [isFirstTime, setIsFirstTime] = useState<boolean>(false);
  
  const navigate = useNavigate();

  const handleLogin = () => {
    if (isFirstTime) {
      // LÓGICA DE REGISTRO
      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
      }
      if (password.length < 4) {
        alert("La contraseña debe ser más larga");
        return;
      }
      console.log("Registrando usuario:", user);
      localStorage.setItem("isAuthenticated", "true");
      navigate("/");
    } else {
      // LÓGICA DE LOGIN NORMAL
      if (user === "admin" && password === "1234") {
        localStorage.setItem("isAuthenticated", "true");
        navigate("/");
      } else {
        alert("Usuario o contraseña incorrectos");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-4 py-4">
      {/* Banner Superior (Igual al tuyo) */}
      <div className="relative w-full h-64 md:h-75 overflow-hidden">
        <img src={fondo} alt="Cocina" className="w-full h-full object-cover rounded-t-[15px] object-[50%_75%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-white from-0% via-white/20 via-20% to-transparent to-30% rounded-t-[20px]"></div>
      </div>

      <main className="max-w-6xl mx-auto w-full px-20 py-12 mt-4 flex flex-col md:flex-row justify-between">
        <div className="md:w-1/2">
          <img src={logoSmart} alt='Logo SmartEconomato' className="h-16 w-auto object-contain mb-4" />
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
            {isFirstTime ? "Crea tu cuenta" : "Bienvenido a SmartEconomato"}
          </h1>
          <p className="text-xl text-gray-500 mt-2">
            {isFirstTime ? "Establece tu contraseña de acceso" : "Un economato a tu medida"}
          </p>
        </div>

        <div className="md:w-1/3 w-full space-y-4 mt-8 md:mt-0">
          <Input 
            type="text" 
            placeholder="Usuario o Código" 
            value={user} 
            id={'usuario'}
            onChange={setUser} 
          />
          <Input 
            type="password" 
            placeholder={isFirstTime ? "Nueva Contraseña" : "Contraseña"} 
            value={password} 
            id={'contraseña'}
            onChange={setPassword} 
          />
          
          {/* Mostramos este input SOLO si es primera vez */}
          {isFirstTime && (
            <Input 
              type="password" 
              placeholder="Confirmar Contraseña" 
              value={confirmPassword} 
              id={'confirmar'}
              onChange={setConfirmPassword} 
            />
          )}

          <Button 
            text={isFirstTime ? "Finalizar Registro" : "Entrar"} 
            onClick={handleLogin} 
          />

          {/* Botón para alternar entre modos */}
          <div className="text-center mt-4">
            <button 
              onClick={() => setIsFirstTime(!isFirstTime)}
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              {isFirstTime 
                ? "¿Ya tienes cuenta? Inicia sesión aquí" 
                : "¿Es tu primera vez? Registra tu contraseña"}
            </button>
          </div>
        </div>
      </main>
      <FooterBar />
    </div>
  );
};

export default LoginPage2;