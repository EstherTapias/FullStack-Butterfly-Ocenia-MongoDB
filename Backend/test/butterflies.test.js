// test/butterflies.test.js
import request from "supertest";
import { app, server } from "../app.js";
import { connectDB, closeDB, dropDB } from "../database/db_connection.js";
import ButterflyModel from "../models/ButterflyModel.js";

describe('Oceania-Butterflies-Backend-MongoDB', () => {
    beforeAll(async () => {
        try {
            await connectDB();
            console.log('Database connection established successfully.');
            
            // Limpiar la base de datos de pruebas
            await dropDB();
            console.log('Test database cleaned successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
            throw error;
        }
    });

    // GET all butterflies
    describe('GET /butterflies', () => {
        let response;
        beforeEach(async () => {
            response = await request(app).get('/butterflies').send();
        });
        
        test('Should return a response with status 200 and type json', async () => {
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        });
        
        test('Should return array of butterflies', async () => {
            expect(response.body).toBeInstanceOf(Array);
        });
    });

    // Para GET /butterflies/:id
    describe("GET /butterflies/:id", () => {
        let testButterfly, response;

        beforeAll(async () => {
            testButterfly = await ButterflyModel.create({
                commonName: "TestButterfly",
                scientificName: "TestButterfly_Get",
                family: "TestButterfly",
                region: "TestButterfly",
                specificLocation: "TestButterfly",
                threatLevel: "TestButterfly",
            });
        });

        beforeEach(async () => {
            response = await request(app).get(`/butterflies/${testButterfly._id}`);
        });

        it("should return status 200", () => {
            expect(response.status).toBe(200);
        });

        it("should return butterfly with correct id", () => {
            expect(response.body._id).toBe(testButterfly._id.toString());
        });

        it("should return butterfly with required fields", () => {
            expect(response.body).toMatchObject({
                _id: testButterfly._id.toString(),
                commonName: expect.any(String),
                scientificName: expect.any(String),
                family: expect.any(String),
                region: expect.any(String),
                specificLocation: expect.any(String),
                threatLevel: expect.any(String),
            });
        });

        afterAll(async () => {
            await ButterflyModel.findByIdAndDelete(testButterfly._id);
        });
    });

    // DELETE butterfly by id
    describe('DELETE /butterflies/:id', () => {
        let createdButterfly;
        let response;
        
        beforeEach(async () => {
            // Crea una mariposa con datos de prueba
            createdButterfly = await ButterflyModel.create({
                commonName: "Test butterfly DELETE",
                scientificName: `Test butterfly DELETE ${Date.now()}`,
                family: "Test butterfly DELETE",
                region: "Test butterfly DELETE",
                threatLevel: "Test butterfly DELETE"
            });
            
            response = await request(app).delete(`/butterflies/${createdButterfly._id}`).send();
        });
        
        test('Should return a response with status 200 and type json', async () => {
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        });
        
        test('Should return message: The butterfly has been deleted successfully', async () => {
            expect(response.body.message).toContain("The butterfly has been deleted successfully!");
            const foundButterfly = await ButterflyModel.findById(createdButterfly._id);
            expect(foundButterfly).toBeNull();
        });
    });

    // CREATE butterfly
    describe('POST /butterflies', () => {
        let newButterflyData;
        let response;

        beforeEach(async () => {
            newButterflyData = {
                commonName: "Test butterfly CREATE",
                scientificName: `Test butterfly CREATE ${Date.now()}`,
                family: "Test butterfly CREATE",
                region: "Australia", // ✅ Cambiado a valor válido
                threatLevel: "Medium" // ✅ Cambiado a valor válido
            };
            response = await request(app).post('/butterflies').send(newButterflyData);
        });

        test('Should return a response with status 201 and type json', () => {
            expect(response.status).toBe(201);
            expect(response.headers['content-type']).toContain('json');
        });

        test('Should return the created butterfly with correct data', () => {
            expect(response.body).toHaveProperty('butterfly');
            expect(response.body.butterfly).toHaveProperty('_id');
            expect(response.body.butterfly.commonName).toBe(newButterflyData.commonName);
            expect(response.body.butterfly.scientificName).toBe(newButterflyData.scientificName);
        });

        afterEach(async () => {
            if (response.body && response.body.butterfly && response.body.butterfly._id) {
                await ButterflyModel.findByIdAndDelete(response.body.butterfly._id);
            }
        });
    });

    // Para PUT /butterflies/:id
    describe('PUT /butterflies/:id', () => {
        let testButterfly;
        let updatedData;
        let response;

        beforeEach(async () => {
            testButterfly = await ButterflyModel.create({
                commonName: "Test Butterfly UPDATE",
                scientificName: `Test Butterfly UPDATE ${Date.now()}`,
                family: "Pieridae",
                region: "Nueva Zelanda",
                threatLevel: "Medium"
            });

            updatedData = {
                commonName: "Updated Butterfly Name",
                family: "Nymphalidae",
                region: "Australia",
                threatLevel: "High"
            };

            response = await request(app)
                .put(`/butterflies/${testButterfly._id}`)
                .send(updatedData);
        });

        test('Should return a response with status 200 and type json', () => {
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        });

        test('Should return the updated butterfly object', () => {
            expect(response.body).toHaveProperty('_id', testButterfly._id.toString());
            expect(response.body.commonName).toBe(updatedData.commonName);
            expect(response.body.family).toBe(updatedData.family);
            expect(response.body.region).toBe(updatedData.region);
            expect(response.body.threatLevel).toBe(updatedData.threatLevel);
        });

        test('Should actually update the butterfly in database', async () => {
            const updatedButterfly = await ButterflyModel.findById(testButterfly._id);
            expect(updatedButterfly.commonName).toBe(updatedData.commonName);
            expect(updatedButterfly.family).toBe(updatedData.family);
            expect(updatedButterfly.region).toBe(updatedData.region);
            expect(updatedButterfly.threatLevel).toBe(updatedData.threatLevel);
            expect(updatedButterfly.scientificName).toBe(testButterfly.scientificName);
        });

        afterEach(async () => {
            if (testButterfly && testButterfly._id) {
                await ButterflyModel.findByIdAndDelete(testButterfly._id);
            }
        });
    });

    // UPDATE butterfly - casos de error
    describe('PUT /butterflies (error cases)', () => {
        test('PUT /butterflies/:id (non-existent ID) - should return 404 error', async () => {
            // Usar un ObjectId válido pero que no existe
            const nonExistentId = "507f1f77bcf86cd799439011";
            const updatedData = {
                commonName: "This should not work",
                family: "Nymphalidae",
                region: "Australia"
            };

            const response = await request(app)
                .put(`/butterflies/${nonExistentId}`)
                .send(updatedData);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Butterfly not found');
        });

        test('PUT /butterflies/:id (invalid ID format) - should return 400 error', async () => {
            const invalidId = "invalid-id-format";
            const updatedData = {
                commonName: "This should not work",
                family: "Pieridae",
                region: "Australia"
            };

            const response = await request(app)
                .put(`/butterflies/${invalidId}`)
                .send(updatedData);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Invalid butterfly ID');
        });

        test('PUT /butterflies (without ID) - should return 404 error', async () => {
            const updatedData = {
                commonName: "This should not work",
                family: "Pieridae",
                region: "Islas del Pacífico"
            };

            const response = await request(app)
                .put('/butterflies/')
                .send(updatedData);

            expect([404, 400]).toContain(response.status);
        });
    });

    afterAll(async () => {
        try {
            // Limpiar y cerrar la base de datos
            await dropDB();
            await closeDB();
            console.log('Database connection closed successfully.');
            
            // Cerrar el servidor
            if (server) {
                server.close();
            }
        } catch (error) {
            console.error('Error closing database:', error);
        }
    });
});