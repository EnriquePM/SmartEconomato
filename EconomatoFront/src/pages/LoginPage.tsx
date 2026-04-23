import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import FooterBar from '../components/ui/Footer';
import logoSmart from '../assets/logoSmart.png';
import fondo from '../assets/fondo.png';
import { useLogin } from '../hooks/useLogin';

const LoginPage = () => {
  const { user, setUser, password, setPassword, loading, handleLogin } = useLogin();

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
          
        </div>

        {/* Formulario */}
        <form  onSubmit={handleLogin} className="md:w-1/3 w-full space-y-4 mt-8 md:mt-0">
          <Input 
            type="text" 
            placeholder="Usuario" 
            value={user} 
            id={'usuario'}
            onChange={setUser} 
          />
          <Input 
            type="password" 
            placeholder="Contrasena" 
            value={password} 
            id={'contrasena'}
            onChange={setPassword} 
          />
          
          <Button 
            loading={loading}
            type="submit"
            className="w-full"
            >Entrar</Button>
        </form>
      </main>
      <FooterBar />
    </div>
  );
};

export default LoginPage;
