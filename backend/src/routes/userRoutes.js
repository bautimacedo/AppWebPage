const express = require('express');
const router = express.Router();
const { createUser, getUsers, updateUser } = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { getProviders } = require('../controllers/userController');
// Rutas de usuarios
router.post('/', createUser);
router.get('/', getUsers);
router.get('/providers', getProviders);
router.put('/:id', authenticateToken, updateUser);

module.exports = router;
