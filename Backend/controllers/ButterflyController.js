// controllers/ButterflyController.js
import ButterflyModel from "../models/ButterflyModel.js";

// GET all butterflies
export const getAllButterflies = async(req, res) => {
    try {
        const butterflies = await ButterflyModel.find();
        res.status(200).json(butterflies);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET one butterfly
export const getOneButterfly = async(req, res) => {
    try {
        const { id } = req.params;
        const butterfly = await ButterflyModel.findById(id);
        
        if (!butterfly) {
            return res.status(404).json({ message: "Butterfly not found" });
        }
        
        res.status(200).json(butterfly);
    } catch (error) {
        // Manejar error de ObjectId inválido
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid butterfly ID" });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// DELETE one butterfly
export const deleteButterfly = async(req, res) => {
    try {
        const { id } = req.params;
        const butterfly = await ButterflyModel.findByIdAndDelete(id);

        if (!butterfly) {
            return res.status(404).json({ message: "Butterfly not found" });
        }
        
        return res.status(200).json({ message: "The butterfly has been deleted successfully!" });
        
    } catch (error) {
        // Manejar error de ObjectId inválido
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid butterfly ID" });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// POST one butterfly
export const createButterfly = async(req, res) => {
    try {
        console.log("=== DATOS RECIBIDOS EN BACKEND ===");
        console.log(JSON.stringify(req.body, null, 2));
        console.log("=== CONTENT TYPE ===");
        console.log(req.headers['content-type']);
        console.log("=====================================");
        
        const butterfly = new ButterflyModel(req.body);
        const savedButterfly = await butterfly.save();
        return res.status(201).json({ 
            message: "Butterfly created successfully", 
            butterfly: savedButterfly 
        });
    } catch (error) {
        console.error("=== ERROR EN CREATEBUTTERFLY ===");
        console.error("Error completo:", error);
        console.error("Error message:", error.message);
        console.error("Error name:", error.name);
        
        // Manejar errores de validación
        if (error.name === 'ValidationError') {
            console.error("Errores de validación específicos:", error.errors);
            const errors = {};
            Object.keys(error.errors).forEach(key => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).json({ 
                message: "Validation error", 
                errors 
            });
        }
        
        // Manejar error de duplicado (unique constraint)
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ 
                message: `${field} already exists` 
            });
        }
        
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// UPDATE one butterfly
export const updateButterfly = async(req, res) => {
    try {
        const { id } = req.params;
        const butterfly = await ButterflyModel.findByIdAndUpdate(
            id, 
            req.body, 
            { 
                new: true,        // Devolver el documento actualizado
                runValidators: true // Ejecutar validaciones del schema
            }
        );

        if (!butterfly) {
            return res.status(404).json({ message: "Butterfly not found" });
        }

        return res.status(200).json(butterfly);
    } catch (error) {
        // Manejar error de ObjectId inválido
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid butterfly ID" });
        }
        
        // Manejar errores de validación
        if (error.name === 'ValidationError') {
            const errors = {};
            Object.keys(error.errors).forEach(key => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).json({ 
                message: "Validation error", 
                errors 
            });
        }
        
        // Manejar error de duplicado (unique constraint)
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ 
                message: `${field} already exists` 
            });
        }
        
        console.error("ERROR en updateButterfly", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};