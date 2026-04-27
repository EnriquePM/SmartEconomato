import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Users, Search, ExternalLink, ChevronRight } from 'lucide-react';
import { Buscador } from '../components/ui/Buscador';
import { Select } from '../components/ui/select';
import { getActividades } from '../services/actividadService';
import type { RegistroActividad } from '../models/actividad.model';

const ENTIDAD_CONFIG: Record<string, { label: string; color: string }> = {
  pedido:      { label: 'Pedido',    color: 'bg-blue-50 text-blue-700 border-blue-100' },
  receta:      { label: 'Receta',    color: 'bg-green-50 text-green-700 border-green-100' },
  ingrediente: { label: 'Producto',  color: 'bg-orange-50 text-orange-700 border-orange-100' },
  material:    { label: 'Utensilio', color: 'bg-purple-50 text-purple-700 border-purple-100' },
};

const FILTRO_PERIODO = [
  { value: 'todos',  label: 'Todo el historial' },
  { value: 'hoy',    label: 'Hoy' },
  { value: 'semana', label: 'Últimos 7 días' },
  { value: 'mes',    label: 'Últimos 30 días' },
];

const FILTRO_ENTIDAD = [
  { value: 'todos',      label: 'Todas las entidades' },
  { value: 'pedido',     label: 'Pedidos' },
  { value: 'receta',     label: 'Recetas' },
  { value: 'ingrediente', label: 'Productos' },
  { value: 'material',   label: 'Utensilios' },
];

const formatFecha = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const PanelControl = () => {
  const navigate = useNavigate();
  const [actividades, setActividades] = useState<RegistroActividad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEntidad, setFiltroEntidad] = useState('todos');
  const [filtroPeriodo, setFiltroPeriodo] = useState('todos');

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true);
        const data = await getActividades();
        setActividades(data);
      } catch {
        setError('No se pudieron cargar las actividades.');
      } finally {
        setCargando(false);
      }
    };
    void cargar();
  }, []);

  const actividadesFiltradas = useMemo(() => {
    const ahora = new Date();

    return actividades.filter((a) => {
      const texto = busqueda.toLowerCase();
      const coincideTexto =
        !texto ||
        a.nombre_usuario.toLowerCase().includes(texto) ||
        a.accion.toLowerCase().includes(texto) ||
        (a.descripcion ?? '').toLowerCase().includes(texto);

      const coincideEntidad = filtroEntidad === 'todos' || a.entidad === filtroEntidad;

      let coincidePeriodo = true;
      if (filtroPeriodo !== 'todos') {
        const fecha = new Date(a.fecha);
        const diffMs = ahora.getTime() - fecha.getTime();
        const diffDias = diffMs / (1000 * 60 * 60 * 24);
        if (filtroPeriodo === 'hoy')    coincidePeriodo = diffDias < 1;
        if (filtroPeriodo === 'semana') coincidePeriodo = diffDias <= 7;
        if (filtroPeriodo === 'mes')    coincidePeriodo = diffDias <= 30;
      }

      return coincideTexto && coincideEntidad && coincidePeriodo;
    });
  }, [actividades, busqueda, filtroEntidad, filtroPeriodo]);

  const handleRowClick = (ruta: string | null) => {
    if (ruta) navigate(ruta);
  };

  return (
    <div className="space-y-0 animate-fade-in flex flex-col h-full gap-4">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 pb-4">
        <div>
          <h1>Panel de Control</h1>
          <h2>Registro de actividad de usuarios en tiempo real.</h2>
        </div>
        <Link
          to="/admin-usuarios"
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm font-bold rounded-xl hover:bg-gray-700 transition-colors shrink-0"
        >
          <Users size={15} />
          Gestionar Usuarios
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 shrink-0">
        <Buscador
          value={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar por usuario, acción o descripción..."
        />
        <div className="w-full md:w-64">
          <Select options={FILTRO_ENTIDAD} value={filtroEntidad} onChange={setFiltroEntidad} />
        </div>
        <div className="w-full md:w-64">
          <Select options={FILTRO_PERIODO} value={filtroPeriodo} onChange={setFiltroPeriodo} />
        </div>
        <span className="text-xs font-bold px-4 py-2 rounded-full flex items-center border bg-gray-50 text-gray-600 border-gray-200 shrink-0 self-center">
          {actividadesFiltradas.length} registros
        </span>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1 mb-6">
        <div className="overflow-x-auto h-full">
          {cargando ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              Cargando actividad...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-48 text-red-400 text-sm">
              {error}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold sticky top-0 z-10">
                <tr>
                  <th className="p-4 border-b border-gray-200">Fecha y hora</th>
                  <th className="p-4 border-b border-gray-200">Usuario</th>
                  <th className="p-4 border-b border-gray-200">Acción</th>
                  <th className="p-4 border-b border-gray-200">Detalle</th>
                  <th className="p-4 border-b border-gray-200 text-center">Tipo</th>
                  <th className="p-4 border-b border-gray-200 text-center">Ver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {actividadesFiltradas.length > 0 ? (
                  actividadesFiltradas.map((a) => {
                    const cfg = ENTIDAD_CONFIG[a.entidad] ?? { label: a.entidad, color: 'bg-gray-50 text-gray-600 border-gray-200' };
                    return (
                      <tr
                        key={a.id_log}
                        onClick={() => handleRowClick(a.ruta)}
                        className={`transition-colors ${a.ruta ? 'cursor-pointer hover:bg-blue-50' : 'hover:bg-gray-50'}`}
                      >
                        <td className="p-4 text-xs text-gray-500 font-medium whitespace-nowrap">
                          {formatFecha(a.fecha)}
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-bold text-gray-900">{a.nombre_usuario}</span>
                        </td>
                        <td className="p-4 text-sm text-gray-700">{a.accion}</td>
                        <td className="p-4 text-sm text-gray-500 max-w-xs truncate">
                          {a.descripcion ?? '—'}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-black tracking-widest border ${cfg.color}`}>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {a.ruta ? (
                            <ChevronRight size={16} className="inline text-gray-300 group-hover:text-blue-500" />
                          ) : (
                            <ExternalLink size={14} className="inline text-gray-200" />
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-gray-400">
                      <Activity size={32} className="mx-auto mb-3 opacity-20" />
                      <p className="text-sm font-semibold tracking-widest">Sin actividad registrada</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default PanelControl;
