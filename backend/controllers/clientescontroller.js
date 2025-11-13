const pool = require('../config/database');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const result = await pool.query('SELECT * FROM clientes ORDER BY cliente_id DESC');
      res.json({ success: true, data: result.rows, count: result.rowCount });
    } catch (error) { next(error); }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM clientes WHERE cliente_id = $1', [id]);
      if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
      res.json({ success: true, data: result.rows[0] });
    } catch (error) { next(error); }
  },

  create: async (req, res, next) => {
    try {
      const { nombre, apellido, email, telefono, direccion, fecha_nacimiento, documento_identidad, nacionalidad, activo = true } = req.body;
      if (!nombre || !apellido) return res.status(400).json({ success: false, message: 'nombre y apellido son obligatorios' });
      const result = await pool.query(
        `INSERT INTO clientes (nombre, apellido, email, telefono, direccion, fecha_nacimiento, documento_identidad, nacionalidad, activo)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [nombre, apellido, email, telefono, direccion, fecha_nacimiento, documento_identidad, nacionalidad, activo]
      );
      res.status(201).json({ success: true, message: 'Cliente creado', data: result.rows[0] });
    } catch (error) { next(error); }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { nombre, apellido, email, telefono, direccion, fecha_nacimiento, documento_identidad, nacionalidad, activo } = req.body;
      const exists = await pool.query('SELECT 1 FROM clientes WHERE cliente_id = $1', [id]);
      if (exists.rowCount === 0) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
      const result = await pool.query(
        `UPDATE clientes SET nombre=$1, apellido=$2, email=$3, telefono=$4, direccion=$5, fecha_nacimiento=$6, documento_identidad=$7, nacionalidad=$8, activo=$9
         WHERE cliente_id=$10 RETURNING *`,
        [nombre, apellido, email, telefono, direccion, fecha_nacimiento, documento_identidad, nacionalidad, activo, id]
      );
      res.json({ success: true, message: 'Cliente actualizado', data: result.rows[0] });
    } catch (error) { next(error); }
  },

  remove: async (req, res, next) => {
    try {
      const { id } = req.params;
      const exists = await pool.query('SELECT 1 FROM clientes WHERE cliente_id = $1', [id]);
      if (exists.rowCount === 0) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
      await pool.query('UPDATE clientes SET activo=false WHERE cliente_id=$1', [id]);
      res.json({ success: true, message: 'Cliente desactivado' });
    } catch (error) { next(error); }
  }
};
