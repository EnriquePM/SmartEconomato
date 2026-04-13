import { useCallback, useEffect, useRef, useState } from 'react';

type SerialNavigator = Navigator & {
    serial?: {
        requestPort: () => Promise<any>;
    };
};

export const useBascula = () => {
    const [peso, setPeso] = useState<string | null>(null);
    const [conectado, setConectado] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const portRef = useRef<any | null>(null);
    const readerRef = useRef<any | null>(null);
    const keepReadingRef = useRef(false);
    const bufferRef = useRef<Uint8Array>(new Uint8Array());

    const soportado =
        typeof navigator !== 'undefined' && !!(navigator as SerialNavigator).serial;

    const concatUint8 = (a: Uint8Array, b: Uint8Array): Uint8Array => {
        const result = new Uint8Array(a.length + b.length);
        result.set(a, 0);
        result.set(b, a.length);
        return result;
    };

    const indexOfByte = (buf: Uint8Array, byteValue: number): number => {
        for (let i = 0; i < buf.length; i += 1) {
            if (buf[i] === byteValue) {
                return i;
            }
        }
        return -1;
    };

    const extraerTramas = (buf: Uint8Array): { tramas: Uint8Array[]; resto: Uint8Array } => {
        const tramas: Uint8Array[] = [];
        let work = buf;
        const STX = 0x02;
        const ETX = 0x03;

        while (true) {
            const i = indexOfByte(work, STX);
            if (i !== -1) {
                work = work.slice(i + 1);
                const j = indexOfByte(work, ETX);
                if (j === -1) {
                    const incompleta = new Uint8Array(work.length + 1);
                    incompleta[0] = STX;
                    incompleta.set(work, 1);
                    return { tramas, resto: incompleta };
                }
                tramas.push(work.slice(0, j));
                work = work.slice(j + 1);
                continue;
            }

            const ln = indexOfByte(work, 0x0a);
            if (ln !== -1) {
                tramas.push(work.slice(0, ln));
                work = work.slice(ln + 1);
                continue;
            }

            const cr = indexOfByte(work, 0x0d);
            if (cr !== -1) {
                tramas.push(work.slice(0, cr));
                work = work.slice(cr + 1);
                continue;
            }

            return { tramas, resto: work };
        }
    };

    const parsePeso = (texto: string): string | null => {
        const matches = texto.match(/[-+]?\d+(?:[\.,]\d+)?/g);
        if (!matches || matches.length === 0) {
            return null;
        }
        return matches[matches.length - 1].replace(',', '.');
    };

    const desconectar = useCallback(async () => {
        keepReadingRef.current = false;

        try {
            if (readerRef.current) {
                await readerRef.current.cancel();
                readerRef.current.releaseLock();
                readerRef.current = null;
            }
        } catch {
            // Ignorar errores de cancelacion si ya se cerro el stream.
        }

        try {
            if (portRef.current) {
                await portRef.current.close();
                portRef.current = null;
            }
        } catch {
            // Ignorar errores si el puerto ya estaba cerrado.
        }

        setConectado(false);
    }, []);

    const conectar = useCallback(async (baudRate: number = 9600) => {
        setError(null);

        if (!soportado) {
            setError('Web Serial no esta disponible en este navegador. Usa Chrome o Edge.');
            return;
        }

        try {
            const serial = (navigator as SerialNavigator).serial;
            if (!serial) {
                setError('No se encontro soporte de puerto serie.');
                return;
            }

            const port = await serial.requestPort();
            await port.open({ baudRate });

            portRef.current = port;
            keepReadingRef.current = true;
            bufferRef.current = new Uint8Array();
            setConectado(true);

            const decoder = new TextDecoder();

            while (keepReadingRef.current && port.readable) {
                const reader = port.readable.getReader();
                readerRef.current = reader;

                try {
                    while (keepReadingRef.current) {
                        const { value, done } = await reader.read();
                        if (done) {
                            break;
                        }

                        if (!value) {
                            continue;
                        }

                        bufferRef.current = concatUint8(bufferRef.current, value as Uint8Array);
                        const { tramas, resto } = extraerTramas(bufferRef.current);
                        bufferRef.current = resto;

                        for (const trama of tramas) {
                            const texto = decoder.decode(trama).trim();
                            const pesoParseado = parsePeso(texto);
                            if (pesoParseado !== null) {
                                setPeso(pesoParseado);
                            }
                        }

                        // Fallback para tramas sin separadores: intenta parsear el buffer actual.
                        if (tramas.length === 0 && bufferRef.current.length > 0) {
                            const textoBuffer = decoder.decode(bufferRef.current).trim();
                            const pesoBuffer = parsePeso(textoBuffer);
                            if (pesoBuffer !== null) {
                                setPeso(pesoBuffer);
                            }
                        }
                    }
                } finally {
                    reader.releaseLock();
                    readerRef.current = null;
                }
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'No se pudo conectar a la bascula.';
            setError(message);
        } finally {
            if (!keepReadingRef.current) {
                await desconectar();
            }
        }
    }, [desconectar, soportado]);

    useEffect(() => {
        return () => {
            void desconectar();
        };
    }, [desconectar]);

    return { peso, conectado, error, soportado, conectar, desconectar };
};
