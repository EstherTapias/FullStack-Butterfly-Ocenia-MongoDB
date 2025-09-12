import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importa tu modelo (ajusta la ruta según tu estructura)
import Butterfly from '../../models/ButterflyModel.js';

// Función para conectar a la base de datos
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/butterflies-db');
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
}

// Función para cargar y insertar datos
async function seedButterflies() {
  try {
    // Verificar si ya existen datos
    const existingCount = await Butterfly.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  Ya existen ${existingCount} mariposas en la base de datos`);
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise(resolve => {
        rl.question('¿Quieres eliminar los datos existentes y recargar? (y/N): ', resolve);
      });
      rl.close();
      
      if (answer.toLowerCase() !== 'y') {
        console.log('❌ Operación cancelada');
        return;
      }
      
      await Butterfly.deleteMany({});
      console.log('🗑️  Datos existentes eliminados');
    }

    // Cargar datos del archivo JSON
    const dataPath = path.join(__dirname, '../butterflies-data.json');
    const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const butterfliesData = jsonData.butterfly || jsonData; // Soporta ambos formatos
    
    console.log(`📁 Cargando ${butterfliesData.length} mariposas...`);
    
    // Insertar datos usando insertMany para mejor rendimiento
    const result = await Butterfly.insertMany(butterfliesData, {
      ordered: false // Continúa insertando aunque falle alguno
    });
    
    console.log(`✅ ${result.length} mariposas insertadas correctamente`);
    
    // Mostrar algunas estadísticas
    const totalByRegion = await Butterfly.aggregate([
      { $group: { _id: '$region', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n📊 Estadísticas por región:');
    totalByRegion.forEach(region => {
      console.log(`   ${region._id}: ${region.count} especies`);
    });
    
  } catch (error) {
    console.error('❌ Error insertando datos:', error);
    if (error.writeErrors) {
      console.error('Errores específicos:', error.writeErrors);
    }
  }
}

// Función principal
async function main() {
  await connectDB();
  await seedButterflies();
  
  console.log('\n🎉 Proceso completado');
  process.exit(0);
}

// Ejecutar solo si se llama directamente
main().catch(error => {
  console.error('❌ Error general:', error);
  process.exit(1);
});