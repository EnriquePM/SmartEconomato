import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io, type Socket } from 'socket.io-client';
import { ShieldCheck, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAuditLogs, type AuditLogEntry } from '../services/auditLogService';

const SOCKET_URL = (import.meta as any).env?.VITE_BACKEND_URL ?? 'http://localhost:3002';

const ACTION_STYLES: Record<string, string> = {
  CREATE: 'bg-green-50 text-green-700 border-green-200',
  UPDATE: 'bg-blue-50 text-blue-700 border-blue-200',
  DELETE: 'bg-red-50 text-red-700 border-red-200',
};

const formatFecha = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'medium' });
};

const ENTITY_ROUTES: Record<string, string> = {
  Ingrediente: '/inventario?vista=ingredientes',
  Material: '/inventario?vista=utensilios',
  Pedido: '/pedidos',
};

const formatUsuario = (entry: AuditLogEntry) => {
  if (!entry.usuario) return entry.id_usuario ? 'Usuario eliminado' : '—';
  return `${entry.usuario.nombre} ${entry.usuario.apellido1}`;
};

const formatDetails = (details: Record<string, unknown> | null) => {
  if (!details || Object.keys(details).length === 0) return '—';
  return Object.entries(details)
    .flatMap(([k, v]) => {
      if (v !== null && typeof v === 'object' && !Array.isArray(v))
        return Object.entries(v as Record<string, unknown>).map(([sk, sv]) => `${sk}: ${sv}`);
      return [`${k}: ${v}`];
    })
    .join(' · ');
};

const AuditLog = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const cargar = async (p: number) => {
    setCargando(true);
    setError(null);
    try {
      const res = await getAuditLogs(p, 50);
      setLogs(res.data);
      setTotalPages(res.pagination.totalPages);
      setTotal(res.pagination.total);
      setPage(res.pagination.page);
    } catch {
      setError('No se pudo cargar el historial. Comprueba tu conexión.');
    } finally {
      setCargando(false);
    }
  };

  // Carga inicial
  useEffect(() => {
    void cargar(1);
  }, []);

  // Socket.io: inyectar nuevas filas en tiempo real solo en la primera página
  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('new_audit_log', (entrada: AuditLogEntry) => {
      setLogs((prev) => [entrada, ...prev.slice(0, 49)]);
      setTotal((t) => t + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="space-y-0 animate-fade-in flex flex-col h-full">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Historial de Auditoría</h1>
          <p className="text-gray-500 mt-1 font-medium text-sm">
            Registro de acciones realizadas en el sistema.{' '}
            {!cargando && <span className="font-bold text-gray-700">{total} entradas totales.</span>}
          </p>
        </div>
        <button
          onClick={() => void cargar(page)}
          disabled={cargando}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-bold transition-all disabled:opacity-50"
        >
          <RefreshCw size={15} className={cargando ? 'animate-spin' : ''} />
          Actualizar
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1 mb-4">
        <div className="overflow-x-auto h-full">
          {error ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-red-500">
              <ShieldCheck size={36} className="opacity-30" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold sticky top-0 z-10">
                <tr>
                  <th className="p-4 border-b border-gray-200">Fecha / Hora</th>
                  <th className="p-4 border-b border-gray-200">Usuario</th>
                  <th className="p-4 border-b border-gray-200">Acción</th>
                  <th className="p-4 border-b border-gray-200">Entidad</th>
                  <th className="p-4 border-b border-gray-200">ID</th>
                  <th className="p-4 border-b border-gray-200">Detalles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cargando ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="p-4">
                          <div className="h-3 bg-gray-100 rounded-full w-3/4" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-gray-400">
                      <ShieldCheck size={32} className="mx-auto mb-3 opacity-20" />
                      <p className="text-sm font-bold uppercase tracking-widest">Sin registros aún</p>
                    </td>
                  </tr>
                ) : (
                  logs.map((entry) => (
                    <tr
                      key={entry.id}
                      onClick={() => { const r = ENTITY_ROUTES[entry.entity]; if (r) navigate(r); }}
                      className={`hover:bg-gray-50 transition-colors ${ENTITY_ROUTES[entry.entity] ? 'cursor-pointer' : ''}`}
                    >
                      <td className="p-4 text-sm text-gray-500 font-medium whitespace-nowrap">
                        {formatFecha(entry.created_at)}
                      </td>
                      <td className="p-4 text-sm font-bold text-gray-900">
                        {formatUsuario(entry)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${ACTION_STYLES[entry.action] ?? 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                          {entry.action}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-700 font-semibold">{entry.entity}</td>
                      <td className="p-4 text-xs text-gray-400 font-mono">{entry.entity_id}</td>
                      <td className="p-4 text-xs text-gray-500 max-w-xs truncate" title={formatDetails(entry.details)}>
                        {formatDetails(entry.details)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pb-6 shrink-0">
          <button
            onClick={() => void cargar(page - 1)}
            disabled={page <= 1 || cargando}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-bold text-gray-600">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => void cargar(page + 1)}
            disabled={page >= totalPages || cargando}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AuditLog;
