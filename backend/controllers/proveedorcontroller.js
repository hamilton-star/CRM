const pool = require('../config/database');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const result = await pool.query('SELECT * FROM proveedores ORDER BY proveedor_id DESC');
      res.json({ success: true, data: result.rows, count: result.rowCount });
    } catch (error) { next(error); }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM proveedores WHERE proveedor_id = $1', [id]);
      if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Proveedor no encontrado' });
      res.json({ success: true, data: result.rows[0] });
    } catch (error) { next(error); }
  },

  create: async (req, res, next) => {
    try {
      const { nombre_proveedor, tipo, contacto_nombre, email, telefono, direccion, activo = true } = req.body;
      if (!nombre_proveedor) return res.status(400).json({ success: false, message: 'nombre_proveedor es obligatorio' });
      const result = await pool.query(
        `INSERT INTO proveedores (nombre_proveedor, tipo, contacto_nombre, email, telefono, direccion, activo)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
        [nombre_proveedor, tipo, contacto_nombre, email, telefono, direccion, activo]
      );
      res.status(201).json({ success: true, message: 'Proveedor creado', data: result.rows[0] });
    } catch (error) { next(error); }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { nombre_proveedor, tipo, contacto_nombre, email, telefono, direccion, activo } = req.body;
      const exists = await pool.query('SELECT 1 FROM proveedores WHERE proveedor_id = $1', [id]);
      if (exists.rowCount === 0) return res.status(404).json({ success: false, message: 'Proveedor no encontrado' });
      const result = await pool.query(
        `UPDATE proveedores SET nombre_proveedor=$1, tipo=$2, contacto_nombre=$3, email=$4, telefono=$5, direccion=$6, activo=$7
         WHERE proveedor_id=$8 RETURNING *`,
        [nombre_proveedor, tipo, contacto_nombre, email, telefono, direccion, activo, id]
      );
      res.json({ success: true, message: 'Proveedor actualizado', data: result.rows[0] });
    } catch (error) { next(error); }
  },

  remove: async (req, res, next) => {
    try {
      const { id } = req.params;
      const exists = await pool.query('SELECT 1 FROM proveedores WHERE proveedor_id = $1', [id]);
      if (exists.rowCount === 0) return res.status(404).json({ success: false, message: 'Proveedor no encontrado' });
      await pool.query('UPDATE proveedores SET activo = false WHERE proveedor_id = $1', [id]);
      res.json({ success: true, message: 'Proveedor desactivado' });
    } catch (error) { next(error); }
  }
};
