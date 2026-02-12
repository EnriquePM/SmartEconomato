# 📘 Manual de Cambios Técnicos del Backend

Este documento explica de forma sencilla qué hace cada pieza de código que hemos construido en el "cerebro" (Backend) del proyecto **Economato**. Está pensado para entender la lógica sin necesidad de saber programar.

---

## 1. Herramientas Automáticas (Scripts)

Son pequeños programas que ejecutas una sola vez para hacer tareas repetitivas o pruebas, ahorradote horas de trabajo manual.

### Robots de Prueba (Testing)

Estos scripts comprueban que todo funciona antes de que los usuarios reales entren.

- **`verify_material_crud.ts`**: Es un "robot" que se hace pasar por un profesor. Entra al sistema, crea un material nuevo (ej. "Tenedor"), comprueba que aparece en la lista, le cambia el precio y luego lo borra. Si todo sale bien, nos da luz verde.
- **`verify_real_login.ts`**: Es otro "robot" más avanzado. Comprueba que el sistema de seguridad (login) funciona, que un usuario no registrado no pueda entrar, y verifica el ciclo completo de hacer un pedido de prueba.

### Importadores de Datos (Carga Masiva)

Sirven para no tener que meter 500 productos uno a uno a mano.

- **`upload_ingredientes.ts`**: Lee el Excel del menú ("ESCANDALLO...") y mete automáticamente en la base de datos todos los **ingredientes** (comestibles) con sus precios y categorías. Si el ingrediente ya existe, solo actualiza su precio.
- **`upload_materiales.ts`**: Hace lo mismo pero para los **materiales** (no comestibles, como servilletas o menaje). Busca la hoja de "Precios Materiales" en el Excel y actualiza el inventario.

---

## 2. El Cerebro del Sistema (Controladores)

Aquí es donde están las reglas del negocio. Cada archivo se encarga de una parte específica de la aplicación.

### `auth.controller.ts` (El Portero)

- **¿Qué hace?**: Se encarga de la seguridad.
- **Funciones**:
  - **Login**: Comprueba si tu **nombre de usuario** y contraseña son correctos. Si sí, te da un "pase VIP" (Token) que dura un tiempo para que no tengas que loguearte en cada clic.
  - **Perfil**: Permite a la aplicación saber quién eres (tu nombre y rol) usando ese pase VIP.

### `user.controller.ts` (Gestión de Personas)

- **¿Qué hace?**: Crea y gestiona los usuarios.
- **Funciones**:
  - **Crear Alumno**: Genera automáticamente el usuario de un alumno nuevo basándose en su nombre y curso.
  - **Generador de Nombres**: Tiene una lógica curiosa; crea el nombre de usuario combinando la 1ª letra del nombre + 3 del primer apellido + 3 del segundo (ej: Sergio Pérez Mata -> `spermat`).

### `ingredient.controller.ts` (Comestibles)

- **¿Qué hace?**: Gestiona todo lo que se come.
- **Funciones**: Listar todos los ingredientes, crear nuevos, cambiar precios o stock, y borrarlos.

### `material.controller.ts` (No Comestibles)

- **¿Qué hace?**: Igual que el anterior, pero para el inventario de utensilios y materiales (servilletas, cucharas, papel de horno...).

### `pedido.controller.ts` (El Corazón de los Pedidos)

- **¿Qué hace?**: Controla todo el viaje de un pedido.
- **El Viaje del Pedido**:
  1.  **Crear Pedido**: Un alumno/profe pide ingredientes. El pedido nace en estado `PENDIENTE`.
  2.  **Validar**: El profesor revisa el pedido. Si le da el OK, pasa a estado `VALIDADO` (listo para comprar).
  3.  **Confirmar (Llegada)**: Cuando llega el camión con la compra, el profesor pulsa "Confirmar". **¡Magia!**: El sistema suma automáticamente las cantidades al stock del inventario y marca el pedido como `CONFIRMADO`.
  4.  **Borrar**: Si un pedido es erróneo, el profesor lo elimina.

---

## 3. Los Guardianes (Middlewares)

Son filtros invisibles que se ejecutan antes de llegar a los controladores.

### `auth.middleware.ts`

- **El Verificador de Entradas (`authenticateToken`)**: Se pone en la puerta de cada ruta protegida. Mira si traes tu "pase VIP" (Token). Si no lo traes o es falso, te echa.
- **El Segurata de Zona VIP (`requireRole`)**: A veces tener entrada no basta. Este guardián comprueba si tu pase dice "PROFESOR". Si eres "ALUMNO" y tratas de entrar a la zona de "Validar Pedidos", este guardián te detiene.

---

## 4. Las Rutas (El Mapa)

Conectan la dirección web (URL) con el controlador (Cerebro) correcto.

| Ruta (URL)        | Quién puede entrar                                          | Qué hace                             |
| :---------------- | :---------------------------------------------------------- | :----------------------------------- |
| **`/auth/login`** | Todo el mundo                                               | Iniciar sesión                       |
| **`/materiales`** | Todo el mundo (Ver) / **Solo Profes** (Editar)              | Gestión del inventario de materiales |
| **`/pedidos`**    | Todo el mundo (Pedir) / **Solo Profes** (Validar/Confirmar) | Gestión completa de pedidos          |
| ...               | ...                                                         | ...                                  |

---

_Este documento fue generado para facilitar la comprensión del sistema a todo el equipo._
