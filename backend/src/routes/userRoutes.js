const express = require('express');
const router = express.Router();
const { createUser, getUsers, updateUser } = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware'); // suponiendo que tengas middleware separado

router.post('/', createUser);
router.get('/', getUsers);
<<<<<<< HEAD
router.post('/', productController.createProduct);

=======
router.put('/:id', authenticateToken, updateUser);
>>>>>>> 8f28c968d8215b2a01d6c2a757d036b3b7a648fc

module.exports = router;
