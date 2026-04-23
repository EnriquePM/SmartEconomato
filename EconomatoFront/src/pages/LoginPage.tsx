import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import logoSmart from '../assets/logoTransparet.png';
import fondo from "../assets/fondoHome.png";
import { useLogin } from '../hooks/useLogin';

const LoginPage = () => {
  const { user, setUser, password, setPassword, loading, handleLogin, error, setError } = useLogin();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !password) {
      setError("Por favor, rellena todos los campos.");
      return;
    }
    
    handleLogin();
  };

  return (
    <div className="h-screen w-full relative flex flex-col items-center justify-center overflow-hidden font-sans">
      
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${fondo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(25px)', 
          transform: 'scale(1.1)'
        }}
      />
      <div className="absolute inset-0 z-10 bg-white/40" />


      <main className="relative z-20 flex-1 flex items-center justify-center w-full p-6">
        <div className="bg-white shadow-xl w-full max-w-xl p-10 md:p-12 rounded-[3rem] shadow-2xl border border-white/50 animate-fade-in flex flex-col items-center">
          

          <img 
            src={logoSmart} 
            alt="Logo SmartEconomato" 
            className="h-11 w-auto object-contain mb-16" 
          />
          
          <div className="text-center mb-8">
  
            <h1 className='font-semibold text-[50px] mb-6'>
              Bienvenid@
            </h1>
             <h1 className='font-normal text-[20px] text-gray-400 '>
              Introduce tus datos para iniciar sesión
            </h1>
          </div>

          
          <form onSubmit={onSubmit} className="w-full space-y-6">
            
            <div className="space-y-2">
              <Input 
                type="text" 
                label='Usuario'
                placeholder="Nombre de usuario" 
                value={user} 
                id="usuario"
                onChange={setUser} 
              />
            </div>

            <div className="space-y-2">
              <Input 
                label='Contraseña'
                type="password" 
                placeholder="••••••••" 
                value={password} 
                id="contrasena"
                onChange={setPassword} 
              />
            </div>

           <div className="pt-4">
            <Button 
              loading={loading}
              type="submit"
              variant="primario"
              className="w-full py-4"
            > Entrar
            
            </Button>

          </div>
          <div className="h-6"> 
          {error && (
            <p className="text-red-500 text-[14px] font-bold text-center animate-shake">
              {error}
            </p>
          )}
        </div>
          </form>
          <div className="mt-6 pt-6  w-full text-center">
            <p className="text-[12px] text-gray-400 leading-relaxed">
              Proyecto financiado por el Gobierno de Canarias <br />
            </p>
          </div>
        </div>
      </main>

      <div className="relative z-20 w-full">
        <footer>
            <div className="flex justify-center items-center gap-2 text-caption text-secundario font-normal text-[18px] mb-10 ">
                <span>Gobierno de Canarias</span>
                <span className="opacity-50"> | </span>
                <span>CEIP Virgen del Carmen</span>
            </div>
        </footer>
      </div>

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;