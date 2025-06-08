const express = require('express');
const router = express.Router();
const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  getProviders,
} = require('../controllers/userController');
const warningController = require('../controllers/warningController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { authenticateAdminToken } = require('../middlewares/authAdminMiddleware');
const upload = require('../../utils/upload');
const User = require('../models/userModel');

// Rutas de usuarios
router.post('/', createUser);
router.get('/', getUsers);
router.get('/providers', getProviders);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateAdminToken, deleteUser);

// Rutas para warnings del usuario
router.get('/:id/warnings', authenticateToken, warningController.getWarningsByUser);

// ✅ Ruta para subir imagen de perfil (usando imageUrl)
router.post('/:id/photo', authenticateToken, upload.single('photo'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    user.imageUrl = req.file.filename; // 👈 usamos imageUrl
    await user.save();

    res.json({ message: 'Imagen de perfil subida correctamente', image: req.file.filename });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al subir la imagen de perfil' });
  }
});

module.exports = router;
