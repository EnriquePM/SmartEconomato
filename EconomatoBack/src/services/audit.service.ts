import { Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { getIO } from '../socket';

export const logAction = async (
    id_usuario: number | null,
    action: string,
    entity: string,
    entityId: string | number,
    details?: Record<string, unknown>
): Promise<void> => {
    try {
        const registro = await prisma.audit_log.create({
            data: {
                action,
                entity,
                entity_id: String(entityId),
                details: (details ?? {}) as Prisma.InputJsonValue,
                id_usuario: id_usuario ?? null
            },
            include: {
                usuario: {
                    select: { nombre: true, apellido1: true, email: true }
                }
            }
        });

        const io = getIO();
        if (io) {
            io.emit('new_audit_log', registro);
        }
    } catch (error) {
        // El fallo del log nunca debe interrumpir la operación principal
        console.error('[Audit] Error al registrar acción:', error);
    }
};
