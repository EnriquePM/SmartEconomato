import { SerialPort } from 'serialport';
import { Server as SocketIOServer } from 'socket.io';

const PORT = 'COM1';
const BAUD = 9600;

const STX = Buffer.from([0x02]);
const ETX = Buffer.from([0x03]);

function extraerTramas(buf: any): { tramas: any[], resto: any } {
  const tramas: any[] = [];
  while (true) {
    const i = buf.indexOf(STX);
    if (i !== -1) {
      buf = buf.subarray(i + 1);
      const j = buf.indexOf(ETX);
      if (j === -1) {
        return { tramas, resto: Buffer.concat([STX, buf]) };
      }
      tramas.push(buf.subarray(0, j));
      buf = buf.subarray(j + 1);
      continue;
    }

    const j = buf.indexOf(Buffer.from('\n'));
    if (j !== -1) {
      tramas.push(buf.subarray(0, j));
      buf = buf.subarray(j + 1);
      continue;
    }

    const r = buf.indexOf(Buffer.from('\r'));
    if (r !== -1) {
      tramas.push(buf.subarray(0, r));
      buf = buf.subarray(r + 1);
      continue;
    }

    return { tramas, resto: buf };
  }
}

function parsePeso(tramaTexto: string): string | null {
  const regex = /[-+]?\d+(?:\.\d+)?/g;
  const matches = tramaTexto.match(regex);
  if (!matches || matches.length === 0) {
    return null;
  }
  return matches[matches.length - 1];
}

export function iniciarServicioBascula(io: SocketIOServer) {
  let port: SerialPort;

  try {
    port = new SerialPort({ 
      path: PORT, 
      baudRate: BAUD 
    });
  } catch (error) {
    console.error('[Báscula] Error inicializando el puerto de la báscula:', error);
    return;
  }

  let bufferGlobal: any = Buffer.alloc(0);
  let ultimoPeso: string | null = null;

  port.on('open', () => {
    console.log(`[Báscula] Conectado en puerto ${port.path}`);
  });

  port.on('data', (chunk: Buffer) => {
    bufferGlobal = Buffer.concat([bufferGlobal, chunk]);
    const resultado = extraerTramas(bufferGlobal);
    bufferGlobal = resultado.resto;

    for (const trama of resultado.tramas) {
      const texto = trama.toString('ascii').trim();
      const peso = parsePeso(texto);

      if (peso === null) continue;

      if (peso !== ultimoPeso) {
        console.log('[Báscula] Nuevo Peso Recibido:', peso);
        ultimoPeso = peso;
        // Emitir el evento de Socket.io a cualquier cliente conectado
        io.emit('peso_actualizado', { peso });
      }
    }
  });

  port.on('error', (err) => {
    console.error('[Báscula] Error del Puerto Serie:', err.message);
  });
}
