const express = require('express');
const router = express.Router();
const { createUser, getUsers, updateUser, deleteUser, updateWarning } = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { authenticateAdminToken } = require('../middlewares/authAdminMiddleware');

const { getProviders } = require('../controllers/userController');
// Rutas de usuarios
router.post('/', createUser);
router.get('/', getUsers);
router.get('/providers', getProviders);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateAdminToken, deleteUser);
router.put('/:id/warning', authenticateToken, updateWarning);

module.exports = router;
