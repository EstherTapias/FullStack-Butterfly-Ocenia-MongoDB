import express from 'express';
import cors from 'cors';
import { connectDB, closeDB } from './database/db_connection.js';
import butterflyRoutes from './routes/butterflyRoutes.js';

const app = express();

// Configuración de CORS para Vercel
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, 'https://your-app.vercel.app'] // Cambia por tu dominio real
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raíz
app.get("/", (req, res) => {
  res.json({ 
    message: "🦋 Butterfly API - ¡Bienvenido!",
    status: "running",
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rutas de la API
app.use('/butterflies', butterflyRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Ruta para manejar 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Configuración de base de datos
const initializeApp = async () => {
  try {
    await connectDB();
    console.log('🦋 Database connected successfully');
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`);
  }
};

// Inicializar la conexión a la base de datos solo si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
  initializeApp();
}

// Configuración del puerto y servidor
const PORT = process.env.PORT || 8000;
let server;

// Solo crear el servidor si no estamos en producción (Vercel maneja esto)
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(`🚀 Butterfly API server running on http://localhost:${PORT}/`);
    console.log(`📖 Access butterflies at http://localhost:${PORT}/butterflies`);
  });
}

// Exportar todo al final
export default app;
export { app, server };