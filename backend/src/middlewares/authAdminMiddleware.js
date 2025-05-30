const jwt = require('jsonwebtoken');

const authenticateAdminToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token requerido' });

  jwt.verify(token, process.env.JWT_ADMIN_SECRET, (err, admin) => {
    if (err) return res.status(403).json({ error: 'Token inválido o expirado' });

     // Validación adicional
    if (!admin.adminId && !admin.id) {
    return res.status(403).json({ error: 'No autorizado: no es un admin' });
    }

    req.admin = admin; // Guardamos info del admin decodificada
    next();
  });
};

module.exports = { authenticateAdminToken };
