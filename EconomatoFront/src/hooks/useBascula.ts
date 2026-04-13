import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

export const useBascula = () => {
    const [peso, setPeso] = useState<string | null>(null);
    const [conectado, setConectado] = useState(false);

    useEffect(() => {
        // Conexión al backend de Express en localhost:3000
        const socket: Socket = io('http://localhost:3000');

        socket.on('connect', () => {
            setConectado(true);
        });

        socket.on('disconnect', () => {
            setConectado(false);
        });

        socket.on('peso_actualizado', (data: { peso: string }) => {
            setPeso(data.peso);
        });

        // Limpieza del hook
        return () => {
            socket.disconnect();
        };
    }, []);

    return { peso, conectado };
};
