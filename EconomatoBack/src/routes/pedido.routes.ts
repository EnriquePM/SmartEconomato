import { Router } from 'express';
import { createPedido, getPedidos, validarPedido, deletePedido, confirmarPedido } from '../controllers/pedido.controller';

const router = Router();

router.post('/', createPedido);
router.get('/', getPedidos);
router.put('/:id/validar', validarPedido);
router.delete('/:id', deletePedido);
router.put('/:id/confirmar', confirmarPedido);

export default router;