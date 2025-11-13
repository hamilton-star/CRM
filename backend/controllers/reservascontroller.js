const pool = require('../config/database');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const result = await pool.query(`
        SELECT r.*, 
               c.nombre || ' ' || c.apellido AS cliente_nombre,
               p.nombre_paquete,
               u.nombre AS usuario_nombre
        FROM reservas r
        LEFT JOIN clientes c ON r.cliente_id = c.cliente_id
        LEFT JOIN paquetes_turisticos p ON r.paquete_id = p.paquete_id
        LEFT JOIN usuarios u ON r.usuario_id = u.usuario_id
        ORDER BY r.reserva_id DESC`);
      res.json({ success: true, data: result.rows, count: result.rowCount });
    } catch (error) { next(error); }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await pool.query(`
        SELECT r.*, 
               c.nombre || ' ' || c.apellido AS cliente_nombre,
               p.nombre_paquete,
               u.nombre AS usuario_nombre
        FROM reservas r
        LEFT JOIN clientes c ON r.cliente_id = c.cliente_id
        LEFT JOIN paquetes_turisticos p ON r.paquete_id = p.paquete_id
        LEFT JOIN usuarios u ON r.usuario_id = u.usuario_id
        WHERE r.reserva_id = $1`, [id]);
      if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Reserva no encontrada' });
      res.json({ success: true, data: result.rows[0] });
    } catch (error) { next(error); }
  },

  create: async (req, res, next) => {
    try {
      const { cliente_id, paquete_id, usuario_id, fecha_reserva, fecha_salida, fecha_retorno, estado = 'pendiente', precio_total, notas } = req.body;
      if (!cliente_id || !paquete_id || !usuario_id || !fecha_salida || !precio_total)
        return res.status(400).json({ success: false, message: 'Campos obligatorios faltantes' });
      const result = await pool.query(
        `INSERT INTO reservas (cliente_id, paquete_id, usuario_id, fecha_reserva, fecha_salida, fecha_retorno, estado, precio_total, notas)
         VALUES ($1,$2,$3,COALESCE($4, NOW()),$5,$6,$7,$8,$9) RETURNING *`,
        [cliente_id, paquete_id, usuario_id, fecha_reserva, fecha_salida, fecha_retorno, estado, precio_total, notas]
      );
      res.status(201).json({ success: true, message: 'Reserva creada', data: result.rows[0] });
    } catch (error) { next(error); }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { cliente_id, paquete_id, usuario_id, fecha_reserva, fecha_salida, fecha_retorno, estado, precio_total, notas } = req.body;
      const exists = await pool.query('SELECT 1 FROM reservas WHERE reserva_id=$1', [id]);
      if (exists.rowCount === 0) return res.status(404).json({ success: false, message: 'Reserva no encontrada' });
      const result = await pool.query(
        `UPDATE reservas SET cliente_id=$1, paquete_id=$2, usuario_id=$3, fecha_reserva=$4, fecha_salida=$5, fecha_retorno=$6, estado=$7, precio_total=$8, notas=$9
         WHERE reserva_id=$10 RETURNING *`,
        [cliente_id, paquete_id, usuario_id, fecha_reserva, fecha_salida, fecha_retorno, estado, precio_total, notas, id]
      );
      res.json({ success: true, message: 'Reserva actualizada', data: result.rows[0] });
    } catch (error) { next(error); }
  },

  remove: async (req, res, next) => {
    try {
      const { id } = req.params;
      const exists = await pool.query('SELECT 1 FROM reservas WHERE reserva_id=$1', [id]);
      if (exists.rowCount === 0) return res.status(404).json({ success: false, message: 'Reserva no encontrada' });
      await pool.query('DELETE FROM reservas WHERE reserva_id=$1', [id]);
      res.json({ success: true, message: 'Reserva eliminada' });
    } catch (error) { next(error); }
  }
};
