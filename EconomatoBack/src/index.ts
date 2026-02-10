import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ingredientRoutes from './routes/ingredient.routes';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import pedidoRoutes from './routes/pedido.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/ingredientes', ingredientRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/pedidos', pedidoRoutes);

// Arrancar servidor
app.listen(port, () => {
    console.log(`Backend corriendo en http://localhost:${port}`);
});