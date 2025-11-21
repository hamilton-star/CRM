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

async function crearCliente() {
  const payload = {
    nombre: 'Cliente',
    apellido: 'Integracion',
    email: 'cliente.integracion@example.com',
    telefono: '123456789',
    direccion: 'Direccion test',
    fecha_nacimiento: '1990-01-01',
    documento_identidad: 'DOC-INT-1',
    nacionalidad: 'argentina',
    activo: true,
  };
  const res = await request(app).post('/api/clientes').send(payload);
  expect(res.status).toBe(201);
  expect(res.body.success).toBe(true);
  return res.body.data;
}

async function crearUsuario() {
  const payload = {
    nombre: 'Usuario Integracion',
    email: 'usuario.integracion@example.com',
    password: 'Password123!',
    rol: 'admin',
    activo: true,
  };
  const res = await request(app).post('/api/usuarios').send(payload);
  expect(res.status).toBe(201);
  expect(res.body.success).toBe(true);
  return res.body.data;
}

async function crearReserva({ cliente_id, paquete_id, usuario_id }) {
  const hoy = new Date().toISOString().split('T')[0];
  const payload = {
    cliente_id,
    paquete_id,
    usuario_id,
    fecha_reserva: hoy,
    fecha_salida: hoy,
    fecha_retorno: hoy,
    estado: 'pendiente',
    precio_total: 500.0,
    notas: 'Reserva de integracion',
  };
  const res = await request(app).post('/api/reservas').send(payload);
  expect(res.status).toBe(201);
  expect(res.body.success).toBe(true);
  return res.body.data;
}

describe('Integración: Reservas - Clientes - Paquetes', () => {
  test('Reservas devuelven cliente_nombre y nombre_paquete (reservas-clientes y reservas-paquetes)', async () => {
    const destino = await crearDestino();
    const paquete = await crearPaquete(destino.destino_id);
    const cliente = await crearCliente();
    const usuario = await crearUsuario();

    await crearReserva({
      cliente_id: cliente.cliente_id,
      paquete_id: paquete.paquete_id,
      usuario_id: usuario.usuario_id,
    });

    const res = await request(app).get('/api/reservas');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);

    const reserva = res.body.data.find(
      (r) => r.cliente_id === cliente.cliente_id && r.paquete_id === paquete.paquete_id
    );
    expect(reserva).toBeDefined();
    expect(reserva).toHaveProperty('cliente_nombre');
    expect(reserva.cliente_nombre).toContain(cliente.nombre);
    expect(reserva).toHaveProperty('nombre_paquete', paquete.nombre_paquete);
  });
});
