import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import FooterBar from '../components/ui/Footer';
import logoSmart from '../assets/logoSmart.png';
import fondo from '../assets/fondo.png';

const LoginPage = () => {
  // --- ESTADOS (TU LÓGICA ORIGINAL) ---
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Interruptor de vistas (Login o Cambio de Password)
  const [step, setStep] = useState<'login' | 'change-password'>('login');
  
  const navigate = useNavigate();

  // --- LÓGICA DE LOGIN (INTACTA) ---
  const handleInitialLogin = () => {
    if (user === "admin" && password === "1234") {
      const mustChange = true; 
      
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

  // --- LÓGICA DE CAMBIO DE CLAVE (INTACTA) ---
  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) return alert("No coinciden");
    localStorage.setItem("hasChangedPassword", "true");
    localStorage.setItem("isAuthenticated", "true");
    navigate("/");
  };

  // --- SUB-COMPONENTES (INTACTOS) ---
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
      <div className="relative w-full h-64 overflow-hidden rounded-t-[20px] shrink-0">
        <img src={fondo} className="w-full h-full object-cover" alt="fondo" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </div>

      {/* AJUSTE PARA IPAD PRO (xl):
          - En pantallas < 1280px (Móvil, Tablet, iPad Pro): Se ve VERTICAL (flex-col).
          - En pantallas > 1280px (PC de escritorio grande): Se ve HORIZONTAL (flex-row).
      */}
      <main className="max-w-6xl mx-auto w-full px-6 py-8 xl:px-20 xl:py-12 flex flex-col xl:flex-row justify-between items-center xl:items-start">
        
        {/* Lado Izquierdo (Texto y Logo) */}
        <div className="w-full xl:w-1/2 flex flex-col items-center xl:items-start text-center xl:text-left mb-8 xl:mb-0">
          <img src={logoSmart} className="h-16 mb-4" alt="logo" />
          <h1 className="text-4xl xl:text-5xl font-extrabold text-gray-900">
            {step === 'login' ? 'Bienvenido' : 'Paso Obligatorio'}
          </h1>
          <p className="text-lg xl:text-xl text-gray-500 mt-2">
            {step === 'login' ? 'Accede a tu cuenta' : 'Cambia tu contraseña por seguridad'}
          </p>
        </div>

        {/* Lado Derecho (Formulario) */}
        <div className="w-full max-w-md xl:w-1/3 mt-4 xl:mt-0">
          {step === 'login' ? LoginForm : ChangePasswordForm}
        </div>

      </main>
      
      <FooterBar />
    </div>
  );
};

export default LoginPage;