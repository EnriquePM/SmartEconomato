import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { usePedidos } from '../hooks/usePedidos';

const Pedidos = () => {
    // Usamos el Hook para obtener toda la lógica y estado
    const {
        vista, setVista,
        tipoPedido, setTipoPedido,
        busqueda, setBusqueda,
        pedidos, catalogoProductos, catalogoProveedores,
        pedidoActual, setPedidoActual,
        agregarLinea, seleccionarProducto, actualizarLinea, borrarLinea,
        guardarPedido, eliminarPedido
    } = usePedidos();

    // Lógica de filtrado visual (se mantiene ligera aquí)
    const pedidosFiltrados = pedidos?.filter(p => {
        const coincideTipo = p.tipo === tipoPedido; 
        const coincideBusqueda = 
            p.proveedor?.toLowerCase().includes(busqueda.toLowerCase()) ||
            p.id.toString().includes(busqueda.toLowerCase());
        return coincideTipo && coincideBusqueda;
    });

    const esSoloLectura = pedidoActual.estado !== 'BORRADOR' && pedidoActual.estado !== ''; 
    const titulo = tipoPedido === 'productos' ? 'Productos' : 'Utensilios';

    // Funciones wrappers para los botones
    const guardarBorrador = () => guardarPedido('BORRADOR');
    
    const enviarPedido = () => {
        if (pedidoActual.lineas.length === 0) return alert("Añade al menos un producto");
        if (confirm("¿Enviar pedido al proveedor? Pasará a estado PENDIENTE.")) {
            guardarPedido('PENDIENTE');
        }
    };

    // --- RENDERIZADO DEL FORMULARIO ---
    if (vista === 'formulario') {
        return (
            <div className="flex flex-col animate-fade-in-up space-y-6 pb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 shrink-0 gap-4">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setVista('lista')}
                            className="group flex items-center gap-2 text-gray-400 hover:text-black transition-colors duration-200 font-bold text-sm"
                        >
                            <span>← VOLVER</span>
                        </button>
                        <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                {pedidoActual.id ? `Pedido #${pedidoActual.id}` : `Nuevo Pedido de ${titulo}`}
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
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-6 items-end mb-6">
                        <div className="w-full md:w-1/3">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Proveedor ({titulo})</label>
                            <div className="relative">
                                <select
                                    className="w-full bg-input border-none rounded-pill py-4 px-6 text-gray-700 focus:ring-2 focus:ring-slate-200 outline-none transition-all appearance-none"
                                    value={pedidoActual.proveedor}
                                    onChange={(e) => setPedidoActual({...pedidoActual, proveedor: e.target.value})}
                                    disabled={esSoloLectura}
                                >
                                    <option value="">Selecciona proveedor...</option>
                                    {catalogoProveedores.map((p: any) => (
                                        <option key={p.id_proveedor || p.id} value={p.nombre}>{p.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="w-full md:w-1/3">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Fecha Pedido</label>
                            <input type="date" className="w-full bg-input border-none rounded-pill py-4 px-6 text-gray-700 focus:ring-2 focus:ring-slate-200 outline-none transition-all" value={pedidoActual.fecha} onChange={(e) => setPedidoActual({...pedidoActual, fecha: e.target.value})} disabled={esSoloLectura} />
                        </div>
                        <div className="w-full md:w-1/3 text-right pb-4">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Total Estimado</label>
                            <div className="text-4xl font-black text-gray-900">{pedidoActual.total.toFixed(2)} €</div>
                        </div>
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Observaciones / Notas</label>
                        <textarea className="w-full bg-input border-none rounded-2xl py-4 px-6 text-gray-700 focus:ring-2 focus:ring-slate-200 outline-none transition-all placeholder:text-secundario/50 resize-none h-20" placeholder="Ej: Llamar antes de entregar..." value={pedidoActual.observaciones} onChange={(e) => setPedidoActual({...pedidoActual, observaciones: e.target.value})} disabled={esSoloLectura} />
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100"><h3 className="text-lg font-bold text-gray-800">Lista de {titulo}</h3></div>
                    <div className="overflow-x-auto scrollbar-global p-1">
                        <table className="w-full border-separate border-spacing-0">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold sticky top-0 z-10">
                                <tr>
                                    <th className="p-4 text-left bg-gray-50">Item</th>
                                    <th className="p-4 text-left bg-gray-50">Categoría</th>
                                    <th className="p-4 text-center w-32 bg-gray-50">Cant.</th>
                                    <th className="p-4 text-center bg-gray-50">Unidad</th>
                                    <th className="p-4 text-center w-32 bg-gray-50">Precio</th>
                                    <th className="p-4 text-right bg-gray-50">Subtotal</th>
                                    <th className="p-4 w-10 bg-gray-50"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {pedidoActual.lineas.map((linea) => (
                                    <tr key={linea.id} className="hover:bg-gray-50 group transition-colors duration-150">
                                        <td className="p-3 w-1/3 align-middle">
                                            <select className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-black" value={linea.productoId} onChange={(e) => seleccionarProducto(linea.id, e.target.value)} disabled={esSoloLectura}>
                                                <option value={0}>Buscar {titulo.toLowerCase().slice(0, -1)}...</option>
                                                {catalogoProductos.map((p: any) => (
                                                    <option key={p.id} value={p.id}>{p.nombre}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-3 align-middle"><span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{linea.categoria || '-'}</span></td>
                                        <td className="p-3 w-32 align-middle"><Input id={`cant-${linea.id}`} type="text" placeholder="0" value={linea.cantidad.toString()} onChange={(val) => actualizarLinea(linea.id, 'cantidad', val)} /></td>
                                        <td className="p-3 text-center text-sm text-gray-500 align-middle">{linea.unidad || '-'}</td>
                                        <td className="p-3 w-32 align-middle"><Input id={`precio-${linea.id}`} type="text" placeholder="0.00" value={linea.precio.toString()} onChange={(val) => actualizarLinea(linea.id, 'precio', val)} /></td>
                                        <td className="p-3 text-right font-bold text-gray-800 align-middle">{linea.subtotal.toFixed(2)} €</td>
                                        <td className="p-3 text-center align-middle">
                                            {!esSoloLectura && (
                                                <button onClick={() => borrarLinea(linea.id)} className="text-gray-300 hover:text-red-500 transition-colors font-bold text-xl p-2 rounded-full hover:bg-red-50">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {pedidoActual.lineas.length === 0 && <div className="p-10 text-center text-gray-400">No hay {titulo.toLowerCase()} en el pedido.</div>}
                    </div>
                    {!esSoloLectura && (
                        <div className="p-4 border-t border-gray-100 bg-gray-50">
                            <button onClick={agregarLinea} className="w-full py-3 bg-white text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition border border-dashed border-gray-300 hover:border-gray-400 flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                Añadir {titulo.slice(0, -1)}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // --- RENDERIZADO DEL LISTADO ---
    return (
        <div className="h-full flex flex-col animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Pedidos a Proveedores</h1>
                    <p className="text-gray-500 mt-1">Gestiona y envía tus órdenes de compra</p>
                </div>
                <div className="w-full md:w-auto">
                    <button onClick={() => { setPedidoActual({ id: '', tipo: tipoPedido, proveedor: '', fecha: new Date().toISOString().split('T')[0], estado: 'BORRADOR', total: 0, observaciones: '', lineas: [] }); setVista('formulario'); }} className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-pill font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95 w-full md:w-fit"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>NUEVO PEDIDO</button>
                </div>
            </div>

            <div className="flex gap-2 mt-8 pl-2 relative items-end">
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-200 z-0"></div>
                <button onClick={() => setTipoPedido('productos')} className={`px-8 py-4 rounded-t-[1.5rem] text-sm font-bold transition-all relative z-10 border-t border-l border-r ${tipoPedido === 'productos' ? 'bg-white text-red-600 border-gray-200 border-b-white -mb-px pt-4 shadow-[0_-2px_3px_rgba(0,0,0,0.02)]' : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200 py-3'}`}>PRODUCTOS</button>
                <button onClick={() => setTipoPedido('utensilios')} className={`px-8 py-4 rounded-t-[1.5rem] text-sm font-bold transition-all relative z-10 border-t border-l border-r ${tipoPedido === 'utensilios' ? 'bg-white text-red-600 border-gray-200 border-b-white -mb-px pt-4 shadow-[0_-2px_3px_rgba(0,0,0,0.02)]' : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200 py-3'}`}>UTENSILIOS</button>
            </div>

            <div className="mb-6 w-full max-w-md mt-6">
                <Input id="search-orders" type="text" placeholder="Buscar por proveedor o ID..." value={busqueda} onChange={setBusqueda} />
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
                            {pedidosFiltrados && pedidosFiltrados.length > 0 ? (
                                pedidosFiltrados.map((pedido) => (
                                    <tr key={pedido.id} className="hover:bg-gray-50 transition group">
                                        <td className="p-5 font-mono text-xs text-gray-500">{pedido.id}</td>
                                        <td className="p-5 font-medium text-gray-900">{pedido.proveedor}</td>
                                        <td className="p-5 text-gray-600">{pedido.fecha}</td>
                                        <td className="p-5 text-center"><span className={`px-3 py-1 rounded-full text-xs font-bold ${pedido.estado === 'PENDIENTE' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'}`}>{pedido.estado}</span></td>
                                        <td className="p-5 text-right font-bold text-gray-800">{pedido.total.toFixed(2)} €</td>
                                        <td className="p-5 text-right flex justify-end items-center gap-4">
                                            <button onClick={() => { setPedidoActual(pedido); setVista('formulario'); }} className="text-blue-600 hover:text-blue-800 font-medium text-sm">{pedido.estado === 'BORRADOR' ? 'Editar' : 'Ver'}</button>
                                            {pedido.estado === 'BORRADOR' && (
                                                <button onClick={(e) => { e.stopPropagation(); eliminarPedido(pedido.id); }} className="text-gray-400 hover:text-red-500 transition-colors" title="Eliminar borrador"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
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