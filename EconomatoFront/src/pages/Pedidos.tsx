import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

// --- TIPOS ---
type LineaPedido = {
    id: number;
    productoId: number;
    nombre: string;
    categoria: string;
    unidad: string;
    cantidad: number;
    precio: number;
    subtotal: number;
};

type Pedido = {
    id: string;
    tipo: 'productos' | 'utensilios';
    proveedor: string;
    fecha: string;
    estado: 'Borrador' | 'Enviado';
    total: number;
    observaciones: string;
    lineas: LineaPedido[];
};

const Pedidos = () => {
    // --- ESTADOS DE LA VISTA ---
    const [vista, setVista] = useState<'lista' | 'formulario'>('lista');
    const [tipoPedido, setTipoPedido] = useState<'productos' | 'utensilios'>('productos');
    const [busqueda, setBusqueda] = useState('');

    // --- ESTADOS DE DATOS (CONECTADOS A DB.JSON) ---
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [catalogoProductos, setCatalogoProductos] = useState<any[]>([]);
    const [catalogoProveedores, setCatalogoProveedores] = useState<any[]>([]);

    const [pedidoActual, setPedidoActual] = useState<Pedido>({
        id: '',
        tipo: 'productos',
        proveedor: '',
        fecha: new Date().toISOString().split('T')[0],
        estado: 'Borrador',
        total: 0,
        observaciones: '',
        lineas: []
    });

    // --- EFECTO: CARGA INICIAL DE PEDIDOS ---
    useEffect(() => {
        fetch('http://localhost:3000/pedidos')
            .then(res => res.json())
            .then(data => setPedidos(data))
            .catch(err => console.error("Error cargando pedidos:", err));
    }, []);

    // --- EFECTO: CARGA DE CATÁLOGOS SEGÚN TIPO DE PEDIDO ---
    useEffect(() => {
        // Determinamos los endpoints basándonos en el db.json unificado
        const prodEndpoint = tipoPedido === 'productos' ? 'catalogo_productos' : 'utensilios';
        const provEndpoint = tipoPedido === 'productos' ? 'proveedores' : 'proveedores_utensilios';

        // Carga de productos/utensilios
        fetch(`http://localhost:3000/${prodEndpoint}`)
            .then(res => res.json())
            .then(data => setCatalogoProductos(data))
            .catch(err => console.error("Error cargando catálogo:", err));

        // Carga de proveedores
        fetch(`http://localhost:3000/${provEndpoint}`)
            .then(res => res.json())
            .then(data => setCatalogoProveedores(data))
            .catch(err => console.error("Error cargando proveedores:", err));

    }, [tipoPedido]);

    // --- LÓGICA DE FILTRADO ---
    const pedidosFiltrados = pedidos.filter(p =>
        p.tipo === tipoPedido && 
        (p.proveedor.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.id.toLowerCase().includes(busqueda.toLowerCase()))
    );

    // --- LÓGICA DEL FORMULARIO ---
    const agregarLinea = () => {
        const nuevaLinea: LineaPedido = {
            id: Date.now(),
            productoId: 0,
            nombre: '',
            categoria: '',
            unidad: '',
            cantidad: 1,
            precio: 0,
            subtotal: 0
        };
        setPedidoActual({
            ...pedidoActual,
            lineas: [...pedidoActual.lineas, nuevaLinea]
        });
    };

    const seleccionarProducto = (lineaId: number, prodId: string) => {
        const producto = catalogoProductos.find(p => p.id.toString() === prodId.toString());
        if (!producto) return;

        const lineasActualizadas = pedidoActual.lineas.map(linea => {
            if (linea.id === lineaId) {
                return {
                    ...linea,
                    productoId: producto.id,
                    nombre: producto.nombre,
                    categoria: producto.categoria,
                    unidad: producto.unidad,
                    precio: producto.precioUltimo,
                    subtotal: 1 * producto.precioUltimo
                };
            }
            return linea;
        });
        recalcularTotal(lineasActualizadas);
    };

    const actualizarLinea = (lineaId: number, campo: 'cantidad' | 'precio', valorTexto: string) => {
        const valorNumerico = parseFloat(valorTexto) || 0;
        const lineasActualizadas = pedidoActual.lineas.map(linea => {
            if (linea.id === lineaId) {
                const nuevaLinea = { ...linea, [campo]: valorNumerico };
                nuevaLinea.subtotal = nuevaLinea.cantidad * nuevaLinea.precio;
                return nuevaLinea;
            }
            return linea;
        });
        recalcularTotal(lineasActualizadas);
    };

    const recalcularTotal = (nuevasLineas: LineaPedido[]) => {
        const nuevoTotal = nuevasLineas.reduce((acc, curr) => acc + curr.subtotal, 0);
        setPedidoActual({ ...pedidoActual, lineas: nuevasLineas, total: nuevoTotal });
    };

    const borrarLinea = (lineaId: number) => {
        const nuevasLineas = pedidoActual.lineas.filter(l => l.id !== lineaId);
        recalcularTotal(nuevasLineas);
    };

    const eliminarPedido = (id: string) => {
        if (confirm("¿Estás seguro de eliminar este borrador?")) {
            // Aquí se podría añadir un fetch DELETE a http://localhost:3000/pedidos/${id}
            setPedidos(pedidos.filter(p => p.id !== id));
        }
    };

    const guardarBorrador = () => {
        if (!pedidoActual.proveedor) return alert("Selecciona un proveedor");
        const idFinal = pedidoActual.id || `PED-${Math.floor(Math.random() * 1000)}`;
        const pedidoGuardado = { ...pedidoActual, id: idFinal, estado: 'Borrador' as const };
        actualizarListaPedidos(pedidoGuardado);
        setVista('lista');
    };

    const enviarPedido = () => {
        if (!pedidoActual.proveedor) return alert("Selecciona un proveedor");
        if (pedidoActual.lineas.length === 0) return alert("Añade al menos un producto");
        if (confirm("¿Enviar pedido al proveedor? No podrás editarlo después.")) {
            const idFinal = pedidoActual.id || `PED-${Math.floor(Math.random() * 1000)}`;
            const pedidoEnviado = { ...pedidoActual, id: idFinal, estado: 'Enviado' as const };
            actualizarListaPedidos(pedidoEnviado);
            setVista('lista');
        }
    };

    const actualizarListaPedidos = (pedido: Pedido) => {
        const existe = pedidos.some(p => p.id === pedido.id);
        if (existe) {
            setPedidos(pedidos.map(p => p.id === pedido.id ? pedido : p));
        } else {
            setPedidos([pedido, ...pedidos]);
        }
        // Nota: Para persistencia real en db.json, aquí se dispararía un POST o PUT
    };

    // --- RENDERIZADO ---
    if (vista === 'formulario') {
        const esSoloLectura = pedidoActual.estado === 'Enviado';
        const titulo = tipoPedido === 'productos' ? 'Productos' : 'Utensilios';

        return (
            <div className="flex flex-col animate-fade-in-up space-y-6 pb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 shrink-0 gap-4">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setVista('lista')}
                            className="group flex items-center gap-2 text-gray-400 hover:text-black transition-colors duration-200 font-bold text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                            VOLVER
                        </button>
                        <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                {pedidoActual.id ? `Pedido ${pedidoActual.id}` : `Nuevo Pedido de ${titulo}`}
                            </h2>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black tracking-widest uppercase ${
                                pedidoActual.estado === 'Enviado' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                                {pedidoActual.estado}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {!esSoloLectura && (
                            <div className="flex items-center bg-gray-100 p-1.5 rounded-pill shadow-inner w-full md:w-auto border border-gray-200/50">
                                <button onClick={guardarBorrador} className="px-6 py-2.5 text-gray-600 rounded-pill font-bold text-xs hover:text-black transition-all duration-200 flex-1 md:flex-none uppercase tracking-wider">Guardar Borrador</button>
                                <button onClick={enviarPedido} className="px-8 py-2.5 bg-black text-white rounded-pill font-bold text-xs hover:bg-gray-800 transition-all duration-200 shadow-md active:scale-95 flex-1 md:flex-none uppercase tracking-wider">Enviar Pedido</button>
                            </div>
                        )}
                        {esSoloLectura && <span className="text-sm font-bold text-gray-400 italic pr-4">Pedido finalizado (Modo lectura)</span>}
                    </div>
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
                                    {catalogoProveedores.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </div>
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
                                                {catalogoProductos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
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

    // Vista: LISTADO DE PEDIDOS
    return (
        <div className="h-full flex flex-col animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Pedidos a Proveedores</h1>
                    <p className="text-gray-500 mt-1">Gestiona y envía tus órdenes de compra</p>
                </div>
                <div className="w-full md:w-auto">
                    <button onClick={() => { setPedidoActual({ id: '', tipo: tipoPedido, proveedor: '', fecha: new Date().toISOString().split('T')[0], estado: 'Borrador', total: 0, observaciones: '', lineas: [] }); setVista('formulario'); }} className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-pill font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95 w-full md:w-fit"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>NUEVO PEDIDO</button>
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
                            {pedidosFiltrados.length > 0 ? (
                                pedidosFiltrados.map((pedido) => (
                                    <tr key={pedido.id} className="hover:bg-gray-50 transition group">
                                        <td className="p-5 font-mono text-xs text-gray-500">{pedido.id}</td>
                                        <td className="p-5 font-medium text-gray-900">{pedido.proveedor}</td>
                                        <td className="p-5 text-gray-600">{pedido.fecha}</td>
                                        <td className="p-5 text-center"><span className={`px-3 py-1 rounded-full text-xs font-bold ${pedido.estado === 'Enviado' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'}`}>{pedido.estado}</span></td>
                                        <td className="p-5 text-right font-bold text-gray-800">{pedido.total.toFixed(2)} €</td>
                                        <td className="p-5 text-right flex justify-end items-center gap-4">
                                            <button onClick={() => { setPedidoActual(pedido); setVista('formulario'); }} className="text-blue-600 hover:text-blue-800 font-medium text-sm">{pedido.estado === 'Borrador' ? 'Editar' : 'Ver'}</button>
                                            {pedido.estado === 'Borrador' && (
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