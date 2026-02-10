import { generateToken, verifyToken } from './src/utils/jwt';

console.log('--- Iniciando prueba de JWT ---');

// 1. Simular datos de usuario
const payloadUsuario = {
    id_usuario: 1,
    role: 'PROFESORADO'
};
console.log('1. Datos de usuario simulados:', payloadUsuario);

// 2. Generar Token
console.log('2. Generando token...');
const token = generateToken(payloadUsuario);
console.log('   Token generado:', token);

// 3. Verificar Token
console.log('3. Verificando token...');
try {
    const decodificado = verifyToken(token);
    console.log('   Token verificado correctamente!');
    console.log('   Datos decodificados:', decodificado);
    
    if (decodificado.role === 'PROFESORADO') {
        console.log('4. PRUEBA EXITOSA: El rol coincide.');
    } else {
        console.error('4. PRUEBA FALLIDA: El rol no coincide.');
    }

} catch (error) {
    console.error('   ERROR: No se pudo verificar el token.', error);
}
