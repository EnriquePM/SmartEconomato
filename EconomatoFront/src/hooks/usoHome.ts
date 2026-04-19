import { useEffect, useState } from 'react';
import { getAvisosStock } from '../services/inventarioService';
import { getPedidosPendientes } from '../services/pedidoService';
import { recetaService } from '../services/recetaService';
import type { AvisoStock } from '../models/ItemInventario';
import type { Pedido } from '../models/Pedidos';
import type { Receta } from '../models/Receta';
import type { Usuario } from '../models/user.model';

export const useHome = () => {
  const [avisos, setAvisos] = useState<AvisoStock[]>([]);
  const [loadingAvisos, setLoadingAvisos] = useState(true);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [loadingRecetas, setLoadingRecetas] = useState(true);
  const [temperatura, setTemperatura] = useState<number | null>(null);
  const [user, setUser] = useState<Usuario | null>(null);

  useEffect(() => {

    const dataUser = localStorage.getItem('usuario');
    if (dataUser) {
      setUser(JSON.parse(dataUser));
    }

    getAvisosStock()
      .then(setAvisos)
      .finally(() => setLoadingAvisos(false));

    getPedidosPendientes()
      .then(setPedidos)
      .finally(() => setLoadingPedidos(false));

    recetaService.getAll()
      .then(data => setRecetas(data.slice(0, 4)))
      .finally(() => setLoadingRecetas(false));

    // Las latitudes son de La Laguna para conocer el tiempo. 
    fetch('https://api.open-meteo.com/v1/forecast?latitude=28.4853&longitude=-16.3197&current_weather=true')
      .then(res => res.json())
      .then(data => setTemperatura(Math.round(data.current_weather.temperature)))
      .catch(() => setTemperatura(null));
  }, []);

  return { user, avisos, loadingAvisos, pedidos, loadingPedidos, recetas, loadingRecetas, temperatura };
};