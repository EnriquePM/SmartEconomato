import { useState } from "react";
import { Mail, LogOut, User, Save, UserCircle, ShieldCheck, AtSign } from "lucide-react";
import { Button } from "../components/ui/Button";
import { usePerfil } from "../hooks/useUserPerfil";
import { AlertModal } from "../components/ui/AlertModal";

// --- IMPORTAMOS TUS 8 IMÁGENES LOCALES ---
import chef1 from '../assets/Avatares/chef.png';
import chef2 from '../assets/Avatares/chef2.png';
import chef3 from '../assets/Avatares/chef3.png';
import chef4 from '../assets/Avatares/chef4.png';
import chef5 from '../assets/Avatares/chef5.png';
import chef6 from '../assets/Avatares/chef6.png';
import chef7 from '../assets/Avatares/chef7.png';
import chef8 from '../assets/Avatares/chef8.png';

const AVATARES_COCINA = [chef1, chef2, chef3, chef4, chef5, chef6, chef7, chef8];

const Perfil = () => {
  const { 
    usuario, 
    avatarSeleccionado, 
    setAvatarSeleccionado, 
    guardado, 
    guardarAvatar, 
    handleLogout 
  } = usePerfil();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);


  return (
    // FONDO GRIS MUY CLARO (como la foto)
    <main className="space-y-0 animate-fade-in flex flex-col h-full gap-4">
      
      {/* TÍTULO PRINCIPAL (fuera de la tarjeta) */}
     <header className="flex justify-between items-center px-2">
        <div>
          <h1 >Mi Perfil</h1>
          <h2 >Tu información personal y personalización.</h2>
        </div>
        <Button 
            onClick={() => {
                console.log("Abriendo modal..."); // Si esto sale en consola, el estado está cambiando
                setIsLogoutModalOpen(true);
            }} 
            variant="primario"
            >
            <LogOut size={16}  /> Cerrar Sesión
            </Button>
      </header>

      {/* --- TARJETA ÚNICA (Todo aquí dentro) --- */}
      <div className="w-full  bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm space-y-8">
        
        {/* CABECERA: Avatar Grande y Nombre */}
        <section className="flex items-center justify-start gap-8 relative ml-20">
          {/* Columna Foto */}
          <div className="w-32 h-32 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden p-5 shrink-0 shadow-sm">
            <img src={avatarSeleccionado} alt="Avatar" className="w-full h-full object-contain" />
          </div>
          
          {/* Columna Datos */}
          <div className="space-y-1 flex-1">
            <h2 className="text-3xl font-bold text-primario tracking-tight leading-tight">
              {usuario.nombre}
            </h2>
            <p className="text-sm font-medium text-gray-400">{usuario.username}</p>
           
          </div>
          </section>

        {/* LISTA DE DATOS: Nombre del dato y el dato */}
        <section className="space-y-4 pt-0  px-8 sm:px-20 lg:px-60 border-t border-gray-50">
          
          {/* Nombre Completo */}
          <div className="flex items-center gap-4 px-5 py-3.5 bg-gray-50/50 rounded-2xl mt-6 border border-gray-100">
            <User size={18} className="text-gray-400 shrink-0" />
            <div className="flex-1 flex justify-between items-center gap-4">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Nombre Completo</span>
              <span className="text-sm font-bold text-primario">{usuario.nombre}</span>
            </div>
          </div>

          {/* Usuario */}
          <div className="flex items-center gap-4 px-5 py-3.5 bg-gray-50/50 rounded-2xl border border-gray-100">
            <AtSign size={18} className="text-gray-400 shrink-0" />
            <div className="flex-1 flex justify-between items-center gap-4">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Nombre de Usuario</span>
              <span className="text-sm font-bold text-primario">@{usuario.username}</span>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-4 px-5 py-3.5 bg-gray-50/50 rounded-2xl border border-gray-100">
            <Mail size={18} className="text-gray-400 shrink-0" />
            <div className="flex-1 flex justify-between items-center gap-4">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Email Institucional</span>
              <span className="text-sm font-bold text-primario">{usuario.email}</span>
            </div>
          </div>

          {/* Rol */}
          <div className="flex items-center gap-4 px-5 py-3.5 bg-gray-50/50 rounded-2xl border border-gray-100">
            <ShieldCheck size={18} className="text-gray-400 shrink-0" />
            <div className="flex-1 flex justify-between items-center gap-4">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Rol de Cuenta</span>
              <span className="px-3 py-1 bg-gray-100 text-primario text-[9px] font-black uppercase rounded-full tracking-tighter">
                {usuario.rol}
              </span>
            </div>
          </div>
        </section>

       {/* SELECTOR DE AVATAR INTEGRADO */}

        <section className="pt-8 px-8 sm:px-20 lg:px-60 border-t border-gray-100 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <UserCircle size={16} /> Selecciona tu icono
            </h3>
            
            <div className="flex items-center gap-3">
              {guardado && <span className="text-green-600 text-[10px] font-black uppercase animate-bounce">¡Guardado!</span>}
              <button 
                onClick={guardarAvatar}
                disabled={avatarSeleccionado === (localStorage.getItem("avatarUsuario") || chef1)}
                className="px-4 py-2 rounded-xl border font-bold text-[10px] uppercase tracking-widest transition-all bg-white text-gray-700 hover:bg-gray-50 border-gray-200 disabled:opacity-20"
              >
                <Save size={14} className="inline mr-1" /> Confirmar
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-2 justify-center sm:justify-start">
            {AVATARES_COCINA.map((imgSrc, index) => (
              <button
                key={index}
                onClick={() => setAvatarSeleccionado(imgSrc)}
                className={`relative w-14 h-14 rounded-full border-2 transition-all duration-300 flex items-center justify-center p-3 overflow-hidden ${
                  avatarSeleccionado === imgSrc 
                  ? 'border-acento bg-acento/10 scale-110' 
                  : 'border-gray-50 bg-gray-50 hover:bg-white hover:border-gray-200'
                }`}
              >
                <img 
                  src={imgSrc} 
                  className={`w-full h-full object-contain ${avatarSeleccionado === imgSrc ? 'scale-75' : 'opacity-60 hover:opacity-100'}`} 
                />
              </button>
            ))}
          </div>
        </section>
      </div>
      <AlertModal 
        isOpen={isLogoutModalOpen}
        type="confirm"
        title="¿Cerrar Sesión?"
        message="¿Estás seguro de que deseas salir? Tendrás que volver a iniciar sesión para acceder."
        confirmText="SALIR"
        cancelText="CANCELAR"
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </main>
  );
};

export default Perfil;