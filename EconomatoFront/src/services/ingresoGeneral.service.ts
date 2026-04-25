import { authFetch } from './auth-service';

export interface IngresoIngredientePayload {
  nombre: string;
  stock: number;
  id_categoria: number;
  id_proveedor: number;
  precio_unidad: number;
  unidad_medida: string;
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

export interface UpdateIngredientePayload {
  nombre?: string;
  stock?: number;
  stock_minimo?: number;
  id_categoria?: number;
  id_proveedor?: number;
  precio_unidad?: number;
  unidad_medida?: string;
  alergenosIds?: number[];
}

export interface UpdateMaterialPayload {
  nombre?: string;
  stock?: number;
  stock_minimo?: number;
  id_categoria?: number;
  precio_unidad?: number;
  unidad_medida?: string;
}

const updateEntry = async <T>(endpoint: string, id: number | string, payload: T) => {
  const res = await authFetch(`/api/${endpoint}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    let backendError = 'Error al actualizar';
    try {
      const errorData = await res.json();
      if (errorData?.error) backendError = errorData.error;
    } catch { }
    throw new Error(backendError);
  }

  return res.json();
};

export const updateIngredienteEntry = (id: number | string, payload: UpdateIngredientePayload) =>
  updateEntry('ingredientes', id, payload);

export const updateMaterialEntry = (id: number | string, payload: UpdateMaterialPayload) =>
  updateEntry('materiales', id, payload);
