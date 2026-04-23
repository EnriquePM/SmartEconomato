interface Props {
  ordenActual: string;
  onCambioOrden: (nuevoValor: string) => void;
}

export const Ordenador = ({ ordenActual, onCambioOrden }: Props) => {
  return (
    <div className="w-full"> 
      <label 
        htmlFor="ordenar" 
        className="block text-sm font-bold text-gray-700 mb-1"
      >
        🔃 Ordenar por:
      </label>

      <select
        id="ordenar"
        value={ordenActual}
        onChange={(e) => onCambioOrden(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md bg-white cursor-pointer hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="alfabetico">🔤 Nombre (A-Z)</option>
        <option value="stockMayor">📈 Stock (Mayor a menor)</option>
        <option value="stockMenor">📉 Stock (Menor a mayor)</option>
        <option value="proveedor">🚚 Proveedor (ID)</option>
      </select>
    </div>
  );
};