import { authFetch } from './auth-service';
import type { RegistroActividad } from '../models/actividad.model';

const API_URL = '/api';

export const getActividades = async (): Promise<RegistroActividad[]> => {
  const res = await authFetch(`${API_URL}/actividades`);
  if (!res.ok) throw new Error('Error al cargar actividades');
  return res.json();
};
