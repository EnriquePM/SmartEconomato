import { useEffect, useMemo, useState } from "react";
import type { Pedido } from "../models/Pedidos";
import { getPedidoByIdService, getPedidosService } from "../services/pedidoService";

export const useRecepcion = () => {
	const [pedidos, setPedidos] = useState<Pedido[]>([]);
	const [cargando, setCargando] = useState(true);
	const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);
	const [abriendoPedidoId, setAbriendoPedidoId] = useState<number | null>(null);
	const [busqueda, setBusqueda] = useState("");
	const [filtroEstado, setFiltroEstado] = useState("todos");
	const [errorUI, setErrorUI] = useState<string | null>(null);
  	const [exitoUI, setExitoUI] = useState<string | null>(null);
  	const [confirmarFinalizar, setConfirmarFinalizar] = useState(false);

	const refrescarLista = async () => {
		try {
			setCargando(true);
			const data = await getPedidosService();
			setPedidos(data);

			setPedidoSeleccionado((prev) => {
				if (!prev?.id_pedido) {
					return prev;
				}

				return data.find((pedido) => pedido.id_pedido === prev.id_pedido) ?? prev;
			});

			return data;
		} catch (error) {
			console.error("Error al refrescar:", error);
			setPedidos([]);
			return [];
		} finally {
			setCargando(false);
		}
	};

	const abrirPedido = async (idPedido: number) => {
		try {
			setAbriendoPedidoId(idPedido);
			const pedidoDetalle = await getPedidoByIdService(idPedido);
			setPedidoSeleccionado(pedidoDetalle);
		} catch (error) {
			console.error("Error al abrir pedido:", error);
			setErrorUI("No se pudo cargar el detalle del pedido. Revisa la conexión.");
		} finally {
			setAbriendoPedidoId(null);
		}
	};

	const guardarCambiosLocal = (pedidoActualizado: Pedido) => {
		setPedidos((prev) => prev.map((p) =>
			p.id_pedido === pedidoActualizado.id_pedido ? pedidoActualizado : p
		));
		setPedidoSeleccionado(pedidoActualizado);
	};

	const pedidosFiltrados = useMemo(() => {
		return pedidos.filter((p) => {
			const proveedor = (p.proveedor ?? "").toLowerCase();
			const coincideBusqueda =
				proveedor.includes(busqueda.toLowerCase()) ||
				p.id_pedido?.toString().includes(busqueda);

			const coincideEstado = filtroEstado === "todos" || p.estado === filtroEstado;
			return coincideBusqueda && coincideEstado;
		});
	}, [pedidos, busqueda, filtroEstado]);

	useEffect(() => {
		refrescarLista();
	}, []);

	return {
		pedidosFiltrados,
		cargando,
		pedidoSeleccionado,
		abriendoPedidoId,
		busqueda,
		setBusqueda,
		filtroEstado,
		setFiltroEstado,
		abrirPedido,
		refrescarLista,
		guardarCambiosLocal,
		errorUI,
		setErrorUI,
		exitoUI,
		setExitoUI,
		confirmarFinalizar,
		setConfirmarFinalizar,
		cerrarModal: () => setPedidoSeleccionado(null),
	};
};
