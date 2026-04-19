export interface OffLookupResult {
  found: boolean;
  nombre?: string;
}

export const buscarProductoOpenFoodFacts = async (codigo: string): Promise<OffLookupResult> => {
  const respuesta = await fetch(`https://world.openfoodfacts.org/api/v0/product/${codigo}.json`);
  const data = await respuesta.json();

  if (data.status === 1) {
    const productoOFF = data.product;
    return {
      found: true,
      nombre: productoOFF.product_name_es || productoOFF.product_name || ''
    };
  }

  return { found: false };
};
