# 📋 Changelog — SmartEconomato Backend

## [Commit: 6623015] — Mis cambios en el backend

**Rama:** `backend/sergio-updates`
**Fecha:** 2026-03-12

---

## 🆕 Nuevos Archivos (Añadidos)

### Controllers

| Archivo                                     | Descripción                            |
| ------------------------------------------- | -------------------------------------- |
| `src/controllers/categoria.controllers.ts`  | Controlador para gestión de categorías |
| `src/controllers/escandallo.controllers.ts` | Controlador para escandallos           |
| `src/controllers/movimiento.controllers.ts` | Controlador para movimientos de stock  |
| `src/controllers/proveedor.controllers.ts`  | Controlador para proveedores           |
| `src/controllers/receta.controllers.ts`     | Controlador para recetas               |

### Routes

| Archivo                           | Descripción                      |
| --------------------------------- | -------------------------------- |
| `src/routes/categoria.routes.ts`  | Rutas de la API para categorías  |
| `src/routes/escandallo.routes.ts` | Rutas de la API para escandallos |
| `src/routes/movimiento.routes.ts` | Rutas de la API para movimientos |
| `src/routes/proveedor.routes.ts`  | Rutas de la API para proveedores |
| `src/routes/receta.routes.ts`     | Rutas de la API para recetas     |

### Middlewares & Schemas

| Archivo                                   | Descripción                             |
| ----------------------------------------- | --------------------------------------- |
| `src/middlewares/validator.middleware.ts` | Middleware de validación para las rutas |
| `src/schemas/auth.schema.ts`              | Schema de validación para autenticación |
| `src/schemas/ingredient.schema.ts`        | Schema de validación para ingredientes  |

---

## ✏️ Archivos Modificados

### Core

| Archivo                | Descripción                                           |
| ---------------------- | ----------------------------------------------------- |
| `src/index.ts`         | Registro de las nuevas rutas en el servidor principal |
| `prisma/schema.prisma` | Actualización del modelo de base de datos             |

### Controllers

| Archivo                              |
| ------------------------------------ |
| `src/controllers/auth.controller.ts` |
| `src/controllers/user.controller.ts` |

### Routes

| Archivo                           |
| --------------------------------- |
| `src/routes/auth.routes.ts`       |
| `src/routes/ingredient.routes.ts` |
| `src/routes/material.routes.ts`   |
| `src/routes/recursos.routes.ts`   |
| `src/routes/user.routes.ts`       |

### Dependencias

| Archivo             |
| ------------------- |
| `package.json`      |
| `package-lock.json` |

---

## 📊 Resumen

|                             | Cantidad |
| --------------------------- | -------- |
| ✅ Archivos nuevos          | 13       |
| ✏️ Archivos modificados     | 11       |
| 📝 Líneas añadidas          | ~777     |
| ❌ Líneas eliminadas        | ~31      |
| 📁 Total archivos afectados | 24       |
