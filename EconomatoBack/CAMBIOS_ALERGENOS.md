# Resumen de Cambios: Sistema de Alérgenos

Este documento detalla todos los ficheros creados y modificados para implementar el sistema de alérgenos en productos (Ingredientes).

## Base de Datos (PRISMA)
* **Modificado**: `prisma/schema.prisma`
  * Se ha creado un nuevo modelo `alergeno` (campos `id_alergeno`, `nombre`, `icono`).
  * Se ha añadido una relación implícita Muchos a Muchos en el modelo `ingrediente` (`alergenos alergeno[]`).
* *Nota: La base de datos fue actualizada automáticamente ejecutando `npx prisma db push` y luego `npx prisma generate`.*

## Backend (`EconomatoBack/src/`)
* **Nuevo Fichero**: `controllers/alergeno.controller.ts`
  * Función `getAlergenos` para devolver (`GET`) todos los alérgenos de la base de datos al Front.
* **Nuevo Fichero**: `routes/alergeno.routes.ts`
  * Expone el controlador anterior en su propia ruta.
* **Modificado**: `index.ts`
  * Se registró la nueva ruta (`app.use('/api/alergenos', alergenoRoutes);`).
* **Modificado**: `schemas/ingredient.schema.ts`
  * Se modificaron los validadores Zod de creación y actualización para permitir el array `alergenosIds`.
* **Modificado**: `controllers/ingredient.controller.ts`
  * `createIngrediente`: Ahora recibe `alergenosIds` y utiliza la sintaxis `connect` de prisma para asociarlos en base de datos.
  * `updateIngrediente`: Ahora recibe `alergenosIds` y utiliza la sintaxis `set` para resetear/asociar los nuevos en base de datos al editar.
  * `getIngredientes`: Se le añadió un `include: { alergenos: true }` para que al devolver productos al front vengan acompañados de sus alérgenos.

## Frontend (`EconomatoFront/src/`)
* **Modificado**: `services/recursos.service.ts`
  * Se añadió el interface TypeScript `Alergeno`.
  * Se creó la nueva función asíncrona `getAlergenos()` para comunicarse con la API de express.
* **Modificado**: `pages/IngresarProducto.tsx`
  * Se añadió una petición extra en el `useEffect` para cargar la lista de alérgenos disponibles en paralelo.
  * Se añadió visualmente una lista de botones tipo 'chips' que actúan como checkboxes. Al hacer click en uno, este cambia a diseño azul y se guarda en un array llamado `alergenosSeleccionados`.
  * Ese array se inyecta en el objeto que el formulario le manda por POST al backend.
* **Modificado**: `pages/Inventario.tsx`
  * Se actualizó la interfaz TypeSript local `Producto` para soportar `alergenos`.
  * En la cabecera de la tabla (UI) se añadió la nueva columna `Alérgenos` previa a la columna Stock.
  * Para cada fila de ingrediente, la nueva columna renderiza un badge verde/naranja con los alérgenos configurados para ese ingrediente (o un guiôn '-' si no tiene).
