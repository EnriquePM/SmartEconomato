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

