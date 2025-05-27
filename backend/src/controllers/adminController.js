const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const hash = await bcrypt.hash(password, 10);
      const admin = await Admin.create({ username, email, password: hash });
      res.status(201).json({ message: 'Admin creado', adminId: admin.id });
    } catch (error) {
      res.status(500).json({ error: 'Error creando admin' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ where: { email } });
      if (!admin) return res.status(401).json({ error: 'Credenciales inválidas' });

      const valid = await bcrypt.compare(password, admin.password);
      if (!valid) return res.status(401).json({ error: 'Credenciales inválidas' });

      // Crear token JWT para admin
      const token = jwt.sign({ adminId: admin.id }, 'secret_admin_key', { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Error en login admin' });
    }
  },

  panel: (req, res) => {
    res.json({ message: 'Bienvenido al panel de administrador' });
  },

  // Aquí agregás lógica para eliminar productos, proveedores, etc.
};
