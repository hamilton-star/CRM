const request = require('supertest');
const app = require('../../server');

async function crearDestino() {
  const payload = {
    nombre_destino: 'Destino Test Integracion',
    pais: 'Pais Test',
    ciudad: 'Ciudad Test',
    descripcion: 'Descripcion destino test',
    categoria: 'playa',
    activo: true,
  };
  const res = await request(app).post('/api/destinos').send(payload);
  expect(res.status).toBe(201);
  expect(res.body.success).toBe(true);
  return res.body.data;
}

async function crearPaquete(destino_id) {
  const payload = {
    nombre_paquete: 'Paquete Test Integracion',
    descripcion: 'Descripcion paquete test',
    destino_id,
    duracion_dias: 5,
    precio_base: 123.45,
    tipo_paquete: 'aventura',
    activo: true,
  };
  const res = await request(app).post('/api/paquetes').send(payload);
  expect(res.status).toBe(201);
  expect(res.body.success).toBe(true);
  return res.body.data;
}

describe('Integración: Paquetes Turísticos - Destinos', () => {
  test('Paquetes turísticos incluyen nombre de destino (paquetes-destinos)', async () => {
    const destino = await crearDestino();
    const paquete = await crearPaquete(destino.destino_id);

    const res = await request(app).get(`/api/paquetes/${paquete.paquete_id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('destino_id', destino.destino_id);
    expect(res.body.data).toHaveProperty('destino_nombre');
    expect(res.body.data.destino_nombre).toContain(destino.pais);
  });
});
