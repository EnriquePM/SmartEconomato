import { Request, Response } from "express";
import { prisma } from "../prisma";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";

// --- CONFIGURACIÓN ---
const PASSWORD_POR_DEFECTO = "Economato123";

// ==========================================
// 1. FUNCIONES AUXILIARES
// ==========================================

const limpiarTexto = (texto: string) => {
  if (!texto) return "";
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Quitar tildes
    .replace(/[^a-z0-9]/g, "") // Quitar símbolos raros
    .trim();
};

const generarUsernameDisponible = async (
  nombre: string,
  ape1: string,
  ape2: string | null,
) => {
  // LÓGICA: 1 letra Nombre + 3 letras Apellido1 + 3 letras Apellido2
  const n = limpiarTexto(nombre).charAt(0);
  const a1 = limpiarTexto(ape1).slice(0, 3);
  const a2 = ape2 ? limpiarTexto(ape2).slice(0, 3) : "";

  let baseUsername = `${n}${a1}${a2}`;

  // Si por lo que sea queda muy corto (ej: 'Ana' sin apellidos), forzamos un mínimo
  if (baseUsername.length < 3) baseUsername = "user";

  let candidato = baseUsername;
  let contador = 1;

  // Bucle para evitar duplicados (ej: jgarper, jgarper1, jgarper2...)
  while (true) {
    const existe = await prisma.usuario.findUnique({
      where: { username: candidato },
    });
    if (!existe) return candidato;

    candidato = `${baseUsername}${contador}`;
    contador++;
  }
};

// 2. REGISTRO (ALUMNOS Y PROFESORES)

export const registerAlumno = async (req: Request, res: Response) => {
  try {
    const { nombre, apellido1, apellido2, email, curso } = req.body;
    const usernameGenerado = await generarUsernameDisponible(
      nombre,
      apellido1,
      apellido2,
    );
    const hashedPassword = await bcrypt.hash(PASSWORD_POR_DEFECTO, 10);

    await prisma.$transaction(async (tx) => {
      // 1. Crear Usuario
      const nuevoUsuario = await tx.usuario.create({
        data: {
          nombre,
          apellido1,
          apellido2: apellido2 || null,
          email: email && email.trim() !== "" ? email : null,
          username: usernameGenerado,
          contrasenya: hashedPassword,
          primer_login: true,
          id_rol: 2, // Rol Alumno
        },
      });

      // 2. Crear Ficha Alumno (CORREGIDO CON CONNECT)
      await tx.alumnado.create({
        data: {
          curso: curso || "1º Curso",
          usuario: {
            connect: { id_usuario: nuevoUsuario.id_usuario },
          },
        },
      });

      res.json(nuevoUsuario);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error registrando alumno" });
  }
};

export const registerProfesor = async (req: Request, res: Response) => {
  try {
    const { nombre, apellido1, apellido2, email, asignaturas } = req.body;
    const usernameGenerado = await generarUsernameDisponible(
      nombre,
      apellido1,
      apellido2,
    );
    const hashedPassword = await bcrypt.hash(PASSWORD_POR_DEFECTO, 10);

    await prisma.$transaction(async (tx) => {
      // 1. Crear Usuario
      const nuevoUsuario = await tx.usuario.create({
        data: {
          nombre,
          apellido1,
          apellido2: apellido2 || null,
          email: email && email.trim() !== "" ? email : null,
          username: usernameGenerado,
          contrasenya: hashedPassword,
          primer_login: true,
          id_rol: 1, // Rol Profesor
        },
      });

      // 2. Crear Ficha Profesor (CORREGIDO CON CONNECT)
      await tx.profesorado.create({
        data: {
          asignaturas: asignaturas || "General",
          usuario: {
            connect: { id_usuario: nuevoUsuario.id_usuario },
          },
        },
      });

      res.json(nuevoUsuario);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error registrando profesor" });
  }
};

// 3. LOGIN Y CAMBIO DE PASSWORD

export const login = async (req: Request, res: Response) => {
  const { username, contrasenya } = req.body;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { username },
      include: { rol: true },
    });

    if (!usuario) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    const passwordValida = await bcrypt.compare(
      contrasenya,
      usuario.contrasenya,
    );

    if (!passwordValida) {
      res.status(401).json({ error: "Contraseña incorrecta" });
      return;
    }

    // LOGIN DE PRIMERA VEZ (Obliga a cambiar pass)
    if (usuario.primer_login) {
      res.json({
        mensaje: "Debe cambiar su contraseña",
        requiereCambioPass: true,
        usuario: {
          username: usuario.username,
          nombre: usuario.nombre,
        },
      });
      return;
    }



    // LOGIN NORMAL
    const token = generateToken({
      id: usuario.id_usuario,
      username: usuario.username,
      role: usuario.rol?.nombre,
    });

    res.json({
      mensaje: "Login exitoso",
      requiereCambioPass: false,
      token, // <--- INCLUIMOS EL TOKEN
      usuario: {
        id: usuario.id_usuario,
        username: usuario.username,
        nombre: usuario.nombre,
        apellido1: usuario.apellido1,
        apellido2: usuario.apellido2,
        rol: usuario.rol?.nombre,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el login" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const { username, oldPassword, newPassword } = req.body;

  try {
    const usuario = await prisma.usuario.findUnique({ where: { username } });
    if (!usuario) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    // Verificar la contraseña anterior
    const valida = await bcrypt.compare(oldPassword, usuario.contrasenya);
    if (!valida) {
      res.status(401).json({ error: "La contraseña actual no es correcta" });
      return;
    }

    // Encriptar la nueva
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar
    await prisma.usuario.update({
      where: { id_usuario: usuario.id_usuario },
      data: {
        contrasenya: newHashedPassword,
        primer_login: false,
      },
    });

    res.json({ mensaje: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error cambiando contraseña" });
  }
};
