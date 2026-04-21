import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import FooterBar from '../components/layout/Footer';
import logoSmart from '../assets/logoSmart.png';
import fondo from '../assets/fondo.png';
import { useChangePassword } from '../hooks/useChangePassword';

const CambiarPassword = () => {
  const {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    handleSubmit,
  } = useChangePassword();

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
            Debes configurar una nueva contrasena personal para continuar.
          </p>
        </div>

        {/* Lado Derecho: Formulario */}
        <form onSubmit={handleSubmit} className="md:w-1/3 w-full space-y-6 mt-8 md:mt-0 bg-gray-50 p-6 rounded-xl border border-gray-100">
          
          <div className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Nueva Contrasena</label>
                <Input 
                    type="password" 
                    placeholder="Escribe tu nueva clave" 
                    value={newPassword} 
                    id={'newPass'}
                    onChange={setNewPassword} 
                />
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Confirmar Contrasena</label>
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
            loading={loading}
            type="submit"
            className="w-full"
            >Cambiar</Button>
        </form>
      </main>
      
      <FooterBar />
    </div>
  );
};

export default CambiarPassword;
