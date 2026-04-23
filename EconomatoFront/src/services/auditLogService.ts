import { authFetch } from './auth-service';

export interface AuditLogEntry {
  id: string;
  action: string;
  entity: string;
  entity_id: string;
  details: Record<string, unknown> | null;
  id_usuario: number | null;
  created_at: string;
  usuario: {
    nombre: string;
    apellido1: string;
    email: string | null;
  } | null;
}

export interface AuditLogResponse {
  data: AuditLogEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getAuditLogs = async (page = 1, limit = 50): Promise<AuditLogResponse> => {
  const res = await authFetch(`/api/audit-logs?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Error cargando el historial de auditoría');
  return res.json();
};
