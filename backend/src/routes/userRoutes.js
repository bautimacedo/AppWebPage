const express = require('express');
const router = express.Router();
const { createUser, getUsers, updateUser, deleteUser, getProviders } = require('../controllers/userController');
const warningController = require('../controllers/warningController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { authenticateAdminToken } = require('../middlewares/authAdminMiddleware');

// Rutas de usuarios
router.post('/', createUser);
router.get('/', getUsers);
router.get('/providers', getProviders);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateAdminToken, deleteUser);

// Rutas para warnings del usuario
router.get('/:id/warnings', authenticateToken, warningController.getWarningsByUser);

module.exports = router;
// Este archivo define las rutas relacionadas con los usuarios del sistema.