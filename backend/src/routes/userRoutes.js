const express = require('express');
const router = express.Router();
const { createUser, getUsers } = require('../controllers/userController');

router.post('/', createUser);
router.get('/', getUsers);
router.post('/', productController.createProduct);


module.exports = router;
