const pool = require('../config/database');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const result = await pool.query(`
        SELECT cm.*, c.nombre || ' ' || c.apellido AS cliente_nombre, u.nombre AS usuario_nombre
        FROM comunicaciones cm
        JOIN clientes c ON cm.cliente_id = c.cliente_id
        JOIN usuarios u ON cm.usuario_id = u.usuario_id
        ORDER BY cm.interaccion_id DESC`);
      res.json({ success: true, data: result.rows, count: result.rowCount });
    } catch (error) { next(error); }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await pool.query(`
        SELECT cm.*, c.nombre || ' ' || c.apellido AS cliente_nombre, u.nombre AS usuario_nombre
        FROM comunicaciones cm
        JOIN clientes c ON cm.cliente_id = c.cliente_id
        JOIN usuarios u ON cm.usuario_id = u.usuario_id
        WHERE cm.interaccion_id = $1`, [id]);
      if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Interacción no encontrada' });
      res.json({ success: true, data: result.rows[0] });
    } catch (error) { next(error); }
  },

  create: async (req, res, next) => {
    try {
      const { cliente_id, usuario_id, tipo_interaccion, fecha_hora, descripcion } = req.body;
      if (!cliente_id || !usuario_id || !tipo_interaccion) return res.status(400).json({ success: false, message: 'Campos obligatorios faltantes' });
      const result = await pool.query(
        `INSERT INTO comunicaciones (cliente_id, usuario_id, tipo_interaccion, fecha_hora, descripcion)
         VALUES ($1,$2,$3,COALESCE($4, NOW()),$5) RETURNING *`,
        [cliente_id, usuario_id, tipo_interaccion, fecha_hora, descripcion]
      );
      res.status(201).json({ success: true, message: 'Interacción creada', data: result.rows[0] });
    } catch (error) { next(error); }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { cliente_id, usuario_id, tipo_interaccion, fecha_hora, descripcion } = req.body;
      const exists = await pool.query('SELECT 1 FROM comunicaciones WHERE interaccion_id=$1', [id]);
      if (exists.rowCount === 0) return res.status(404).json({ success: false, message: 'Interacción no encontrada' });
      const result = await pool.query(
        `UPDATE comunicaciones SET cliente_id=$1, usuario_id=$2, tipo_interaccion=$3, fecha_hora=$4, descripcion=$5
         WHERE interaccion_id=$6 RETURNING *`,
        [cliente_id, usuario_id, tipo_interaccion, fecha_hora, descripcion, id]
      );
      res.json({ success: true, message: 'Interacción actualizada', data: result.rows[0] });
    } catch (error) { next(error); }
  },

  remove: async (req, res, next) => {
    try {
      const { id } = req.params;
      const exists = await pool.query('SELECT 1 FROM comunicaciones WHERE interaccion_id=$1', [id]);
      if (exists.rowCount === 0) return res.status(404).json({ success: false, message: 'Interacción no encontrada' });
      await pool.query('DELETE FROM comunicaciones WHERE interaccion_id=$1', [id]);
      res.json({ success: true, message: 'Interacción eliminada' });
    } catch (error) { next(error); }
  }
};
