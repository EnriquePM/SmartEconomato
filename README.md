# SmartEconomato 🛒

**Repositorio de Trabajo del SmartEconomato del grupo Hopper**

## 👥 Miembros del Equipo

- [ ] Javier
- [ ] Cristina
- [ ] Sergio
- [ ] Enrique

## 🎯 Objetivo del Proyecto

Desarrollar una aplicación SmartEconomato que permita gestionar productos, inventario, pedidos y usuarios de manera eficiente.

## 🚀 Características Principales

- Gestión de productos y categorías
- Control de inventario en tiempo real
- Sistema de pedidos y carrito de compra
- Autenticación y gestión de usuarios
- Interfaz responsive para móvil y escritorio

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Base de Datos**: MongoDB
- **Autenticación**: JWT, bcrypt
- **Despliegue**: Vercel

## 📂 Estructura del Proyecto

```
SmartEconomato/
├── public/              # Archivos estáticos y frontend
├── src/                 # Lógica de la aplicación
│   ├── controllers/     # Controladores de la lógica
│   ├── models/          # Modelos de datos
│   ├── routes/          # Rutas de la API
│   └── server.js        # Punto de entrada de la aplicación
├── .env                 # Variables de entorno
├── package.json         # Dependencias del proyecto
└── README.md            # Documentación del proyecto
```

## ⚙️ Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <url-del-repositorio>
   cd SmartEconomato
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crea un archivo `.env` en la raíz con las siguientes variables:

   ```env
   PORT=3002
   MONGODB_URI=mongodb://localhost:27017/smarteconomato
   JWT_SECRET=tu_secreto_jwt
   ```

4. **Iniciar la aplicación**
   ```bash
   npm start
   ```

## 💻 Uso

La aplicación estará disponible en `http://localhost:3002`

## 🤝 Contribuciones

1. Crear una rama para tu feature:

   ```bash
   git checkout -b feature/nombre-de-la-feature
   ```

2. Realizar cambios y commitear:

   ```bash
   git add .
   git commit -m "feat: descripción de los cambios"
   ```

3. Subir la rama al repositorio:

   ```bash
   git push origin feature/nombre-de-la-feature
   ```

4. Crear un Pull Request para revisión.

## 📝 Notas Importantes

- Mantener el código limpio y bien documentado
- Seguir las convenciones de nombrado del proyecto
- Realizar pruebas antes de subir cambios

## 📄 Licencia

Este proyecto es de código cerrado y pertenece al grupo Hopper.

---

**Desarrollado por el grupo Hopper**
