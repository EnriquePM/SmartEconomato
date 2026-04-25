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

      <main className="relative z-20 flex-1 flex items-center justify-center w-full px-4">
        <div className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-2xl border border-white/50 animate-fade-in flex flex-col items-center gap-4">
          
          <img 
            src={logoSmart} 
            alt="Logo SmartEconomato" 
            className="h-7 w-auto object-contain" 
          />
          
          <div className="text-center">
            <h1 className='font-semibold text-4xl mb-1'>Bienvenid@</h1>
            <p className='font-normal text-sm text-gray-400'>
              Introduce tus datos para iniciar sesión
            </p>
          </div>

          <form onSubmit={onSubmit} className="w-full flex flex-col gap-3">
            <Input 
              type="text" 
              label='Usuario'
              placeholder="Nombre de usuario" 
              value={user} 
              id="usuario"
              onChange={setUser} 
            />
            <Input 
              label='Contraseña'
              type="password" 
              placeholder="••••••••" 
              value={password} 
              id="contrasena"
              onChange={setPassword} 
            />
            <Button 
              loading={loading}
              type="submit"
              variant="primario"
              className="w-full mt-1"
            >
              Entrar
            </Button>
            <div className="h-4">
              {error && (
                <p className="text-red-500 text-xs font-bold text-center">
                  {error}
                </p>
              )}
            </div>
          </form>

          <p className="text-[11px] text-gray-400 text-center">
            Proyecto financiado por el Gobierno de Canarias
          </p>
        </div>
      </main>

      <div className="relative z-20 w-full">
        <footer>
          <div className="flex justify-center items-center gap-2 text-secundario font-normal text-sm mb-6">
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