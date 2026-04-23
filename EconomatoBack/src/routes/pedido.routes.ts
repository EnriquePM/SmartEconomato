import { Router } from 'express';
import { createPedido, updatePedido, getPedidos, getPedidoById, validarPedido, deletePedido, confirmarPedido } from '../controllers/pedido.controller';

const router = Router();

router.post('/', createPedido);
router.get('/', getPedidos);
router.get('/:id', getPedidoById);
router.put('/:id', updatePedido);
router.put('/:id/validar', validarPedido);
router.delete('/:id', deletePedido);
router.put('/:id/confirmar', confirmarPedido);

export default router;