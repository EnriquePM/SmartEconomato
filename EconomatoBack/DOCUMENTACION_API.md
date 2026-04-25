# Documentación Oficial de la API - SmartEconomato

Esta es la documentación detallada de la API REST para el backend de SmartEconomato. La base de la URL para todas las rutas documentadas es `http://localhost:3000/api`.

> **Nota sobre Seguridad:** Las rutas que requieren autenticación necesitan incluir en la cabecera (Header) de la petición: `Authorization: Bearer <token_jwt>`.

---

## 1. Autenticación (`/api/auth`)

Rutas para acceso y registro de usuarios. No requieren token previo.

### **Registrar Alumno**
- **Descripción:** Registra un nuevo perfil de alumno en el sistema y genera su usuario automáticamente.
- **Método:** `POST`
- **URL:** `/api/auth/register/alumno`
- **Autenticación:** No requerida.
- **Body esperado (JSON):**
  ```json
  {
    "nombre": "Juan",
    "apellido1": "Pérez",
    "apellido2": "Gómez",
    "email": "juan@example.com",
    "curso": "1º Cocina"
  }
  ```
- **Respuesta Éxito (200 OK):**
  ```json
  {
    "id_usuario": 10,
    "nombre": "Juan",
    "username": "jpergom",
    "primer_login": true
  }
  ```
- **Error (500 Internal Server Error):**
  ```json
  { "error": "Error registrando alumno" }
  ```

### **Registrar Profesor / Jefe Economato**
- **Descripción:** Registra un perfil de Profesor o Jefe (usan la misma lógica interna).
- **Método:** `POST`
- **URL:** `/api/auth/register/profesor` o `/api/auth/register/jefe_economato`
- **Autenticación:** No requerida.
- **Body esperado (JSON):**
  ```json
  {
    "nombre": "María",
    "apellido1": "García",
    "apellido2": "López",
    "email": "maria@example.com",
    "asignaturas": "Repostería"
  }
  ```
- **Respuesta Éxito (200 OK):** (Objeto del usuario creado)

### **Login**
- **Descripción:** Inicia sesión en el sistema.
- **Método:** `POST`
- **URL:** `/api/auth/login`
- **Autenticación:** No requerida.
- **Body esperado (JSON):**
  ```json
  {
    "username": "jpergom",
    "contrasenya": "Economato123"
  }
  ```
- **Respuesta Éxito Normal (200 OK):**
  ```json
  {
    "mensaje": "Login exitoso",
    "requiereCambioPass": false,
    "token": "eyJh... (JWT)",
    "usuario": {
      "id": 10,
      "username": "jpergom",
      "nombre": "Juan",
      "rol": "ALUMNO"
    }
  }
  ```
- **Respuesta Primer Login (200 OK):**
  ```json
  {
    "mensaje": "Debe cambiar su contraseña",
    "requiereCambioPass": true,
    "usuario": { "username": "jpergom", "nombre": "Juan" }
  }
  ```
- **Errores:** `404 Not Found` (Usuario no encontrado), `401 Unauthorized` (Contraseña incorrecta).

### **Cambiar Contraseña (Primer login)**
- **Descripción:** Actualiza la contraseña actual.
- **Método:** `POST`
- **URL:** `/api/auth/change-password`
- **Autenticación:** No requerida.
- **Body esperado (JSON):**
  ```json
  {
    "username": "jpergom",
    "oldPassword": "Economato123",
    "newPassword": "NuevaPasswordSegura"
  }
  ```
- **Respuesta Éxito (200 OK):**
  ```json
  { "mensaje": "Contraseña actualizada correctamente" }
  ```

---

## 2. Gestión de Usuarios (`/api/usuarios`)

Gestión principal para el panel de administración.

### **Listar Usuarios**
- **Descripción:** Obtiene todos los usuarios.
- **Método:** `GET`
- **URL:** `/api/usuarios`
- **Autenticación:** Requiere Token y perfil `Administrador` o `Profesor`.
- **Respuesta Éxito (200 OK):** Array de objetos usuario con roles incluidos.

### **Actualizar Info Básica**
- **Descripción:** Modifica perfil de un usuario existente.
- **Método:** `PUT`
- **URL:** `/api/usuarios/:id`
- **Autenticación:** Token + (`Administrador` o `Profesor`).
- **Body esperado (JSON):**
  ```json
  { "nombre": "Juan", "apellido1": "Pérez Modificado", "email": "nuevo@email.com" }
  ```

### **Reset Password**
- **Descripción:** Fuerza la contraseña a `Economato123`.
- **Método:** `PUT`
- **URL:** `/api/usuarios/:id/reset-password`
- **Autenticación:** Token + (`Administrador` o `Profesor`).
- **Respuesta Éxito (200 OK):** Mensaje confirmando el reinicio de clave.

### **Cambiar Rol**
- **Descripción:** Cambia el nivel de permisos de usuario.
- **Método:** `PUT`
- **URL:** `/api/usuarios/:id/role`
- **Autenticación:** Token + (`Administrador` o `Profesor`).
- **Body esperado:** `{ "id_rol": 2 }`

### **Eliminar Usuario**
- **Descripción:** Borra permanentemente el usuario. Si tiene dependencias de pedidos devuelve error estructurado.
- **Método:** `DELETE`
- **URL:** `/api/usuarios/:id`
- **Autenticación:** Token + (`Administrador` o `Profesor`).

---

## 3. Ingredientes (`/api/ingredientes`)

### **Listar**
- **Descripción:** Obtiene todo el inventario de ingredientes con sus categorías, proveedores y alérgenos.
- **Método:** `GET`
- **URL:** `/api/ingredientes`
- **Autenticación:** Ninguna especificada en router (Pública/Basal).
- **Respuesta Éxito (200 OK):**
  ```json
  [
    {
      "id_ingrediente": 1,
      "nombre": "Harina",
      "stock": 50,
      "precio_unidad": 1.20,
      "categoria": { "nombre": "Secos" },
      "alergenos": [ { "id_alergeno": 2 } ]
    }
  ]
  ```

### **Crear**
- **Descripción:** Añade un nuevo ingrediente al catálogo.
- **Método:** `POST`
- **URL:** `/api/ingredientes`
- **Autenticación:** Validador esquema middleware.
- **Body esperado (JSON):**
  ```json
  {
    "nombre": "Tomate",
    "stock": 10,
    "stock_minimo": 2,
    "tipo": "Fresco",
    "id_categoria": 1,
    "unidad_medida": "kg",
    "precio_unidad": 2.50,
    "alergenosIds": [1, 2]
  }
  ```

### **Modificar**
- **Método:** `PUT`
- **URL:** `/api/ingredientes/:id`
- **Descripción:** Sustituye datos y alérgenos del ingrediente seleccionado.

### **Eliminar**
- **Método:** `DELETE`
- **URL:** `/api/ingredientes/:id`

---

## 4. Materiales (`/api/materiales`)

### **Listar**
- **Método:** `GET`
- **URL:** `/api/materiales`
- **Autenticación:** Requiere Token (Usuario autenticado).

### **Crear**
- **Método:** `POST`
- **URL:** `/api/materiales`
- **Autenticación:** Requiere Token. 
- **Body esperado (JSON):** `{ "nombre": "Sartén", "unidad_medida": "ud", "id_categoria": 3 }`

### **Actualizar y Eliminar**
- Funcionalidades estándar usando `PUT /api/materiales/:id` y `DELETE /api/materiales/:id` con token requerido.

---

## 5. Pedidos (`/api/pedidos`)

### **Crear Pedido**
- **Descripción:** Crea un pedido de productos/utensilios. Soporta líneas para base de datos.
- **Método:** `POST`
- **URL:** `/api/pedidos`
- **Autenticación:** (Usa `req.user.id_usuario` si existe, asume `1` por defecto).
- **Body esperado (JSON):**
  ```json
  {
    "tipo_pedido": "productos",
    "estado": "PENDIENTE",
    "fecha_pedido": "2026-04-20T10:00:00.000Z",
    "pedido_ingrediente": [
      { "id_ingrediente": 5, "cantidad_solicitada": 10 }
    ]
  }
  ```

### **Listar Pedidos**
- **Método:** `GET`
- **URL:** `/api/pedidos`
- **Respuesta:** Lista de todos los pedidos incluyendo creador y detalles anidados (ingredientes/materiales).

### **Obtener Detalle**
- **Método:** `GET`
- **URL:** `/api/pedidos/:id`

### **Actualizar, Validar y Confirmar**
- **`PUT /api/pedidos/:id`**: Edición completa.
- **`PUT /api/pedidos/:id/validar`**: Pasa el estado a `VALIDADO`.
- **`PUT /api/pedidos/:id/confirmar`**: Suma las cantidades que se manden al `stock` de los correspondientes ingredientes/materiales y marcar estado como  `CONFIRMADO` (o `INCOMPLETO`).
  - *Body Confirmar:* `{ "lineasRecibidas": [{"productoId": 1, "cantidad": 5}] }`

---

## 6. Recetas (`/api/recetas`)

### **Listado y Detalle (`GET`)**
- Rutas: `/api/recetas` y `/api/recetas/:id`. Requiere Token.

### **Crear Receta**
- **Método:** `POST`
- **URL:** `/api/recetas`
- **Autenticación:** Requiere Token.
- **Body esperado:**
  ```json
  {
    "nombre": "Tortilla",
    "cantidad_platos": 4,
    "ingredientes": [
      { "id_ingrediente": 3, "cantidad": 5, "rendimiento": 100 }
    ],
    "alergenos": [1, 5]
  }
  ```

### **Elaborar (Hacer Receta)**
- **Descripción:** Consume stock del economato creando Movimientos de "SALIDA" automáticamente.  
- **Método:** `POST`
- **URL:** `/api/recetas/:id/hacer`
- **Autenticación:** Requiere Token y perfil (`Profesor`, `Administrador`...).
- **Body esperado:** `{ "raciones": 8 }` (Calcula la parte proporcional a restar, considerando rendimiento).
- **Error (409 Conflict):** Retornará un array `faltantes` si no hay stock suficiente, denegando elaboración.

---

## 7. Movimientos de Stock (`/api/movimientos`)

### **Listar Historial**
- **Método:** `GET`
- **URL:** `/api/movimientos`
- **Autenticación:** Token.

### **Registrar Movimiento Manual**
- **Método:** `POST`
- **URL:** `/api/movimientos`
- **Autenticación:** Token + (`Profesor` o `Administrador`).
- **Body esperado:**
  ```json
  {
    "id_ingrediente": 2,
    "id_usuario": 1,
    "tipo_movimiento": "MERMA",
    "cantidad": 1,
    "observaciones": "Bote roto"
  }
  ```

---

## 8. Escandallos (`/api/escandallos`)

### **Crear Escandallo**
- **Descripción:** Toma una foto fija de la receta y sus ingredientes actuales para valoración de costes.
- **Método:** `POST`
- **URL:** `/api/escandallos`
- **Autenticación:** Token.
- **Body esperado:** `{ "id_receta": 5, "id_usuario": 2, "descripcion": "Prueba Costes" }`

### **Gestión Adicional**
- Listar: `GET /api/escandallos`
- Ver 1: `GET /api/escandallos/:id`
- Eliminar: `DELETE /api/escandallos/:id`

---

## 9. Categorías y Proveedores (`/api/categorias` y `/api/proveedores`)

Cuentan con exactamente el mismo patrón CRUD:
- **`GET /api/xxx`**: Público/Token.
- **`POST /api/xxx`**: `{ "nombre": "Lácteos" }`. (Token + Prof/Admin).
- **`PUT /api/xxx/:id`**: `{ "nombre": "Nuevo nombre" }`. (Token + Prof/Admin).
- **`DELETE /api/xxx/:id`**. (Token + Prof/Admin).

> *Existen atajos en `/api/categorias` (y proveedores) desde `/api/recursos/` para obtener simplemente el listado en algunos formularios frontend.*

---

## 10. Alérgenos (`/api/alergenos`)

### **Listar Alérgenos**
- **Método:** `GET`
- **URL:** `/api/alergenos`
- **Respuesta (200 OK):** Lista de catálogo de todos los alérgenos pre-configurados del sistema.
