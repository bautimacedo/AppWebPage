const express = require('express');
const router = express.Router();
const { createUser, getUsers, updateUser } = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware'); // suponiendo que tengas middleware separado

router.post('/', createUser);
router.get('/', getUsers);
router.put('/:id', authenticateToken, updateUser);

module.exports = router;
