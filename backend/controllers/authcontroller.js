const pool = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email y contraseña son requeridos' });
      }
      const emailNorm = String(email).trim().toLowerCase();
      const result = await pool.query(
        'SELECT usuario_id, nombre, email, rol, clave_hash, activo FROM usuarios WHERE LOWER(email) = $1',
        [emailNorm]
      );
      if (result.rowCount === 0) {
        return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      }
      const user = result.rows[0];
      if (user.activo === false) {
        return res.status(403).json({ success: false, message: 'Usuario inactivo' });
      }
      const hash = (user.clave_hash || '').toString().trim();
      let ok = false;
      if (hash && hash.startsWith('$2')) {
        ok = await bcrypt.compare(password, hash);
      } else {
        // Validación en texto plano (no recomendado). Se compara directamente.
        ok = password === hash;
      }
      if (!ok) {
        return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      }
      // Devuelve datos básicos del usuario
      delete user.clave_hash;
      res.json({ success: true, data: { usuario_id: user.usuario_id, nombre: user.nombre, email: user.email, rol: user.rol } });
    } catch (error) { next(error); }
  }
};
