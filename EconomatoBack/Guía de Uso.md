# 🚀 Configuración Rápida del Backend

⚠️ **Importante:** Asegúrate de tener **Docker Desktop** abierto y ejecutándose en tu ordenador antes de empezar.

Para levantar todo el entorno de desarrollo de una sola vez, primero crea un archivo `.env` dentro de la carpeta `EconomatoBack` (puedes copiar el contenido de `.env.example`) y asegúrate de incluir esta línea exacta para conectar con Docker:

`DATABASE_URL="postgresql://admin:admin@localhost:5432/smart_economato?schema=public"`

Una vez guardado el `.env`, abre tu terminal en la **raíz del proyecto** (`SMARTECONOMATO`) y ejecuta esta secuencia de comandos para levantarlo todo:

# 1. Levanta el contenedor de la base de datos
docker-compose up -d

# 2. Entra a la carpeta del servidor e instala las librerías
cd EconomatoBack
npm install

# 3. Genera el cliente de Prisma para TypeScript
npx prisma generate

# 4. Monta las tablas e inyecta los datos de prueba automáticamente
npm run db:setup

# 5. Arranca el servicio desde la raíz
npm run dev



# Rutas
## Usuario
- Registrar Alumno	        POST	http://localhost:3000/api/auth/register/alumno
- Iniciar Sesión	        POST	http://localhost:3000/api/auth/login
- Ver todos los usuarios	GET     http://localhost:3000/api/usuarios
- Cambiar Contraseña	    POST	http://localhost:3000/api/auth/change-password
- Resetear Password 	    PUT 	http://localhost:3000/api/usuarios/:id/reset-password
- ¿Modificar valores?       PUT     http://localhost:3000/api//usuarios/:id
- Registrar Profesor        POST    http://localhost:3000/api/auth/register/profesor
- Eliminar Usuario          DELETE  http://localhost:3000/api/users/:id
## Ingredientes
- Listar todos              GET     http://localhost:3000/api/ingredientes
- Ver un ingrediente        GET     http://localhost:3000/api/ingredientes/:id
- Crear ingrediente         POST    http://localhost:3000/api/ingredientes
- Editar ingrediente        PUT     http://localhost:3000/api/ingredientes/:id
- Borrar ingrediente        DELETE  http://localhost:3000/api/ingredientes/:id
## Recursos
- Categorías                GET     http://localhost:3000/api/categorias
- Proveedores               GET     http://localhost:3000/api/proveedores 
## Pedidos 
- Listar pedidos            GET     http://localhost:3000/api/pedidos
- Crear Pedido              POST    http://localhost:3000/api/pedidos
- Eliminar Pedido           DELETE  http://localhost:3000/api/pedidos/:id
- Validar                   PUT     http://localhost:3000/api/pedidos/:id
- Confirmar                 PUT     http://localhost:3000/api/pedidos/:id/confirmar

## Recetas
- Listar recetas            GET     http://localhost:3000/api/recetas
- Ver una receta            GET     http://localhost:3000/api/recetas/:id
- Crear receta              POST    http://localhost:3000/api/recetas
- Editar receta             PUT     http://localhost:3000/api/recetas/:id
- Eliminar receta           DELETE  http://localhost:3000/api/recetas/:id

### Body de creación/edición de recetas
Se aceptan ambas formas para los ingredientes:

Opción A (backend tradicional):
{
  "nombre": "Tortilla de patata",
  "descripcion": "Receta base",
  "cantidad_platos": 4,
  "ingredientes": [
    { "id_ingrediente": 1, "cantidad": 0.8, "rendimiento": 100 },
    { "id_ingrediente": 2, "cantidad": 0.4, "rendimiento": 95 }
  ]
}

Opción B (compatibilidad con frontend hardcodeado):
{
  "nombre": "Tortilla de patata",
  "descripcion": "Receta base",
  "cantidad_platos": 4,
  "receta_ingrediente": [
    { "id_ingrediente": 1, "cantidad": 0.8, "rendimiento": 100 },
    { "id_ingrediente": 2, "cantidad": 0.4, "rendimiento": 95 }
  ]
}


# Como crear un usuario mediante Thunder Client
## Paso 1
http://localhost:3000/api/auth/register Método POST
body:
{
  "nombre": "Nombre",
  "apellido1": "Apellido1",
  "apellido2": "Apellido2",
  "email": "",
  "rol": "PROFESOR"
}

Dale a Send y comprueba a la derecha que te devuelve el código 200OK
Si está correcto vete al login e introduce el usuario que te genera y la contraeña genérica Economato123, ahora te redirigirá al
cambio de contraseña segura. Una vez establecida, repite el login pero con tu contraseña nueva. 
