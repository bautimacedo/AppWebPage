const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateAdminToken } = require('../middlewares/authAdminMiddleware');

router.post('/register', adminController.register);
router.post('/login', adminController.login);
router.get('/panel', authenticateAdminToken, adminController.panel);

module.exports = router;
// Este archivo define las rutas relacionadas con la administración del sistema.
// La ruta '/register' permite registrar un nuevo administrador, '/login' permite iniciar sesión y '/panel' es un panel de administración protegido.