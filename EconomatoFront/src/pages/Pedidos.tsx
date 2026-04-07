import { Input } from '../components/ui/Input';
import { usePedidos } from '../hooks/usePedidos';
import { useState } from "react";
import { Select } from '../components/ui/Select';
import type { EstadoPedido, PedidoIngrediente, PedidoMaterial } from '../models/Pedidos';

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

    const pedidosFiltrados = pedidos.filter(p => {
    const coincideBusqueda =
        p.proveedor?.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.id_pedido?.toString().includes(busqueda);

    const coincideProveedor =
        filtroProveedor === "todos" || p.proveedor === filtroProveedor;

    return coincideBusqueda && coincideProveedor;
    });

    const esSoloLectura = pedidoActual.estado !== 'BORRADOR' && pedidoActual.id_pedido !== undefined;
    const titulo = tipoPedido === 'productos' ? 'Productos' : 'Utensilios';

    const proveedorSeleccionado = !!pedidoActual.proveedor?.trim();
    const lineasValidas = (tipoPedido === 'productos' ? pedidoActual.pedido_ingrediente || [] : pedidoActual.pedido_material || []).filter((linea) => {
        const itemId = tipoPedido === 'productos'
            ? (linea as PedidoIngrediente).id_ingrediente
            : (linea as PedidoMaterial).id_material;

        return Number(itemId) > 0 && Number(linea.cantidad_solicitada) > 0;
    });

    const guardarBorrador = () => {
        if (!proveedorSeleccionado) return alert("Selecciona un proveedor antes de guardar el pedido");
        if (lineasValidas.length === 0) return alert("Añade al menos una línea válida antes de guardar el pedido");
        guardarPedido('BORRADOR');
    };

    const enviarPedido = () => {
        if (!proveedorSeleccionado) return alert("Selecciona un proveedor antes de enviar el pedido");
        if (lineasValidas.length === 0) return alert("Añade al menos un producto");
        if (confirm("¿Enviar pedido al proveedor? Pasará a estado PENDIENTE.")) {
            guardarPedido('PENDIENTE');
        }
    };

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

    if (vista === 'formulario') {
        const lineas: (PedidoIngrediente | PedidoMaterial)[] = tipoPedido === 'productos'
            ? pedidoActual.pedido_ingrediente || []
            : pedidoActual.pedido_material || [];

        return (
            <div className="flex flex-col animate-fade-in-up space-y-6 pb-6">
                {/* Cabecera */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 shrink-0 gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setVista('lista')}
                            className="group flex items-center gap-2 text-gray-400 hover:text-black transition-colors duration-200 font-bold text-sm"
                        >
                            ← VOLVER
                        </button>
                        <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                {pedidoActual.id_pedido ? `Pedido #${pedidoActual.id_pedido}` : `Nuevo Pedido de ${titulo}`}
                            </h2>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black tracking-widest uppercase bg-gray-100 text-gray-500`}>
                                {pedidoActual.estado || 'NUEVO'}
                            </span>
                        </div>
                    </div>
                    {!esSoloLectura && (
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="flex items-center bg-gray-100 p-1.5 rounded-pill shadow-inner w-full md:w-auto border border-gray-200/50">
                                <button onClick={guardarBorrador} className="px-6 py-2.5 text-gray-600 rounded-pill font-bold text-xs hover:text-black transition-all duration-200 flex-1 md:flex-none uppercase tracking-wider">Guardar Borrador</button>
                                <button onClick={enviarPedido} className="px-8 py-2.5 bg-black text-white rounded-pill font-bold text-xs hover:bg-gray-800 transition-all duration-200 shadow-md active:scale-95 flex-1 md:flex-none uppercase tracking-wider">Enviar Pedido</button>
                            </div>
                        </div>
                    )}
                    {pedidoActual.estado === 'PENDIENTE' && (
                        <button className="bg-green-600 text-white px-6 py-2 rounded-pill font-bold">
                            Recibir Mercancía
                        </button>
                    )}  
                </div>

                {/* Formulario principal */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-6 items-end mb-6">
                        <div className="w-full md:w-1/3">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Proveedor ({titulo})</label>
                            <div className="relative">
                                <select
                                    className="w-full bg-input border-none rounded-pill py-4 px-6 text-gray-700 focus:ring-2 focus:ring-slate-200 outline-none transition-all appearance-none"
                                    value={pedidoActual.proveedor || ""}
                                    onChange={(e) => setPedidoActual({ ...pedidoActual, proveedor: e.target.value })}
                                    disabled={esSoloLectura}
                                >
                                    <option value="">Selecciona proveedor...</option>
                                    {catalogoProveedores.map((p: any) => (
                                        <option key={p.id_proveedor} value={p.nombre}>{p.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="w-full md:w-1/3">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Fecha Pedido</label>
                            <input
                                type="date"
                                className="w-full bg-input border-none rounded-pill py-4 px-6 text-gray-700 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                                value={pedidoActual.fecha_pedido ? new Date(pedidoActual.fecha_pedido).toISOString().split('T')[0] : ""}
                                onChange={(e) => setPedidoActual({ ...pedidoActual, fecha_pedido: e.target.value })}
                                disabled={esSoloLectura}
                            />
                        </div>
                        <div className="w-full md:w-1/3 text-right pb-4">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Total Estimado</label>
                            <div className="text-4xl font-black text-gray-900">{Number(pedidoActual.total_estimado ?? 0).toFixed(2)} €</div>
                        </div>
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Observaciones / Notas</label>
                        <textarea
                            className="w-full bg-input border-none rounded-2xl py-4 px-6 text-gray-700 focus:ring-2 focus:ring-slate-200 outline-none transition-all placeholder:text-secundario/50 resize-none h-20"
                            placeholder="Ej: Llamar antes de entregar..."
                            value={pedidoActual.observaciones || ""}
                            onChange={(e) => setPedidoActual({ ...pedidoActual, observaciones: e.target.value })}
                            disabled={esSoloLectura}
                        />
                    </div>
                </div>

                {/* Tabla de líneas */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100"><h3 className="text-lg font-bold text-gray-800">Lista de {titulo}</h3></div>
                    <div className="overflow-x-auto scrollbar-global p-1">
                        <table className="w-full border-separate border-spacing-0">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold sticky top-0 z-10">
                                <tr>
                                    <th className="p-4 text-left bg-gray-50">Item</th>
                                    <th className="p-4 text-center w-32 bg-gray-50">Cant.</th>
                                    <th className="p-4 text-right bg-gray-50">Subtotal</th>
                                    <th className="p-4 w-10 bg-gray-50"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {lineas.map((linea, index) => {
                                    const itemId = tipoPedido === 'productos' ? (linea as PedidoIngrediente).id_ingrediente : (linea as PedidoMaterial).id_material;
                                    const cantidad = (linea as PedidoIngrediente | PedidoMaterial).cantidad_solicitada;
                                    const prod = catalogoProductos.find(p => p.id === itemId);
                                    const subtotal = (prod?.precio || 0) * cantidad;

                                    return (
                                        <tr key={index} className="hover:bg-gray-50 group transition-colors duration-150">
                                            <td className="p-3 w-1/3">
                                                <select
                                                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-black"
                                                    value={itemId}
                                                    onChange={(e) => seleccionarProducto(index, Number(e.target.value))}
                                                    disabled={esSoloLectura}
                                                >
                                                    <option value={0}>Selecciona {titulo.slice(0, -1)}</option>
                                                    {catalogoProductos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                                                </select>
                                            </td>
                                            <td className="p-3 w-32 text-center">
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    placeholder="0"
                                                    value={cantidad}
                                                    onChange={(val) => actualizarLinea(index, Number(val))}
                                                />
                                            </td>
                                            <td className="p-3 text-right font-bold">{subtotal.toFixed(2)} €</td>
                                            <td className="p-3 text-center">
                                                {!esSoloLectura && (
                                                    <button onClick={() => borrarLinea(index)} className="text-gray-300 hover:text-red-500 transition-colors font-bold text-xl p-2 rounded-full hover:bg-red-50">❌</button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {lineas.length === 0 && <tr><td colSpan={4} className="p-10 text-center text-gray-400">No hay {titulo.toLowerCase()} en el pedido.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                    {!esSoloLectura && (
                        <div className="p-4 border-t border-gray-100 bg-gray-50">
                            <button onClick={agregarLinea} className="w-full py-3 bg-white text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition border border-dashed border-gray-300 hover:border-gray-400 flex items-center justify-center gap-2">
                                ➕ Añadir {titulo.slice(0, -1)}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Lista de pedidos
    return (
        <div className="h-full flex flex-col animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Pedidos a Proveedores</h1>
                    <p className="text-gray-500 mt-1">Gestiona y envía tus órdenes de compra</p>
                </div>
                <div className="w-full md:w-auto">
                    <button onClick={() => { 
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
                    }} className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-pill font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95 w-full md:w-fit">➕ NUEVO PEDIDO</button>
                </div>
            </div>

            {/* BARRA DE HERRAMIENTAS - BUSCAR Y FILTRAR POR PROVEEDOR */}
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
                                <th className="p-5 text-right bg-gray-50">Acciones</th>
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
                                                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                            >
                                                {p.estado === 'BORRADOR' ? 'Editar' : 'Ver'}
                                            </button>
                                            {p.estado === 'BORRADOR' && (
                                                <button onClick={() => eliminarPedido(p.id_pedido!)} className="text-gray-400 hover:text-red-500 transition-colors" title="Eliminar borrador">❌</button>
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
        </div>
    );
};

export default Pedidos;