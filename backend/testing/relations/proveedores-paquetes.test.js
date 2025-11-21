const request = require('supertest');
const app = require('../../server');

async function crearProveedor() {
  const payload = {
    nombre_proveedor: 'Proveedor Integracion',
    tipo: 'hotel',
    contacto_nombre: 'Contacto Test',
    email: 'proveedor.integracion@example.com',
    telefono: '987654321',
    direccion: 'Direccion proveedor',
    activo: true,
  };

  const res = await request(app).post('/api/proveedores').send(payload);
  expect(res.status).toBe(201);
  expect(res.body.success).toBe(true);
  return res.body.data;
}

describe('Integración: Proveedores - Paquetes Turísticos (coherencia básica)', () => {
  test('Se pueden crear proveedores y luego consultar paquetes (módulos integrables)', async () => {
    await crearProveedor();

    const paquetesRes = await request(app).get('/api/paquetes');
    expect(paquetesRes.status).toBe(200);
    expect(paquetesRes.body.success).toBe(true);
    expect(Array.isArray(paquetesRes.body.data)).toBe(true);
  });
});
