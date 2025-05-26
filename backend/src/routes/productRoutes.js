const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');
const User = require('../models/userModel');
const { authenticateToken } = require('../middlewares/authMiddleware');
const User = require('../models/userModel');

router.post('/', authenticateToken, async (req, res) => {
  // Asegurate que el userId que tomás corresponde al campo real del token
  const userId = req.user?.id || req.user?.userId;
  console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh " + userId)

  // Validación básica
  if (!userId) {
    return res.status(401).json({ error: 'Usuario no autenticado correctamente' });
  }

  const { name, price, description } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user || user.rol !== 'proveedor') {
      return res.status(403).json({ error: 'Solo proveedores pueden crear productos' });
    }

    if (!name || !price) {
      return res.status(400).json({ error: 'Faltan datos obligatorios: name o price' });
    }

    const newProduct = await Product.create({
      name,
      price,
      description,
      userId, // asignar el userId correcto aquí
    });

    res.status(201).json(newProduct);

  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});


router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: User, as: 'provider' }],
      order: [['id', 'DESC']],
    });
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

router.get('/my-products', authenticateToken, async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    if (user.rol !== 'proveedor') {
      return res.status(403).json({ error: 'Solo proveedores pueden ver sus productos' });
    }

    const products = await Product.findAll({
      where: { userId },
      order: [['id', 'DESC']],
    });

    res.json(products);

  } catch (error) {
    console.error('Error al obtener productos del proveedor:', error);
    res.status(500).json({ error: 'Error al obtener productos del proveedor' });
  }
});

module.exports = router;
