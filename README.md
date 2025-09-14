# 🦋 Backend MongoDB - Mariposas de Oceanía

Bienvenida/o al **backend con MongoDB Atlas** del proyecto **Mariposas de Oceanía** . Este repositorio contiene la API REST desarrollada para gestionar la información de las hermosas mariposas que habitan en la región de Oceanía.

## 📖 Descripción del Proyecto

Este backend forma parte de un proyecto colaborativo donde he desarrollado la **API con MongoDB Atlas** para complementar el frontend de **Mariposas de Oceanía** creado por mis compañeras de bootcamp. 

La aplicación permite:
* 🔍 **Consultar información** detallada de mariposas oceánicas
* 📊 **Gestionar datos** a través de MongoDB Atlas (cloud)
* 🌐 **API REST** completa con operaciones CRUD
* 🔒 **Validaciones** robustas de datos
* 📋 **Datos precargados** con script de inicialización

## 🗂️ Estructura del Proyecto

```
Backend/
 ┣ controllers/           # Lógica de controladores
 ┣ database/             # Configuración MongoDB Atlas
 ┣ models/               # Modelos Mongoose
 ┣ node_modules/         # Dependencias del proyecto
 ┣ routes/               # Definición de rutas API
 ┣ server/               # Configuración del servidor
 ┃ ┗ scripts/            # Scripts de base de datos
 ┃   ┣ seedDatabase.js   # Script de inicialización
 ┃   ┗ butterflies-data.json # Datos de mariposas
 ┣ test/                 # Tests unitarios
 ┣ validations/          # Validaciones de entrada
 ┣ .env                  # Variables de entorno (crear)
 ┣ .env.keys            # Ejemplo de claves de entorno
 ┣ .gitignore           # Archivos ignorados por Git
 ┣ app.js               # Configuración principal
 ┣ package-lock.json    # Lock de dependencias
 ┗ package.json         # Dependencias y scripts

Frontend/
 ┣ dist/                # Archivos compilados
 ┣ node_modules/        # Dependencias frontend
 ┣ public/              # Archivos públicos estáticos
 ┣ server/              # Configuración servidor frontend
 ┣ src/                 # Código fuente React
 ┣ .gitignore          # Archivos ignorados
 ┣ eslint.config.js    # Configuración ESLint
 ┣ index.html          # HTML principal
 ┣ package-lock.json   # Lock de dependencias
 ┣ package.json        # Dependencias frontend
 ┣ README.md           # Documentación frontend
 ┗ vite.config.js      # Configuración Vite
```

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/mariposas-oceania-mongodb.git
cd mariposas-oceania-mongodb
```

### 2. Instalar dependencias del backend
```bash
cd Backend
npm install
```

### 3. Configurar MongoDB Atlas

#### 3.1. Crear cuenta en MongoDB Atlas
1. Ve a [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crea una cuenta gratuita
3. Inicia sesión en tu dashboard

#### 3.2. Crear un nuevo cluster
1. Haz clic en "Create a New Cluster"
2. Selecciona el plan **FREE** (M0 Sandbox)
3. Elige la región más cercana
4. Nombra tu cluster (ej: `butterflies-cluster`)
5. Haz clic en "Create Cluster"

#### 3.3. Configurar acceso a la base de datos
1. Ve a **Database Access** en el menú lateral
2. Haz clic en "Add New Database User"
3. Crea un usuario con contraseña
4. Asigna el rol **readWrite** a cualquier base de datos

#### 3.4. Configurar acceso de red
1. Ve a **Network Access** en el menú lateral
2. Haz clic en "Add IP Address"
3. Selecciona "Allow Access from Anywhere" (0.0.0.0/0) para desarrollo
4. Confirma los cambios

#### 3.5. Obtener la cadena de conexión
1. Ve a **Clusters** y haz clic en "Connect"
2. Selecciona "Connect your application"
3. Copia la connection string (MongoDB Driver)

### 4. Configurar variables de entorno

Crea un archivo `.env` en la carpeta `Backend/` usando `.env.keys` como referencia:

```env
# Configuración del servidor
PORT=5000
NODE_ENV=development

# Configuración MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@butterflies-cluster.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
DB_NAME=butterflies_app

```

**⚠️ Importante:** Reemplaza `<username>`, `<password>` y `<dbname>` con tus datos reales.

Para encriptar el .env

```
npm run dotenvx:encrypt
```

### 5. Inicializar la base de datos con datos

Ejecuta el script para cargar los datos iniciales de mariposas:

```bash
npm run seed
```

Este comando ejecutará `server/scripts/seedDatabase.js` que cargará los datos desde `butterflies-data.json`.

### 6. Ejecutar el servidor
```bash
# Modo desarrollo (el único script disponible)
npm run dev
```

El servidor estará disponible en `http://localhost:5000`

### 7. Instalar y ejecutar el frontend
```bash
cd ../Frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 🛠️ Tecnologías Utilizadas

### Backend
- ⚡ **Node.js** - Entorno de ejecución
- 🚀 **Express.js** - Framework web
- 🍃 **MongoDB Atlas** - Base de datos NoSQL en la nube
-  **Mongoose** - ODM para MongoDB
- 🔒 **bcryptjs** - Encriptación de contraseñas
- ✅ **express-validator** - Validación de datos
- 🌐 **cors** - Manejo de CORS
- 🔧 **dotenv** - Variables de entorno
- 🧪 **jest** - Testing framework

### Frontend (desarrollado por compañeras)
- ⚛️ **React.js** - Librería UI
- 🎨 **CSS/SCSS** - Estilos
- 📦 **Vite** - Build tool
- 🌐 **Axios** - Cliente HTTP

## 📚 Endpoints de la API

### Mariposas
- `GET /api/butterflies` - Obtener todas las mariposas
- `GET /api/butterflies/:id` - Obtener mariposa por ID
- `POST /api/butterflies` - Crear nueva mariposa
- `PUT /api/butterflies/:id` - Actualizar mariposa
- `DELETE /api/butterflies/:id` - Eliminar mariposa



## 🗄️ Estructura de Datos (MongoDB)

### Colección: butterflies
```json
{
  "_id": "ObjectId",
  "name": "Mariposa Monarca",
  "scientificName": "Danaus plexippus",
  "habitat": "Jardines, campos abiertos",
  "description": "Una mariposa migratoria famosa...",
  "wingspan": "8.9-10.2 cm",
  "conservationStatus": "Preocupación menor",
  "imageUrl": "https://example.com/monarch.jpg",
  "region": "Oceanía",
  "colors": ["naranja", "negro", "blanco"],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 🧪 Ejecutar Tests

```bash
npm run test
```

## 📝 Scripts Disponibles

```bash
npm run dev      # Servidor en modo desarrollo con nodemon
npm start        # Servidor en modo producción
npm run seed     # Inicializar BD con datos de mariposas
npm run test     # Ejecutar tests
```

## 🌟 Características Técnicas

- ✅ **API RESTful** completa con MongoDB
- 🍃 **MongoDB Atlas** - Base de datos en la nube
- **Mongoose** - ODM con esquemas y validaciones
- 🔒 **Validaciones** robustas con express-validator
- 🔄 **Manejo de errores** centralizado
- 📋 **Datos precargados** con script de inicialización
- 🧪 **Tests unitarios** con Jest
- 📝 **Documentación** de API
- 🚀 **Preparado para producción**

## 📊 Datos Incluidos

El proyecto incluye un archivo `butterflies-data.json` con información detallada de mariposas de Oceanía:
- 🦋 Especies nativas de Australia y Nueva Zelanda
- 📸 URLs de imágenes
- 🏞️ Información de hábitats
- 📊 Estados de conservación
- 🔬 Nombres científicos

## 🤝 Colaboradoras del Frontend

Este backend complementa el excelente trabajo frontend realizado por mis compañeras de bootcamp en el proyecto Mariposas de Oceanía.

## 👩‍💻 Desarrollado por

**Esther Tapias**  

🌟 Fullstack Developer en formación 

👩‍✈️ Formada en perfiles Data Scientist | Data Analyst · Bootcampt en Inteligencia en Artificial 

💻 Especializada en Backend con Node.js y MongoDB  

 

📱 **Conéctate conmigo:**
- 🐙 [GitHub](https://github.com/EstherTapias)
- 💼 [LinkedIn](https://www.linkedin.com/in/esther-tapias-paez-camino/)

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

*🦋 "En la nube de MongoDB Atlas, cada mariposa encuentra su hogar digital" ✨*