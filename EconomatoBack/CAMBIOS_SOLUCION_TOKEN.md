# Documentación de Cambios: Solución de Autenticación y Administración

Este documento describe los cambios técnicos implementados para resolver el problema de la falta de token en el login y para facilitar la creación de usuarios administradores.

## 1. Solución al "Problema del Token"

**Problema:** El backend no enviaba el token JWT al hacer login, o el frontend no lo almacenaba, provocando errores `401 Unauthorized` / `403 Forbidden` en peticiones subsiguientes.

### Backend (`EconomatoBack`)

- **Archivo:** `src/controllers/auth.controller.ts`
- **Cambio:** Se actualizó la respuesta del endpoint de login para incluir explícitamente la propiedad `token`.
  ```typescript
  // Antes
  res.json({ usuario, mensaje: "Login exitoso" });
  // Ahora
  res.json({ usuario, token, mensaje: "Login exitoso" });
  ```

### Frontend (`EconomatoFront`)

- **Archivo:** `src/pages/LoginPage.tsx`
  - Se modificó `handleLogin` para capturar el `token` de la respuesta JSON y guardarlo en `localStorage`.
- **Archivo:** `src/services/auth-service.ts` (Nuevo)
  - Se creó un servicio centralizado con la función `authFetch`.
  - Esta función intercepta todas las peticiones `fetch`, recupera el token del `localStorage` y añade automáticamente la cabecera `Authorization: Bearer <token>`.
- **Archivos:** `Inventario.tsx`, `IngresarProducto.tsx`, `AdminUsuarios.tsx`
  - Se reemplazó el uso de `fetch` nativo por `authFetch` para asegurar que todas las llamadas a la API estén autenticadas.

## 2. Creación de Usuario Administrador

**Problema:** No existía una forma sencilla de crear un primer usuario administrador con la contraseña encriptada correctamente y el rol asignado en la base de datos.

### Backend (`EconomatoBack`)

- **Archivo:** `src/scripts/create_admin.ts` (Nuevo)
  - Script de TypeScript ejecutable con `npx ts-node src/scripts/create_admin.ts`.
  - **Funcionalidad:**
    1. Verifica si existe el rol `ADMIN` (lo crea si no).
    2. Elimina cualquier usuario `admin` previo para evitar conflictos.
    3. Crea el usuario `admin` con contraseña `Admin123` (hasheada con bcrypt).
  - **Nota Técnica:** Se utilizó SQL directo (`prisma.$executeRaw`) para insertar el usuario, evitando errores de validación de esquema de Prisma relacionados con columnas inexistentes o cachés corruptas.

## 3. Configuración del Entorno

### Backend (`EconomatoBack`)

- **Archivo:** `.env`
  - Se generó un archivo `.env` funcional basado en `.env.example`.
  - Configura `DATABASE_URL` para conectar a PostgreSQL y `JWT_SECRET` para la firma de tokens.

---

**Rama:** `backend/sergio-updates`
**Autor de los cambios:** Sergio
