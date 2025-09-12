// models/ButterflyModel.js
import mongoose from 'mongoose';

const butterflySchema = new mongoose.Schema({
    // nombre común de la mariposa - Obligatorio
    commonName: {
        type: String,
        required: [true, 'El nombre común es obligatorio'],
        trim: true
    },
    
    // nombre científico - Obligatorio y único
    scientificName: {
        type: String,
        required: [true, 'El nombre científico es obligatorio'],
        unique: true,
        trim: true
    },
    
    // Familia - Obligatorio
    family: {
        type: String,
        required: [true, 'La familia es obligatoria'],
        trim: true
    },
    
    // región de la mariposa - Obligatorio
    region: {
        type: String,
        required: [true, 'La región es obligatoria'],
        trim: true
    },
    
    // Localización específica
    specificLocation: {
        type: String,
        default: null,
        trim: true
    },
    
    // Hábitat de la mariposa
    habitat: {
        type: String,
        default: null,
        trim: true
    },
    
    // Tamaño de la ala de la mariposa
    wingspan: {
        type: Number,
        default: null,
        min: [0, 'El tamaño del ala no puede ser negativo']
    },
    
    // Unidad de medida de la ala
    wingspanUnit: {
        type: String,
        default: null,
        trim: true
    },
    
    // descripción de la mariposa
    description: {
        type: String,
        default: null,
        trim: true
    },
    
    // estado de conservación de la mariposa
    conservationStatus: {
        type: String,
        default: null,
        trim: true
    },
    
    // Nivel de preocupación - Obligatorio
    threatLevel: {
        type: String,
        required: [true, 'El nivel de amenaza es obligatorio'],
        trim: true
    },
    
    // cantidad actual de la mariposa
    population: {
        type: String,
        default: null,
        trim: true
    },
    
    // Temporada de vuelo (array de datos)
    flightSeason: {
        type: [String],
        default: []
    },
    
    // Plantas hospederas (array de datos)
    hostPlants: {
        type: [String],
        default: []
    },
    
    // Fuentes de néctar (array de datos)
    nectarSources: {
        type: [String],
        default: []
    },
    
    // Comportamiento de la mariposa
    behavior: {
        type: String,
        default: null,
        trim: true
    },
    
    // Coordenadas
    coordinates: {
        latitude: {
            type: Number,
            default: null
        },
        longitude: {
            type: Number,
            default: null
        }
    },
    
    // Color primario
    colorPrimary: {
        type: String,
        default: null,
        trim: true
    },
    
    // Tags (array de datos)
    tags: {
        type: [String],
        default: []
    },
    
    // ID público para Cloudinary
    publicId: {
        type: String,
        default: null,
        trim: true
    }
}, {
    timestamps: true // Cambié a true para tener fechas de creación/actualización
});

// Índices para mejorar performance en búsquedas
butterflySchema.index({ scientificName: 1 });
butterflySchema.index({ commonName: 1 });
butterflySchema.index({ region: 1 });
butterflySchema.index({ family: 1 });

// Middleware para limpiar arrays antes de guardar
butterflySchema.pre('save', function(next) {
    // Limpiar elementos vacíos de los arrays
    if (this.flightSeason) {
        this.flightSeason = this.flightSeason.filter(item => item && item.trim());
    }
    if (this.hostPlants) {
        this.hostPlants = this.hostPlants.filter(item => item && item.trim());
    }
    if (this.nectarSources) {
        this.nectarSources = this.nectarSources.filter(item => item && item.trim());
    }
    if (this.tags) {
        this.tags = this.tags.filter(item => item && item.trim());
    }
    
    next();
});

// Crear el modelo
const ButterflyModel = mongoose.model('Butterfly', butterflySchema);

export default ButterflyModel;