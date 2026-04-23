import { Input } from '../components/ui/Input';
import { usePedidos } from '../hooks/usePedidos';
import { useState } from "react";
import { Select } from '../components/ui/select';
import { Button } from '../components/ui/Button';
import { Eye, Plus, Pencil, Trash2, AlertTriangle, Send, CheckCircle } from 'lucide-react';
import { ModalPedido } from '../pages/ModalPedidos';
import type { EstadoPedido} from '../models/Pedidos';

const Pedidos = () => {
    const {
        vista, setVista,
        tipoPedido, setTipoPedido,
        pedidos, catalogoProductos, catalogoProveedores,
        pedidoActual, setPedidoActual,
        agregarLinea, seleccionarProducto, actualizarLinea, borrarLinea,
        guardarPedido, eliminarPedido
    } = usePedidos();

    const [busqueda, setBusqueda] = useState("");
    const [filtroProveedor, setFiltroProveedor] = useState("todos");

    // 👇 Estados para los Pop-ups personalizados
    const [errorUI, setErrorUI] = useState<string | null>(null);
    const [mostrarConfirmacionEnvio, setMostrarConfirmacionEnvio] = useState(false);
    const [exitoUI, setExitoUI] = useState<string | null>(null); // Nuevo estado para el éxito

    const pedidosFiltrados = pedidos.filter(p => {
        const coincideBusqueda =
            p.proveedor?.toLowerCase().includes(busqueda.toLowerCase()) ||
            p.id_pedido?.toString().includes(busqueda);

        const coincideProveedor =
            filtroProveedor === "todos" || p.proveedor === filtroProveedor;

        return coincideBusqueda && coincideProveedor;
    });

    const estadoClass = (estado: EstadoPedido) => {
        switch (estado) {
            case 'BORRADOR': return 'bg-gray-100 text-gray-600';
            case 'PENDIENTE': return 'bg-blue-100 text-blue-700';
            case 'VALIDADO': return 'bg-indigo-100 text-indigo-700';
            case 'CONFIRMADO': return 'bg-green-100 text-green-700';
            case 'INCOMPLETO': return 'bg-yellow-100 text-yellow-700';
            case 'RECHAZADO': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const cerrarModal = () => setVista('lista');
    
    // Guardar Borrador 
    const manejarGuardarBorrador = async () => {
        if (!pedidoActual.proveedor?.trim()) {
            setErrorUI("Debes seleccionar un proveedor antes de guardar el borrador.");
            return;
        }
        await guardarPedido('BORRADOR');
        cerrarModal();
        setExitoUI("Borrador guardado con éxito."); // Mostramos nuestro pop-up
    };

    // Intentar Enviar Pedido 
    const intentarEnviarPedido = () => {
        if (!pedidoActual.proveedor?.trim()) {
            setErrorUI("Debes seleccionar un proveedor antes de enviar el pedido.");
            return;
        }
        setMostrarConfirmacionEnvio(true);
    };

    // Confirmación final de envío
    const confirmarEnvioPedido = async () => {
        await guardarPedido('PENDIENTE');
        setMostrarConfirmacionEnvio(false);
        cerrarModal();
        setExitoUI("Pedido enviado con éxito."); // Mostramos nuestro pop-up
    };

    return (
        <div className="h-full flex flex-col animate-fade-in-up">
            
            {vista === 'formulario' && (
                <ModalPedido 
                    onClose={cerrarModal}
                    pedidoActual={pedidoActual}
                    setPedidoActual={setPedidoActual}
                    catalogoProveedores={catalogoProveedores}
                    catalogoProductos={catalogoProductos}
                    tipoPedido={tipoPedido}
                    seleccionarProducto={seleccionarProducto}
                    actualizarLinea={actualizarLinea}
                    borrarLinea={borrarLinea}
                    agregarLinea={agregarLinea}
                    guardarBorrador={manejarGuardarBorrador}
                    enviarPedido={intentarEnviarPedido}
                />
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Pedidos a Proveedores</h1>
                    <p className="text-gray-500 mt-1">Gestiona y envía tus órdenes de compra</p>
                </div>
                <div className="w-full md:w-auto">
                    <Button 
                        variant="primario" 
                        onClick={() => { 
                            setPedidoActual({ 
                                id_usuario: 1,
                                proveedor: '', 
                                fecha_pedido: new Date().toISOString().split('T')[0], 
                                estado: 'BORRADOR', 
                                total_estimado: 0, 
                                tipo_pedido: tipoPedido, 
                                observaciones: '', 
                                pedido_ingrediente: [], 
                                pedido_material: [] 
                            }); 
                            setVista('formulario'); 
                        }} 
                        className="w-full md:w-fit px-8 shadow-lg"
                    >
                        <Plus size={16} color="#ffffff" strokeWidth={3} />
                        NUEVO PEDIDO
                    </Button>
                </div>
            </div>

            {/* BARRA DE HERRAMIENTAS */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Input
                        id="search-orders"
                        type="text"
                        placeholder="Buscar por proveedor o ID..."
                        value={busqueda}
                        onChange={(val) => setBusqueda(val)}
                        className="pl-12"
                    />
                </div>

                <div className="min-w-[200px]">
                    <Select
                        id="proveedor-filter"
                        value={filtroProveedor}
                        options={[
                            { value: "todos", label: "Todos los proveedores" },
                            ...catalogoProveedores.map(p => ({ value: p.nombre, label: p.nombre }))
                        ]}
                        onChange={(val) => setFiltroProveedor(val)}
                    />
                </div>
            </div>

            {/* TABLA DE PEDIDOS */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col flex-1">
                <div className="overflow-auto scrollbar-global">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold sticky top-0 z-10">
                            <tr>
                                <th className="p-5 bg-gray-50">ID</th>
                                <th className="p-5 bg-gray-50">Proveedor</th>
                                <th className="p-5 bg-gray-50">Fecha</th>
                                <th className="p-5 text-center bg-gray-50">Estado</th>
                                <th className="p-5 text-right bg-gray-50">Total</th>
                                <th className="p-5 text-center bg-gray-50">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pedidosFiltrados.length > 0 ? (
                                pedidosFiltrados.map(p => (
                                    <tr key={p.id_pedido} className="hover:bg-gray-50 transition group">
                                        <td className="p-5 font-mono text-xs text-gray-500">{p.id_pedido}</td>
                                        <td className="p-5 font-medium text-gray-900">{p.proveedor}</td>
                                        <td className="p-5 text-gray-600">{p.fecha_pedido ? new Date(p.fecha_pedido).toLocaleDateString() : '-'}</td>
                                        <td className="p-5 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${estadoClass(p.estado)}`}>{p.estado}</span>
                                        </td>
                                        <td className="p-5 text-right font-bold text-gray-800">{Number(p.total_estimado || 0).toFixed(2)} €</td>
                                        <td className="p-5 text-right flex justify-end items-center gap-4">
                                            <button 
                                                onClick={() => {
                                                    setPedidoActual({
                                                        ...p,
                                                        total_estimado: Number(p.total_estimado ?? 0),
                                                        pedido_ingrediente: (p.pedido_ingrediente || []).map((linea) => ({
                                                            ...linea,
                                                            cantidad_solicitada: Number(linea.cantidad_solicitada ?? 0),
                                                            cantidad_recibida: Number(linea.cantidad_recibida ?? 0)
                                                        })),
                                                        pedido_material: (p.pedido_material || []).map((linea) => ({
                                                            ...linea,
                                                            cantidad_solicitada: Number(linea.cantidad_solicitada ?? 0),
                                                            cantidad_recibida: Number(linea.cantidad_recibida ?? 0)
                                                        }))
                                                    });
                                                    setTipoPedido(p.tipo_pedido === 'utensilios' ? 'utensilios' : 'productos');
                                                    setVista('formulario');
                                                }} 
                                                className="
                                                    inline-flex items-center gap-2 
                                                    px-5 py-2.5 rounded-xl 
                                                    font-bold text-xs tracking-tight 
                                                    transition-all duration-200
                                                    bg-blue-50 text-blue-600 border border-blue-100/50
                                                    hover:bg-blue-600 hover:text-white 
                                                    hover:border-blue-600
                                                    hover:shadow-lg hover:shadow-blue-600/20
                                                    hover:-translate-y-0.5
                                                    active:scale-95
                                                "
                                            >
                                                {p.estado === 'BORRADOR' ? (
                                                    <Pencil size={16} strokeWidth={3} />
                                                ) : (
                                                    <Eye size={16} strokeWidth={3} />
                                                )}
                                                <span>{p.estado === 'BORRADOR' ? 'Editar' : 'Ver'}</span>
                                            </button>
                                            {p.estado === 'BORRADOR' && (
                                               <button 
                                                    onClick={() => eliminarPedido(p.id_pedido!)} 
                                                    className="
                                                        p-2.5 
                                                        text-gray-300 hover:text-red-600 
                                                        hover:bg-red-50 rounded-xl 
                                                        transition-all duration-200
                                                        active:scale-90
                                                    " 
                                                    title="Eliminar borrador"
                                                >
                                                    <Trash2 size={18} strokeWidth={2.5} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={6} className="p-10 text-center text-gray-400">No se encontraron pedidos de {tipoPedido}.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* POP-UP DE ERROR (Falta Proveedor) */}
            {errorUI && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-fade-in-up border border-gray-100 p-8 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-5 shadow-inner">
                            <AlertTriangle size={32} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">¡Falta información!</h3>
                        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                            {errorUI}
                        </p>
                        <Button 
                            variant="primario" 
                            onClick={() => setErrorUI(null)} 
                            className="w-full py-3 font-bold shadow-md shadow-red-200"
                        >
                            ENTENDIDO
                        </Button>
                    </div>
                </div>
            )}

            {/* POP-UP DE CONFIRMACIÓN DE ENVÍO */}
            {mostrarConfirmacionEnvio && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-fade-in-up border border-gray-100 p-8 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-5 shadow-inner">
                            <Send size={32} strokeWidth={2.5} className="ml-1" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">¿Enviar Pedido?</h3>
                        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                            ¿Estás seguro de enviar este pedido a <span className="font-bold text-gray-800">{pedidoActual.proveedor}</span>? Pasará a estado <span className="font-bold text-red-600">PENDIENTE</span> y el borrador se cerrará.
                        </p>
                        <div className="flex gap-3 w-full">
                            <Button 
                                variant="gris" 
                                onClick={() => setMostrarConfirmacionEnvio(false)} 
                                className="flex-1 py-3 font-bold"
                            >
                                CANCELAR
                            </Button>
                            <Button 
                                variant="primario" 
                                onClick={confirmarEnvioPedido} 
                                className="flex-1 py-3 font-bold !bg-red-600 hover:!bg-red-700 shadow-md shadow-red-200"
                            >
                                SÍ, ENVIAR
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* 👇 NUEVO POP-UP DE ÉXITO */}
            {exitoUI && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-fade-in-up border border-gray-100 p-8 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-5 shadow-inner">
                            <CheckCircle size={32} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">¡Completado!</h3>
                        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                            {exitoUI}
                        </p>
                        <Button 
                            variant="primario" 
                            onClick={() => setExitoUI(null)} 
                            className="w-full py-3 font-bold !bg-green-600 hover:!bg-green-700 shadow-md shadow-green-200"
                        >
                            ACEPTAR
                        </Button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Pedidos;