const pool = require('../config/database');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const result = await pool.query(`
        SELECT p.*, (COALESCE(d.ciudad,'') || CASE WHEN d.ciudad IS NOT NULL AND d.ciudad<>'' THEN ', ' ELSE '' END || COALESCE(d.pais,'')) AS destino_nombre
        FROM paquetes_turisticos p
        LEFT JOIN destinos d ON p.destino_id = d.destino_id
        ORDER BY p.paquete_id DESC`);
      res.json({ success: true, data: result.rows, count: result.rowCount });
    } catch (error) { next(error); }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await pool.query(`
        SELECT p.*, (COALESCE(d.ciudad,'') || CASE WHEN d.ciudad IS NOT NULL AND d.ciudad<>'' THEN ', ' ELSE '' END || COALESCE(d.pais,'')) AS destino_nombre
        FROM paquetes_turisticos p
        LEFT JOIN destinos d ON p.destino_id = d.destino_id
        WHERE p.paquete_id = $1`, [id]);
      if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Paquete no encontrado' });
      res.json({ success: true, data: result.rows[0] });
    } catch (error) { next(error); }
  },

  create: async (req, res, next) => {
    try {
      const { nombre_paquete, descripcion, destino_id, duracion_dias, precio_base, tipo_paquete, activo = true } = req.body;
      if (!nombre_paquete || !destino_id) return res.status(400).json({ success: false, message: 'Campos obligatorios faltantes' });
      const result = await pool.query(
        `INSERT INTO paquetes_turisticos (nombre_paquete, descripcion, destino_id, duracion_dias, precio_base, tipo_paquete, activo)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
        [nombre_paquete, descripcion, destino_id, duracion_dias, precio_base, tipo_paquete, activo]
      );
      res.status(201).json({ success: true, message: 'Paquete creado', data: result.rows[0] });
    } catch (error) { next(error); }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { nombre_paquete, descripcion, destino_id, duracion_dias, precio_base, tipo_paquete, activo } = req.body;
      const exists = await pool.query('SELECT 1 FROM paquetes_turisticos WHERE paquete_id=$1', [id]);
      if (exists.rowCount === 0) return res.status(404).json({ success: false, message: 'Paquete no encontrado' });
      const result = await pool.query(
        `UPDATE paquetes_turisticos SET nombre_paquete=$1, descripcion=$2, destino_id=$3, duracion_dias=$4, precio_base=$5, tipo_paquete=$6, activo=$7
         WHERE paquete_id=$8 RETURNING *`,
        [nombre_paquete, descripcion, destino_id, duracion_dias, precio_base, tipo_paquete, activo, id]
      );
      res.json({ success: true, message: 'Paquete actualizado', data: result.rows[0] });
    } catch (error) { next(error); }
  },

  remove: async (req, res, next) => {
    try {
      const { id } = req.params;
      const exists = await pool.query('SELECT 1 FROM paquetes_turisticos WHERE paquete_id=$1', [id]);
      if (exists.rowCount === 0) return res.status(404).json({ success: false, message: 'Paquete no encontrado' });
      await pool.query('UPDATE paquetes_turisticos SET activo=false WHERE paquete_id=$1', [id]);
      res.json({ success: true, message: 'Paquete desactivado' });
    } catch (error) { next(error); }
  }
};
