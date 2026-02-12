# Paso 1: Instalar las librerías Como la carpeta node_modules no se sube, tenéis que descargarla. En la terminal del proyecto:
npm install
# Paso 2: Configurar el entorno (.env) El proyecto necesita saber dónde está la base de datos.
- Cread un archivo nuevo llamado .env en la raíz.
- Copiad el contenido de .env.example.
IMPORTANTE: Poned la URL de conexión a la base de datos correcta (si usáis una compartida en la nube, pedidme el link. Si usáis una local, poned vuestra contraseña de PostgreSQL).
# Paso 3: Generar el Cliente de Prisma Para que TypeScript entienda la base de datos, ejecutad este comando:
npx prisma generate
# Paso 4: Arrancar el servidor:
npm run dev
# Paso 5: Montar Base de Datos:
Crear la base de datos vacía solo el nombre, smartEconomato, y hacer este comando ---> npx prisma db push



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