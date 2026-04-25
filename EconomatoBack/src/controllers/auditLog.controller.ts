import { Request, Response } from 'express';
import { prisma } from '../prisma';

// Express 5: los errores de promesas se propagan automáticamente al handler de errores
export const getAuditLogs = async (req: Request, res: Response) => {
    const page  = Math.max(1, Number(req.query.page)  || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
    const skip  = (page - 1) * limit;

    const [logs, total] = await Promise.all([
        prisma.audit_log.findMany({
            skip,
            take: limit,
            orderBy: { created_at: 'desc' },
            include: {
                usuario: {
                    select: { nombre: true, apellido1: true, email: true }
                }
            }
        }),
        prisma.audit_log.count()
    ]);

    res.json({
        data: logs,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    });
};
