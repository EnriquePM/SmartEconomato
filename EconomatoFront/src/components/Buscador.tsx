interface Props {
  valor: string;
  onBuscar: (v: string) => void;
}

export const Buscador = ({ valor, onBuscar }: Props) => {
  return (
    <div className="w-full"> {/* Quitamos el marginBottom: 20px que daba problemas */}
      <label 
        htmlFor="search" 
        className="block text-sm font-bold text-gray-700 mb-1"
      >
        🔍 Buscar producto:
      </label>
      
      <input
        id="search"
        type="text"
        placeholder="Ej: Aceite, Arroz..."
        value={valor}
        onChange={(e) => onBuscar(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};