# 🛡️ Plan de Seguridad: Restringir el Borrado de Productos

Para lograr que **solo profesores o administradores** puedan borrar productos, necesitamos implementar un sistema de "Identificación" (Login) y "Autorización" (Permisos).

Aquí tienes los pasos que vamos a seguir:

## 1. Instalar Herramientas de Seguridad
Necesitamos librerías para manejar contraseñas y tokens digitales (pases de acceso).
*   **Comando:** `npm install jsonwebtoken bcryptjs @types/jsonwebtoken @types/bcryptjs`

## 2. Crear el "Carnet de Identidad" (Token)
Cuando un usuario haga Login, el servidor le dará un **Token** (un código largo y seguro) que dice quién es y qué rol tiene (ej: "Usuario: Juan, Rol: Profesor").
*   **Archivo a crear:** `src/utils/jwt.ts` (o dentro del controlador).

## 3. Crear el "Portero" (Middleware)
Necesitamos un código que se ejecute *antes* de borrar un producto. Este "Portero":
1.  Pedirá el Token.
2.  Leera el Rol del Token.
3.  Si es **PROFESOR** o **ADMIN**, le deja pasar.
4.  Si es **ALUMNO**, le bloquea la entrada.
*   **Archivo a crear:** `src/middlewares/auth.middleware.ts`

## 4. Crear la Ruta de Login
Para conseguir el token, el usuario necesita enviar su email y contraseña.
*   **Ruta:** `POST /api/auth/login`
*   **Acción:** Comprobar usuario en base de datos -> Devolver Token.

## 5. Proteger la Ruta de Borrado
Finalmente, pondremos al "Portero" vigilando la ruta de borrar.
*   **Cambio en `ingredient.routes.ts`:**
    ```typescript
    // Antes
    router.delete('/:id', deleteIngrediente);

    // Después
    router.delete('/:id', authenticateToken, requireRole(['PROFESOR', 'JEFE']), deleteIngrediente);
    ```

---
**¿Empezamos por el paso 1 (Instalar herramientas)?**
