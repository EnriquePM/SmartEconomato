import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import FooterBar from '../components/ui/Footer';
import logoSmart from '../assets/logoSmart.png';
import fondo from '../assets/fondo.png';

const LoginPage = () => {
  // --- ESTADOS ---
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Este es el interruptor que decide qué formulario ver
  const [step, setStep] = useState<'login' | 'change-password'>('login');
  
  const navigate = useNavigate();

  // --- LÓGICA DE LOGIN (Lo que hablarás con Enrique) ---
  const handleInitialLogin = () => {
    // AQUÍ IRÁ LA LLAMADA AL BACKEND
    // Enrique te dirá: "Si los datos son correctos, mira el campo 'mustChange'"
    if (user === "admin" && password === "1234") {
      const mustChange = true; // Esto vendrá del backend
      
      if (mustChange) {
        setStep('change-password');
      } else {
        localStorage.setItem("isAuthenticated", "true");
        navigate("/");
      }
    } else {
      alert("Credenciales incorrectas");
    }
  };

  // --- LÓGICA DE CAMBIO DE CLAVE ---
  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) return alert("No coinciden");
    
    // Aquí enviarás la nueva clave al backend de Enrique
    localStorage.setItem("hasChangedPassword", "true");
    localStorage.setItem("isAuthenticated", "true");
    navigate("/");
  };

  // --- SUB-COMPONENTES (Para no ensuciar el return principal) ---
  
  const LoginForm = (
    <div className="space-y-4">
      <Input type="text" placeholder="Usuario" value={user} id='u' onChange={setUser} />
      <Input type="password" placeholder="Contraseña temporal" value={password} id='p' onChange={setPassword} />
      <Button text="Acceder" onClick={handleInitialLogin} />
    </div>
  );

  const ChangePasswordForm = (
    <div className="space-y-4">
      <p className="text-blue-600 font-medium text-sm">Debes actualizar tu contraseña</p>
      <Input type="password" placeholder="Nueva Contraseña" value={newPassword} id='np' onChange={setNewPassword} />
      <Input type="password" placeholder="Repetir Contraseña" value={confirmPassword} id='cp' onChange={setConfirmPassword} />
      <Button text="Actualizar y Entrar" onClick={handleChangePassword} />
    </div>
  );

  // --- RENDERIZADO PRINCIPAL ---
  return (
    <div className="min-h-screen bg-white flex flex-col px-4 py-4">
      {/* Banner */}
      <div className="relative w-full h-64 overflow-hidden rounded-t-[20px]">
        <img src={fondo} className="w-full h-full object-cover" alt="fondo" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </div>

      <main className="max-w-6xl mx-auto w-full px-20 py-12 flex flex-col md:flex-row justify-between">
        <div className="md:w-1/2">
          <img src={logoSmart} className="h-16 mb-4" alt="logo" />
          <h1 className="text-5xl font-extrabold text-gray-900">
            {step === 'login' ? 'Bienvenido' : 'Paso Obligatorio'}
          </h1>
          <p className="text-xl text-gray-500 mt-2">
            {step === 'login' ? 'Accede a tu cuenta' : 'Cambia tu contraseña por seguridad'}
          </p>
        </div>

        <div className="md:w-1/3 w-full mt-8 md:mt-0">
          {/* Aquí ocurre la magia: mostramos un formulario u otro */}
          {step === 'login' ? LoginForm : ChangePasswordForm}
        </div>
      </main>
      
      <FooterBar />
    </div>
  );
};

export default LoginPage;