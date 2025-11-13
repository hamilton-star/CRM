const pool = require('../config/database');

// Obtener todos los destinos
const getAllDestinos = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM destinos ORDER BY destino_id DESC'
    );
    res.json({
      success: true,
      data: result.rows,
      count: result.rowCount
    });
  } catch (error) {
    next(error);
  }
};

// Obtener un destino por ID
const getDestinoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM destinos WHERE destino_id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Destino no encontrado'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// Crear nuevo destino
const createDestino = async (req, res, next) => {
  try {
    const {
      nombre_destino,
      pais,
      ciudad,
      descripcion,
      categoria,
      activo = true
    } = req.body;

    // Validaciones básicas
    if (!nombre_destino || !pais) {
      return res.status(400).json({
        success: false,
        message: 'Nombre del destino y país son obligatorios'
      });
    }

    const result = await pool.query(
      `INSERT INTO destinos 
       (nombre_destino, pais, ciudad, descripcion, categoria, activo) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [nombre_destino, pais, ciudad, descripcion, categoria, activo]
    );

    res.status(201).json({
      success: true,
      message: 'Destino creado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar destino
const updateDestino = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      nombre_destino,
      pais,
      ciudad,
      descripcion,
      categoria,
      activo
    } = req.body;

    // Verificar si el destino existe
    const destinoExist = await pool.query(
      'SELECT * FROM destinos WHERE destino_id = $1',
      [id]
    );

    if (destinoExist.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Destino no encontrado'
      });
    }

    const result = await pool.query(
      `UPDATE destinos 
       SET nombre_destino = $1, pais = $2, ciudad = $3, 
           descripcion = $4, categoria = $5, activo = $6,
           fecha_actualizacion = CURRENT_TIMESTAMP
       WHERE destino_id = $7 
       RETURNING *`,
      [nombre_destino, pais, ciudad, descripcion, categoria, activo, id]
    );

    res.json({
      success: true,
      message: 'Destino actualizado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar destino (eliminación lógica)
const deleteDestino = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar si el destino existe
    const destinoExist = await pool.query(
      'SELECT * FROM destinos WHERE destino_id = $1',
      [id]
    );

    if (destinoExist.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Destino no encontrado'
      });
    }

    // Eliminación lógica (cambiar estado a inactivo)
    await pool.query(
      'UPDATE destinos SET activo = false, fecha_actualizacion = CURRENT_TIMESTAMP WHERE destino_id = $1',
      [id]
    );

    res.json({
      success: true,
      message: 'Destino eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// Obtener destinos por categoría
const getDestinosByCategoria = async (req, res, next) => {
  try {
    const { categoria } = req.params;
    const result = await pool.query(
      'SELECT * FROM destinos WHERE categoria = $1 AND activo = true ORDER BY nombre_destino',
      [categoria]
    );

    res.json({
      success: true,
      data: result.rows,
      count: result.rowCount
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDestinos,
  getDestinoById,
  createDestino,
  updateDestino,
  deleteDestino,
  getDestinosByCategoria
};