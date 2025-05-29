const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const User = require('../models/userModel');

// Obtener perfil del usuario autenticado
router.get('/profile', authenticateToken, async (req, res) => {
  const userId = req.user.id; // extraído del token
  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json({
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      location: user.location,
      description: user.description,
      imageUrl: user.imageUrl,  // acá se debe llamar imageUrl para ser consistente
    });
  } catch (error) {
    res.status(500).json({ message: 'Error interno' });
  }
});

// Actualizar perfil del usuario autenticado
router.put('/profile', authenticateToken, upload.single('profileImage'), async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const {
      name,
      lastname,
      email,
      password,
      description,
      location
    } = req.body;

    // Actualizar solo si vienen en el body
    user.name = name ?? user.name;
    user.lastname = lastname ?? user.lastname;
    user.email = email ?? user.email;
    user.description = description ?? user.description;
    user.location = location ?? user.location;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    if (req.file) {
      const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
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
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;
