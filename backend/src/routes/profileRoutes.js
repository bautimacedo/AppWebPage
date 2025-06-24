const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const { authenticateAdminToken } = require('../middlewares/authAdminMiddleware');
const upload = require('../../utils/upload');
const User = require('../models/userModel');
const Admin = require('../models/adminModel');

// Obtener perfil del usuario autenticado
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // extraído del token
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json({
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      location: user.location,
      description: user.description,
      imageUrl: user.imageUrl,
      rol: user.rol,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Error obteniendo perfil usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Obtener perfil del admin autenticado
router.get('/admin/profile', authenticateAdminToken, async (req, res) => {
  try {
    const adminId = req.admin.id; // extraído del token admin
    const admin = await Admin.findByPk(adminId);
    if (!admin) return res.status(404).json({ message: 'Admin no encontrado' });

    res.json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
    });
  } catch (err) {
    console.error('Error obteniendo perfil de admin:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Actualizar perfil del usuario autenticado
router.put('/profile', authenticateToken, upload.single('profileImage'), async (req, res) => {
  console.log('Entró al controlador PUT /profile');  // <-- Para confirmar que llegó
  console.log('req.file:', req.file);
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const {
      name,
      lastname,
      email,
      password,
      description,
      location,
    } = req.body;

    // Actualizar solo si vienen en el body
    if (name !== undefined) user.name = name;
    if (lastname !== undefined) user.lastname = lastname;
    if (email !== undefined) user.email = email;
    if (description !== undefined) user.description = description;
    if (location !== undefined) user.location = location;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    console.log('req.file:', JSON.stringify(req.file, null, 2));
    if (req.file) {
      // Cloudinary u otro sistema puede devolver secure_url o path
      const imageUrl = req.file.secure_url || req.file.path;
      user.imageUrl = imageUrl;
    }

    await user.save();

    res.json({
      message: 'Perfil actualizado correctamente',
      user: {
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        description: user.description,
        location: user.location,
        imageUrl: user.imageUrl,
      }
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
