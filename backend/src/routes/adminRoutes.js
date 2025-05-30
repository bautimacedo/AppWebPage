const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateAdminToken } = require('../middlewares/authAdminMiddleware');
const { getUsers, updateWarning, deleteUser } = require('../controllers/userController');
const { getAllProducts, deleteProduct } = require('../controllers/productController');

router.post('/register', adminController.register);
router.post('/login', adminController.login);
router.get('/panel', authenticateAdminToken, adminController.panel);
router.get('/users', getUsers);
router.put('/users/:id/warning', authenticateAdminToken, updateWarning);

router.get('/productos', authenticateAdminToken, getAllProducts);      
router.delete('/productos/:id', authenticateAdminToken, deleteProduct); 
router.delete('/users/:id', authenticateAdminToken, deleteUser);

module.exports = router;
// Este archivo define las rutas relacionadas con la administración del sistema.
// La ruta '/register' permite registrar un nuevo administrador, '/login' permite iniciar sesión y '/panel' es un panel de administración protegido.