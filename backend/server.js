const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/destinos', require('./routes/destinos'));
app.use('/api/proveedores', require('./routes/proveedores'));
app.use('/api/paquetes', require('./routes/paquetes'));
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/reservas', require('./routes/reservas'));
app.use('/api/comunicaciones', require('./routes/comunicaciones'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));

// Error handling middleware
app.use(require('./middleware/errorHandler'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido al API del CRM de Turismo' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});