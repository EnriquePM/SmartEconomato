# 📘 Manual de Arquitectura y Profundidad del Código (Backend)

Este documento es una guía técnica exhaustiva del funcionamiento interno del backend del proyecto **SmartEconomato**. Se enfoca no solo en saber qué hace cada archivo de código, sino *cómo y por qué* están diseñados así, para permitir el futuro escalado o la depuración de errores.

---

## 1. El Ciclo de Vida de una Petición (Request Lifecycle)

Cada vez que el Frontend envía una solicitud (ej. "Quiero ver los ingredientes"), el backend la procesa en este orden de capas:

1. **Punto de Entrada (`index.ts`)**: Se recibe la solicitud en nuestro servidor Express y se le aplican ajustes globales de seguridad (`cors()`) y parseo (`express.json()`). 
2. **Enrutador (`src/routes/...`)**: Se cruza por el mapa de rutas pertinente donde se define la combinación `Ruta + Método HTTP`.
3. **Validación Zod (`src/schemas/...`)**: Antes de que la información pase al cerebro, se inspeccionan las tramas entrantes. Si envían texto donde debería ir un número de stock, la petición aborta con `400 Bad Request`.
4. **Middlewares de Entrada (`src/middlewares/...`)**: Se comprueba el JWT (`authenticateToken`) y opcionalmente el nivel de permisos de usuario (`requireRole`).
5. **Controlador (`src/controllers/...`)**: Contiene la lógica profunda usando **Prisma ORM** como motor de base de datos.
6. **Respuesta (`Response`)**: Retorna el JSON estructurado al usuario o los códigos de error HTTP adecuados (200, 401, 403, 404, 500).

---

## 2. Decisiones de Arquitectura sobre Base de Datos (Prisma ORM)

Se utiliza **Prisma** porque permite tipar las consultas. La regla de oro en este proyecto, y una decisión de arquitectura muy presente, es **el uso de Transacciones o "Lotes Seguros" (`prisma.$transaction`)**.

### ¿Qué son las Transacciones y dónde las usamos?
Las transacciones garantizan que una "cadena de procesos" se guarde junta. Si algo falla a la mitad, se revierte **todo** para proteger la integridad de los datos (ACID).

Aparecen destacadamente en:
- **`recetas.controllers.ts` (Al crear o alterar una receta):** Para asegurar que la "receta" se guarda solo si también se guardan correctamente las 15 proporciones de ingredientes asociadas.
- **`pedido.controller.ts` (Al recibir mercancía):** Al confirmar, entran camiones de varios insumos. Añadimos stock a la cantidad y creamos registros en las tablas cruzadas. Si uno solo falla, la base de datos aborta y así no queda "stock flotante".
- **`movimiento.controllers.ts`:** Evitamos sumar un movimiento a la historia si el descuento o aumento de stock falla en la tabla principal del ingrediente.

---

## 3. Controladores a Fondo (Core del Negocio)

Repasamos con total detalle el trabajo que ocurre dentro de los archivos críticos:

### A) El Motor de Pedidos (`pedido.controller.ts`)
Controla la gestión de inventario diferida.
- **Separación Lógica:** Un pedido (`tipo_pedido`) diferencia internamente `pedido_ingrediente` y `pedido_material`, de forma que pueden convivir las dos ramas sin mezclar lógicas.
- **Validar vs Confirmar:**  
  - Al pulsar "Validar", solo se avanza en la máquina de estados.
  - Al pulsar **`Confirmar`**: Es el bloque más grande. El sistema evalúa localmente si faltaban elementos por llegar (`cantidadQueLlegaAhora`). Va ingrediente por ingrediente restándolo de la cantidad solicitada. Si se recibe completamente todo lo del carrito, cambia el estatus a `CONFIRMADO`, si faltan, a `INCOMPLETO`, permitiendo al profesor hacer ingresos o recepciones en dos oleadas. Toma la cantidad recibida y la suma al inventario global de golpe.

### B) Motor Químico de Recetas (`receta.controllers.ts`)
- Su método `makeReceta (POST /hacer)` funciona como un consumidor inteligente de stock:  
  1. Extrae la cantidad solicitada vs el plato base de la receta (Regla de tres para calcular el factor de *Raciones*).
  2. Evalúa en tiempo real si el producto disponible soporta el cocinado, evaluando además el `rendimiento` del ingrediente (ej. las patatas tras pelarse pierden el 20%). 
  3. Si la operación va a dejar un ingrediente por debajo de cero gramos, **simula todo antes de guardar**, y retorna un JSON con el aborigen `faltantes` al front, denegando el proceso para no generar fallos contables. Si hay stock suficiente, elabora todo e inserta Movimientos Automáticos de tipo "SALIDA".

### C) Costeo Estático con Escandallos (`escandallo.controllers.ts`)
- A diferencia de la receta (dinámica por naturaleza, que puede cambiar según los precios de los proveedores cada mes), este controlador toma una "foto fija" en el tiempo. Copia con iteraciones las entidades de los ingredientes a la tabla `escandallo_detalle`. Su objetivo futuro es permitir valoración de márgenes brutos sobre platos independientemente de la recetuación oficial modificada con posterioridad a la creación del mismo.

---

## 4. Filtrado, Seguridad e Identidad (`middlewares` & `auth`)

### En el Login y Base (`auth.controller.ts` y JWT)
- **Generador de Apodos (`username`)**: Automáticamente crea cadenas sanitizadas y libres de tildes/espacios con la regla *"1 caracter de nombre + 3 apellido + etc"*, haciendo repeticiones e iterando sobre la base de datos hasta hallar la forma secuencial final (`sgarmar1, sgarmar2...`).
- **El factor Primer Login (`primer_login`)**: Cuando el controlador expide el ticket post-identificación de Password Genérica (ej. `Economato123`), devuelve un objeto interceptor booleano `requiereCambioPass`, obligando al Frontend a desplegar un pop-up de recambio antes de darle la bienvenida real.
- **Los `middlewares` (`auth.middleware.ts`)**:
  - Toman el token cifrado del encabezado y lo resuelven matemáticamente mediante la semilla alojada en la variable de entorno o `utils/jwt.ts`.
  - La función `requireRole` normaliza (quita espacios, tildes, mayúsculas) y determina si tu ID de encriptación está apto para consumir controlers bloqueados en las subrutas para administrativos (evitando manipulación mediante Postman por parte del alumnado).

---

## 5. Arquitectura Predictiva de Zod (`schemas`)

Para detener "petardazos" internos que crasheen Prisma, se usan clases del esquema de validez, como `ingredient.schema.ts` o `auth.schema.ts`, actuando de la siguiente manera:
- **`schemaValidator()`**: Una fábrica situada en `validator.middleware.ts`. Atrapa un requerimiento.  
- Si se envía `"stock": -4`, Zod lo reconoce y lanza exepciones *issues* mapeadas antes incluso de entrar a los controllers, salvando memoria y bloqueando comportamientos indeseables de los form models desde React/Angular.

---

## 6. Hardware de IOT (Internet Receptivo) (`services/bascula.service.ts`)

Con este archivo asíncrono, SmartEconomato sale del formato App-Web para conectarse con el mundo exterior (Maquinaria USB).
- **El Escucha de Puerto Serie (`SerialPort`)**: Bloque activo en modo Daemon que mapea físicamente un driver del Sistema/Placa Base (`COM1` por defecto, con banda estática a `9600 Baudios`).
- **La Fragmentación del Buff**, en `extraerTramas(buf)`: Los puertos serie fallan en lectura paralela contínua si no se fracciona un buffer de bits. Aquí la arquitectura usa el protocolo de empaquetado por hardware **STX (0x02 "Start of text")** y **ETX (0x03 "End of text")**. Coge un tren de impulsos que no sabe cuánto tardan entre sí y va partiendo la rama hasta encontrar el fin de carga o caracteres de espacio regular como un `\r` (Retorno de Carro).
- **La Extracción Numérica (`parsePeso`)**: Usa Regex (`/[-+]?\d+(?:\.\d+)?/g`) para extirpar puramente la medida si en el LCD saliera `+0124.0 kg`.
- **Transmisión de Salida (`Server as SocketIOServer`)**: Cada vez que el sensor capta un cambio con respecto a su milisegundo anterior, detona la directriz asíncrona de evento (un `io.emit`) a una sala compartida en la que todos los frontales estén suscritos y viendo parpadear su respectivo monitor, sin realizar continuas sentencias pesadas sobre su navegador para traer actualizaciones vía HTTP de pooling. 

---

_Con esta extensión de documentación, tienes la visión microscópica y macroscópica de por qué cada archivo está escrito de tal forma y cómo previene tanto colapsos de información, errores asíncronos y sobre-lectura paralela del stock._
