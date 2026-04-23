export default function PaginaMantimiento() {


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center">
        <div className="mb-10">
      </div>
        <div className="text-[#DC2626] text-64px mb-6 font-bold">500</div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4 uppercase tracking-tighter">
          ¡Vaya! Nos falta un ingrediente clave.
        </h1>
        
        <p className="text-gray-600 mb-8">
          El servidor ha decidido tomarse un descanso. 
          Sentimos las molestias, volveremos muy pronto.
        </p>

        <button
          onClick={() => window.location.href = "/"}
          className="py-4 px-8 rounded-full bg-[#DC2626] text-white font-bold text-[12px] uppercase tracking-[0.1em] transition-all hover:scale-[1.05] active:scale-[0.96]"
        >
          Intentar volver a entrar
        </button>
      </div>
    </div>
  );
}