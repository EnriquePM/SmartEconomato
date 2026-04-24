import { authFetch } from './auth-service';

export interface IngresoIngredientePayload {
  nombre: string;
  stock: number;
  id_categoria: number;
  id_proveedor: number;
  precio_unidad: number;
  unidad_medida: string;
  fecha_caducidad?: string;
}

export interface IngresoMaterialPayload {
  nombre: string;
  stock: number;
  id_categoria: number;
  precio_unidad: number;
  unidad_medida: string;
}

const createEntry = async <T>(endpoint: string, payload: T) => {
  const res = await authFetch(`/api/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    let backendError = 'Error en el guardado';
    try {
      const errorData = await res.json();
      if (errorData?.error) {
        backendError = errorData.error;
      }
    } catch {
      // Se usa mensaje por defecto si no se puede parsear el body.
    }
    throw new Error(backendError);
  }

  return res.json();
};

export const createIngredienteEntry = (payload: IngresoIngredientePayload) =>
  createEntry('ingredientes', payload);

export const createMaterialEntry = (payload: IngresoMaterialPayload) =>
  createEntry('materiales', payload);
