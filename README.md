# Local Hands
Aplicación para la gestión de usuarios, administradores y productos desarrollada con **Node.js**, **Express** y **PostgreSQL**. El proyecto surge en el marco de la materia *Ingeniería Web II* para poner en práctica la construcción de un backend completo junto a una interfaz web sencilla.

## Tecnologías usadas
- **Node.js** y **Express** para el servidor
- **Sequelize** como ORM
- **PostgreSQL** para la base de datos
- **JSON Web Tokens** para autenticación
- **Multer** para subir imágenes
- HTML, CSS y Bootstrap en el frontend

## Estructura principal
- `backend/` – código de la API Express
- `frontend/` – archivos estáticos de la interfaz
- `migrations/` – migraciones de Sequelize
- `uploads/` – imágenes subidas por los usuarios

## Funcionalidades
- Registro y login de usuarios con JWT
- Autenticación y panel para administradores
- CRUD de productos y perfiles de usuario
- Sistema de advertencias para usuarios
- Carga de imágenes para productos y perfiles

## Instalación rápida

1. Clonar el repositorio
   ```bash
   git clone https://github.com/bautimacedo/AppWebPage.git
   cd AppWebPage
   ```
2. Instalar dependencias
   ```bash
   npm install
   ```
3. Crear un archivo `.env` con los parámetros de la base y las claves JWT
   ```ini
   DB_NAME=tu_basedatos
   DB_USER=usuario
   DB_PASSWORD=clave
   DB_HOST=localhost
   DB_PORT=5432
   JWT_SECRET=tu_clave
   JWT_ADMIN_SECRET=otra_clave
   ```
4. Ejecutar el servidor
   ```bash
   npm start
   # o directamente: node backend/src/index.js
   ```

## Uso

La interfaz se encuentra en `frontend/home.html`. La API expone, entre otras, las siguientes rutas:

- `/register` y `/login` – registro e inicio de sesión de usuarios
- `/login-admin` – autenticación de administradores
- `/api/users` – operaciones sobre usuarios
- `/api/products` – operaciones sobre productos
- `/api/profile` – gestión del perfil autenticado
- `/api/admin` – acciones exclusivas de administradores

Con esto podrás iniciar el proyecto localmente y explorar cada sección.