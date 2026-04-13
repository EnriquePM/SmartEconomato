import { SerialPort } from 'serialport';

// Configuración del puerto
const PORT = 'COM1';
const BAUD = 9600;

const STX = Buffer.from([0x02]);
const ETX = Buffer.from([0x03]);

/**
 * Devuelve un objeto con las tramas extraídas y el resto del buffer.
 * Trama = bytes entre STX..ETX o hasta \n / \r.
 */
function extraerTramas(buf: Buffer): { tramas: Buffer[], resto: Buffer } {
  const tramas: Buffer[] = [];

  while (true) {
    // 1) Si hay STX, intentamos STX..ETX
    const i = buf.indexOf(STX);
    if (i !== -1) {
      buf = buf.subarray(i + 1); // quitamos STX
      const j = buf.indexOf(ETX);
      
      if (j === -1) {
        // Aún incompleta, devolvemos el STX y el resto del buffer
        return { tramas, resto: Buffer.concat([STX, buf]) };
      }
      
      // Guardamos la trama encontrada y avanzamos el buffer
      tramas.push(buf.subarray(0, j));
      buf = buf.subarray(j + 1);
      continue;
    }

    // 2) Si no hay STX, intentamos por fin de línea (\n)
    const j = buf.indexOf(Buffer.from('\n'));
    if (j !== -1) {
      tramas.push(buf.subarray(0, j));
      buf = buf.subarray(j + 1);
      continue;
    }

    // 3) También puede terminar en \r sin \n
    const r = buf.indexOf(Buffer.from('\r'));
    if (r !== -1) {
      tramas.push(buf.subarray(0, r));
      buf = buf.subarray(r + 1);
      continue;
    }

    return { tramas, resto: buf };
  }
}

/**
 * Busca el número más "completo" dentro de un string que represente la trama
 */
function parsePeso(tramaTexto: string): string | null {
  // Regex: número con o sin signo, opcionalmente con decimales
  const regex = /[-+]?\d+(?:\.\d+)?/g;
  const matches = tramaTexto.match(regex);
  
  if (!matches || matches.length === 0) {
    return null;
  }
  
  // Equivale al [-1] de Python (el último que encuentre)
  return matches[matches.length - 1];
}

// ==========================================
// EJECUCIÓN PRINCIPAL
// ==========================================

const port = new SerialPort({ 
    path: PORT, 
    baudRate: BAUD 
});

let bufferGlobal: any = Buffer.alloc(0);
let ultimoPeso: string | null = null;

port.on('open', () => {
    console.log(`Conectado. Leyendo datos desde ${port.path}`);
});

// Evento que se dispara cada vez que el puerto lee un nuevo pedazo (chunk) de bytes
port.on('data', (chunk: Buffer) => {
    // Concatenamos el nuevo trozo al buffer que ya teníamos
    bufferGlobal = Buffer.concat([bufferGlobal, chunk]);

    // Extraemos las tramas completas
    const resultado = extraerTramas(bufferGlobal);
    
    // Lo que haya sobrado no procesado, se queda en el buffer general para la siguiente lectura
    bufferGlobal = resultado.resto;

    // Evaluamos cada trama encontrada
    for (const trama of resultado.tramas) {
      // Las convertimos a string (ASCII), quitando espacios a los bordes
      const texto = trama.toString('ascii').trim();
      const peso = parsePeso(texto);

      if (peso === null) continue;

      // Imprimir solo cuando cambie con respecto al último registro (igual que tu script)
      if (peso !== ultimoPeso) {
        console.log('Peso:', peso);
        ultimoPeso = peso;
      }
    }
});

port.on('error', (err) => {
    console.error('Error del Puerto Serie:', err.message);
});
