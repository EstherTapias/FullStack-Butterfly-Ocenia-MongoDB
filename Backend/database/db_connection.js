// database/db_connection.js
import mongoose from 'mongoose';
import '@dotenvx/dotenvx/config'; 

// Configurar la conexión de MongoDB
const connectDB = async () => {
    try {
        // Usar la URI de MongoDB - soporta tanto MONGO_URI como MONGODB_URI
        const mongoURI = process.env.NODE_ENV === 'test' 
            ? (process.env.MONGODB_URI_TEST || process.env.MONGO_URI_TEST)
            : (process.env.MONGODB_URI || process.env.MONGO_URI);

        const conn = await mongoose.connect(mongoURI, {
            // Opciones de conexión recomendadas
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

// Función para cerrar la conexión
const closeDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed');
    } catch (error) {
        console.error(`❌ Error closing MongoDB connection: ${error.message}`);
    }
};

// Función para limpiar la base de datos (útil para tests)
const dropDB = async () => {
    try {
        await mongoose.connection.dropDatabase();
        console.log('✅ Database dropped successfully');
    } catch (error) {
        console.error(`❌ Error dropping database: ${error.message}`);
    }
};

export { connectDB, closeDB, dropDB };
export default mongoose.connection;