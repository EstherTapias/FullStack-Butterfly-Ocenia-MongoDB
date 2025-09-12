// app.js
import express from 'express';
import cors from 'cors';
import { connectDB, closeDB } from './database/db_connection.js';
import butterflyRoutes from './routes/butterflyRoutes.js';

const app = express();

// Middleware
app.use(cors()); // permite peticiones desde cualquier dominio
app.use(express.json()); // Para leer JSON en peticiones
app.use(express.urlencoded({ extended: true })); // Para formularios

// Ruta raíz
app.get("/", (req, res) => {
  res.send("🦋 Butterfly API - ¡Bienvenido!");
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
    // No cerramos la app automáticamente para evitar que Jest falle
  }
};

// Inicializar la conexión a la base de datos solo si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
  initializeApp();
}

// Configuración del puerto
const PORT = process.env.PORT || 8000;

export const server = app.listen(PORT, () => {
  console.log(`🚀 Butterfly API server running on http://localhost:${PORT}/`);
  console.log(`📖 Access butterflies at http://localhost:${PORT}/butterflies`);
});

export { app };