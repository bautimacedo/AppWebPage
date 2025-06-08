const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const sequelize = require('../config/database'); // 👈 Necesario para funciones agregadas como COUNT

const User = require('../models/userModel');
const Product = require('../models/productModel');
const Warning = require('../models/warningModel');

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

      const token = jwt.sign(
        { adminId: admin.id },
        process.env.JWT_ADMIN_SECRET || 'rodilla',
        { expiresIn: '1h' }
      );

      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Error en login admin' });
    }
  },

  panel: (req, res) => {
    res.json({ message: 'Bienvenido al panel de administrador' });
  },

  downloadBackup: async (req, res) => {
    try {
      const users = await User.findAll({ raw: true });
      const products = await Product.findAll({ raw: true });
      const warnings = await Warning.findAll({ raw: true });

      const parser = new Parser();

      const csvUsers = parser.parse(users);
      const csvProducts = parser.parse(products);
      const csvWarnings = parser.parse(warnings);

      const combinedCSV =
        '==== USUARIOS ====\n' + csvUsers + '\n\n' +
        '==== PRODUCTOS ====\n' + csvProducts + '\n\n' +
        '==== ADVERTENCIAS ====\n' + csvWarnings + '\n';

      const fileName = 'backup_localhands.csv';
      const filePath = path.join(__dirname, '../../uploads', fileName);

      fs.writeFileSync(filePath, combinedCSV);

      res.download(filePath, fileName, err => {
        if (err) {
          console.error('Error al descargar backup:', err);
          return res.status(500).json({ error: 'Error al descargar backup' });
        }
        fs.unlink(filePath, () => {}); // limpia el archivo después
      });

    } catch (error) {
      console.error('Error generando backup:', error);
      res.status(500).json({ error: 'Error generando backup' });
    }
  },

  getStats: async (req, res) => {
    try {
      const totalUsers = await User.count();
      const totalProducts = await Product.count();
      const totalWarnings = await Warning.count();

      const usersByRole = await User.findAll({
        attributes: ['rol', [sequelize.fn('COUNT', sequelize.col('rol')), 'count']],
        group: ['rol']
      });

      const productsPerUser = await Product.findAll({
        attributes: ['userId', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['userId']
      });

      res.json({
        totalUsers,
        totalProducts,
        totalWarnings,
        usersByRole,
        productsPerUser
      });
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
  }
};
