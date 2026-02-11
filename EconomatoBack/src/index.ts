import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ingredientRoutes from './routes/ingredient.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import recursosRoutes from './routes/recursos.routes';
import pedidoRoutes from './routes/pedido.routes';
import materialRoutes from './routes/material.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/ingredientes', ingredientRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api', recursosRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/materiales', materialRoutes);


app.listen(port, () => {
    console.log(`Servidor listo en http://localhost:${port}`);
});