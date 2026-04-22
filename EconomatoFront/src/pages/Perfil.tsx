import { useState } from "react";
import {
  Mail,
  LogOut,
  User,
  Save,
  UserCircle,
  ShieldCheck,
  AtSign
} from "lucide-react";

import { Button } from "../components/ui/Button";
import { usePerfil } from "../hooks/useUserPerfil";
import { AlertModal } from "../components/ui/AlertModal";

import chef1 from '../assets/Avatares/chef.png';
import chef2 from '../assets/Avatares/chef2.png';
import chef3 from '../assets/Avatares/chef3.png';
import chef4 from '../assets/Avatares/chef4.png';
import chef5 from '../assets/Avatares/chef5.png';
import chef6 from '../assets/Avatares/chef6.png';


const AVATARES_COCINA = [
  chef1, chef2, chef3, chef4, chef5, chef6
];

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
    <main className="space-y-0 animate-fade-in flex flex-col h-full gap-4">

      {/* HEADER */}
      <header className="flex justify-between items-center px-2">
        <div>
          <h1>Mi Perfil</h1>
          <h2>Tu información personal y personalización.</h2>
        </div>

        <Button onClick={() => setIsLogoutModalOpen(true)} variant="primario">
          <LogOut size={16} /> Cerrar Sesión
        </Button>
      </header>

      <div className="w-full bg-white p-6 sm:p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-10">
            <section className="flex items-center gap-6">

              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={avatarSeleccionado}
                  className="w-20 h-20 object-contain"
                />
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-primario">
                  {usuario.nombre}
                </h2>
                <p className="text-sm text-gray-400">
                  {usuario.username}
                </p>
              </div>

            </section>

            <section className=" border-t border-gray-100 p-4 space-y-3">

              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <UserCircle size={14} />
                  Icono
                </h3>

                <button
                  onClick={guardarAvatar}
                  className="px-3 py-1.5 text-[10px] font-bold uppercase border rounded-lg bg-white hover:bg-gray-100"
                >
                  <Save size={12} className="inline mr-1" />
                  Guardar
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 px-6">

                {AVATARES_COCINA.map((imgSrc, index) => (
                  <button
                    key={index}
                    onClick={() => setAvatarSeleccionado(imgSrc)}
                    className={`w-12 h-12 rounded-full border flex items-center justify-center overflow-hidden transition-all ${
                      avatarSeleccionado === imgSrc
                        ? "border-acento bg-acento/10 scale-90"
                        : "border-gray-300 bg-gray-50"
                    }`}
                  >
                    <img
                      src={imgSrc}
                      className="w-8 h-8 object-contain"
                    />
                  </button>
                ))}

              </div>

              {guardado && (
                <p className="text-[10px] text-green-600 font-bold uppercase animate-bounce">
                  Guardado
                </p>
              )}

            </section>

          </div>
          <div className="space-y-4 self-end">

            <Info label="Nombre Completo" icon={<User size={16} />} value={usuario.nombre} />
            <Info label="Usuario" icon={<AtSign size={16} />} value={`@${usuario.username}`} />
            <Info label="Email" icon={<Mail size={16} />} value={usuario.email} />
            <Info label="Rol" icon={<ShieldCheck size={16} />} value={usuario.rol} badge />

          </div>

        </div>
      </div>

      <AlertModal
        isOpen={isLogoutModalOpen}
        type="confirm"
        title="¿Cerrar Sesión?"
        message="¿Seguro que quieres salir?"
        confirmText="SALIR"
        cancelText="CANCELAR"
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />

    </main>
  );
};

export default Perfil;


const Info = ({ label, value, icon, badge }: any) => (
  <div className="flex items-center gap-4 px-5 py-3.5 bg-gray-50/50 rounded-2xl border border-gray-100">

    <div className="text-gray-400">{icon}</div>

    <div className="flex-1 flex justify-between items-center gap-4">

      <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
        {label}
      </span>

      {badge ? (
        <span className="px-3 py-1 bg-gray-100 text-xs font-black uppercase rounded-full">
          {value}
        </span>
      ) : (
        <span className="text-sm font-bold text-primario">
          {value}
        </span>
      )}

    </div>
  </div>
);