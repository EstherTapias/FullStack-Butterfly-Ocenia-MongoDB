import express from 'express';
import cors from 'cors';
import { connectDB, closeDB } from './database/db_connection.js';
import butterflyRoutes from './routes/butterflyRoutes.js';

const app = express();

// Configuración de CORS para desarrollo local
const corsOptions = {
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'http://localhost:5174',
    'http://127.0.0.1:5173', 
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5174'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization'
  ]
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging para desarrollo
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Ruta raíz
app.get("/", (req, res) => {
  res.json({ 
    message: "🦋 Butterfly API - ¡Bienvenido!",
    status: "running",
    environment: "development",
    timestamp: new Date().toISOString(),
    endpoints: {
      butterflies: "/butterflies",
      health: "/health"
    }
  });
});

// Ruta de health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Rutas de la API
app.use('/butterflies', butterflyRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: err.message,
    timestamp: new Date().toISOString()
  });
});

// Ruta para manejar 404
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Configuración de base de datos
const initializeApp = async () => {
  try {
    await connectDB();
    console.log('🦋 Database connected successfully');
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`);
    // No terminar el proceso, solo loggear el error
    console.log('⚠️  Server will continue without database connection');
  }
};

// Inicializar la conexión a la base de datos solo si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
  initializeApp();
}

// Configuración del puerto y servidor
const PORT = process.env.PORT || 8000;
let server;

// Función para iniciar el servidor
const startServer = () => {
  server = app.listen(PORT, () => {
    console.log(`🚀 Butterfly API server running on http://localhost:${PORT}/`);
    console.log(`📖 Access butterflies at http://localhost:${PORT}/butterflies`);
    console.log(`🏥 Health check at http://localhost:${PORT}/health`);
    console.log(`🌍 Environment: development`);
  });

  // Manejo de errores del servidor
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`❌ Port ${PORT} is already in use`);
      console.log('💡 Try running: lsof -ti:8000 | xargs kill -9');
      process.exit(1);
    } else {
      console.error('Server error:', err);
    }
  });
};

// Solo crear el servidor en desarrollo local
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

// Manejo de cierre graceful
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received');
  if (server) {
    server.close(() => {
      console.log('🔒 Server closed');
      closeDB();
      process.exit(0);
    });
  }
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received');
  if (server) {
    server.close(() => {
      console.log('🔒 Server closed');
      closeDB();
      process.exit(0);
    });
  }
});

// Exportar todo al final
export default app;
export { app, server };