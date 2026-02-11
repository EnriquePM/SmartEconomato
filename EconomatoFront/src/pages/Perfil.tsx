import { useState, useEffect } from "react";
import { User, Mail, CheckCircle2, Save, UtensilsCrossed } from "lucide-react";

// --- IMPORTAMOS TUS 8 IMÁGENES LOCALES ---
// Asegúrate de que los nombres coinciden con tus archivos en la carpeta assets/Avatares
import chef1 from '../assets/Avatares/chef.png';
import chef2 from '../assets/Avatares/chef2.png';
import chef3 from '../assets/Avatares/chef3.png';
import chef4 from '../assets/Avatares/chef4.png';
import chef5 from '../assets/Avatares/chef5.png';
import chef6 from '../assets/Avatares/chef6.png';
import chef7 from '../assets/Avatares/chef7.png';
import chef8 from '../assets/Avatares/chef8.png';

// Creamos la lista para usarla en el selector
const AVATARES_COCINA = [
  chef1,
  chef2,
  chef3,
  chef4,
  chef5, 
  chef6, 
  chef7, 
  chef8
];

const Perfil = () => {
  // ESTADO INICIAL
  // Intentamos leer del localStorage primero para recordar la foto si recargas la página
  const [usuario, setUsuario] = useState({
    nombre: "Ayoze",
    apellidos: "Pérez",
    email: "ayoze.perez@escuela.com",
    rol: "Alumno",
    avatar: localStorage.getItem("avatarUsuario") || chef1 
  });

  const [avatarSeleccionado, setAvatarSeleccionado] = useState(usuario.avatar);
  const [guardado, setGuardado] = useState(false);

  // --- FUNCIÓN PARA GUARDAR Y ACTUALIZAR EL MENÚ ---
  const guardarCambios = () => {
    // 1. Actualizamos el estado de esta página
    setUsuario({ ...usuario, avatar: avatarSeleccionado });
    setGuardado(true);
    
    // 2. Guardamos en memoria permanente del navegador
    localStorage.setItem("avatarUsuario", avatarSeleccionado);
    
    // 3. ¡EL TRUCO! Avisamos al resto de la App (al menú superior)
    window.dispatchEvent(new Event("avatar-actualizado"));

    // 4. Quitamos el mensaje de éxito a los 3 segundos
    setTimeout(() => setGuardado(false), 3000);
  };

  return (
    <main className="w-full space-y-6 animate-fade-in pt-6">
      
      <header className="text-left">
        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-500 mt-1">Consulta tus datos y personaliza tu avatar.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* COLUMNA IZQUIERDA (Tarjeta Usuario) */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center h-fit w-full">
            <div className="relative w-32 h-32 mb-4">
                <img 
                    src={avatarSeleccionado} 
                    alt="Avatar" 
                    className="w-full h-full rounded-full border-4 border-blue-50 bg-white object-contain shadow-sm p-1"
                />
                <span className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white" title="Conectado"></span>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900">{usuario.nombre} {usuario.apellidos}</h2>
            
            <span className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase rounded-full tracking-wider">
                {usuario.rol}
            </span>

            <div className="mt-6 w-full border-t border-gray-100 pt-6 flex justify-center">
                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                    <Mail size={16} />
                    <span className="text-sm font-medium">{usuario.email}</span>
                </div>
            </div>
        </section>

        {/* COLUMNA DERECHA (Selector) */}
        <section className="lg:col-span-2 space-y-6">
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 text-blue-800 text-sm">
                <UtensilsCrossed size={20} className="shrink-0" />
                <p>
                    Tus datos personales son gestionados por la administración. 
                    Si necesitas cambiarlos, contacta con secretaría.
                </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <UtensilsCrossed size={20} className="text-gray-500"/> Elige tu personaje
                </h3>
                
                {/* GRID DE AVATARES */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-6">
                    {AVATARES_COCINA.map((imgSrc, index) => (
                        <button
                            key={index}
                            onClick={() => setAvatarSeleccionado(imgSrc)}
                            className={`p-2 rounded-xl border-2 transition-all hover:bg-gray-50 flex justify-center items-center relative group aspect-square ${
                                avatarSeleccionado === imgSrc 
                                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                                : 'border-gray-100'
                            }`}
                        >
                            <img src={imgSrc} alt={`Chef ${index}`} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                            
                            {avatarSeleccionado === imgSrc && (
                                <div className="absolute top-2 right-2 text-blue-500 bg-white rounded-full shadow-sm p-0.5">
                                    <CheckCircle2 size={14} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                    <p className="text-xs text-gray-400 hidden sm:block">
                       * Tu avatar será visible para los profesores.
                    </p>
                    <div className="flex gap-4 items-center ml-auto">
                        {guardado && (
                            <span className="text-green-600 text-sm font-bold animate-pulse flex items-center gap-1">
                                <CheckCircle2 size={16}/> ¡Guardado!
                            </span>
                        )}
                        
                        <button 
                            onClick={guardarCambios}
                            className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                        >
                            <Save size={18} />
                            <span>Guardar Avatar</span>
                        </button>
                    </div>
                </div>
            </div>
            
            <p className="text-center text-xs text-gray-300 mt-4">
               Stickers diseñados por Flaticon
            </p>
        </section>
      </div>
    </main>
  );
};

export default Perfil;