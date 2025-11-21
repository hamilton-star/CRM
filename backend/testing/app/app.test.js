const request = require('supertest');
const app = require('../../server');

describe('API de TurismoCRM - pruebas de integración básicas', () => {
  test('GET / debe responder con mensaje de bienvenida', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Bienvenido al API del CRM de Turismo');
  });

  test('GET /api/clientes responde con JSON (estructura básica)', async () => {
    const res = await request(app).get('/api/clientes');
    // No sabemos si siempre habrá datos, pero sí que debe responder JSON
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(600);
    expect(res.headers['content-type']).toMatch(/json/i);
    expect(res.body).toHaveProperty('success');
  });

  test('GET /api/destinos responde con JSON (estructura básica)', async () => {
    const res = await request(app).get('/api/destinos');
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(600);
    expect(res.headers['content-type']).toMatch(/json/i);
    expect(res.body).toHaveProperty('success');
  });
});
