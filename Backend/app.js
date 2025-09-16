import express from 'express';
import cors from 'cors';
import { connectDB, closeDB } from './database/db_connection.js';
import butterflyRoutes from './routes/butterflyRoutes.js';

const app = express();

// Configuración CORS segura y flexible
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (móvil, apps, Postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.NODE_ENV === 'production' 
      ? [
          process.env.FRONTEND_URL,
          'https://butterfly-frontend-one.vercel.app',
          'https://butterfly-frontend-a11jrb3ah-esthers-projects-69ec9e4c.vercel.app', // ✅ AÑADIR ESTA LÍNEA
          // Mejor aún, usar regex para cualquier deployment de tu frontend:
          /^https:\/\/butterfly-frontend.*\.vercel\.app$/, // ✅ Permite cualquier deployment de tu frontend
          /\.vercel\.app$/, // Permite cualquier subdominio de vercel.app
        ]
      : [
          'http://localhost:5173',
          'http://localhost:3000',
          'http://localhost:3001',
          'http://127.0.0.1:5173',
          /^http:\/\/localhost:\d+$/ // Cualquier puerto en localhost para desarrollo
        ];

    // Verificar si el origin está permitido
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log(`🚫 CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Añadido límite para archivos grandes
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para logs en producción (opcional)
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Ruta raíz
app.get("/", (req, res) => {
  res.json({ 
    message: "🦋 Butterfly API - ¡Bienvenido!",
    status: "running",
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Rutas de la API
app.use('/butterflies', butterflyRoutes);

// Middleware de manejo de errores mejorado
app.use((err, req, res, next) => {
  console.error(`Error ${new Date().toISOString()}:`, err.stack);
  
  // Si es un error de CORS, enviar respuesta más específica
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      message: 'CORS policy violation',
      error: 'Origin not allowed'
    });
  }
  
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Ruta para manejar 404
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Configuración de base de datos
const initializeApp = async () => {
  try {
    await connectDB();
    console.log('🦋 Database connected successfully');
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`);
    // En producción, podrías querer manejar esto de forma diferente
    if (process.env.NODE_ENV === 'production') {
      process.exit(1); // Salir si no hay conexión a BD en producción
    }
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

// Manejo de cierre graceful
process.on('SIGTERM', async () => {
  console.log('🔄 SIGTERM received, shutting down gracefully');
  if (server) {
    server.close(() => {
      console.log('💤 HTTP server closed');
    });
  }
  await closeDB();
  process.exit(0);
});

// Exportar todo al final
export default app;
export { app, server };