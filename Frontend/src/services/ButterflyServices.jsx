import axios from 'axios';

// URL simple para desarrollo local
const URL_API = "http://localhost:8000/butterflies";

// Configuración de axios con timeout
const axiosConfig = {
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  }
};

//Metodo GET para el READ
//Para ver TODAS las Mariposas
export const getAllButterflies = async() => {
    try {
        console.log(`🔍 Fetching butterflies from: ${URL_API}`);
        const res = await axios.get(URL_API, axiosConfig);
        return res.data; 
    } 
    catch(error) {
        console.error(`getAllButterflies error:`, error);
        throw error;
    }
}

//Para ver de a UNA SOLA Mariposa
export const getOneButterfly = async (id) => {
    try {
        const res = await axios.get(`${URL_API}/${id}`, axiosConfig);
        return res.data;
    } 
    catch (error) {
        console.error(`getOneButterfly ID ${id} error:`, error.message);
        throw error; 
    }
};

//Metodo POST para el CREATE
export const createButterfly = async(newbutterfly) => {
    try {
        const res = await axios.post(URL_API, newbutterfly, axiosConfig);
        return res.data;
    }
    catch (error) {
        console.error(`createButterfly error:`, error.message);
        throw error;
    }
};

//Metodo PUT para ACTUALIZAR
export const updateButterfly = async (id, editedButterfly) => {
    try {
        const res = await axios.put(`${URL_API}/${id}`, editedButterfly, axiosConfig);
        return res.data;
    }
    catch (error) {
        console.error(`updateButterfly ID ${id} error:`, error.message);
        throw error;
    }
}

//Metodo DELETE para ELIMINAR
export const deleteButterfly = async (id) => {
    try {
        const res = await axios.delete(`${URL_API}/${id}`, axiosConfig);
        return res.data;
    }
    catch (error) {
        console.error(`deleteButterfly ID ${id} error:`, error.message);
        throw error;
    }
}