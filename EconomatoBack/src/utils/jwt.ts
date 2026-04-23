//Importamos jwt de jsonwebtoken
import jwt from 'jsonwebtoken';

//Definimos la constante JWT_SECRET que contiene la palabra secreta para firmar los tokens
const JWT_SECRET = process.env.JWT_SECRET || 'palabra_secreta_para_firmar_tokens_123';

//Exportamos la funcion generateToken que recibe un payload y retorna un token
export const generateToken = (payload: object): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
};

//Exportamos la funcion verifyToken que recibe un token y retorna el payload
export const verifyToken = (token: string): any => {
    return jwt.verify(token, JWT_SECRET);
};
