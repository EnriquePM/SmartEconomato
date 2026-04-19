import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ingredientRoutes from './routes/ingredient.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import recursosRoutes from './routes/recursos.routes';
import pedidoRoutes from './routes/pedido.routes';
import materialRoutes from './routes/material.routes';
import categoriaRoutes from './routes/categoria.routes';
import proveedorRoutes from './routes/proveedor.routes';
import movimientoRoutes from './routes/movimiento.routes';
import recetaRoutes from './routes/receta.routes';
import escandalloRoutes from './routes/escandallo.routes';
import alergenoRoutes from './routes/alergeno.routes';
import http from 'http';
import { Server } from 'socket.io';
import { iniciarServicioBascula } from './services/bascula.service';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/ingredientes', ingredientRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/materiales', materialRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/movimientos', movimientoRoutes);
app.use('/api/recetas', recetaRoutes);
app.use('/api/escandallos', escandalloRoutes);
app.use('/api/alergenos', alergenoRoutes);

// Recursos (se monta en /api, por lo que afecta a las rutas de recursos si coinciden)
app.use('/api', recursosRoutes);

// --- CONFIGURACIÓN DE SOCKET.IO Y BÁSCULA ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Podrías restringir esto luego a tu front-end en producción
  }
});

// Inicializamos el servicio de tu lector pasándole el IO
iniciarServicioBascula(io);

server.listen(port, () => {
    console.log(`Servidor Listo con Sockets en http://localhost:${port}`);
});