const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');
const { authenticateToken } = require('../middlewares/authMiddleware');
const User = require('../models/userModel');

// Crear producto (requiere token)
router.post('/', authenticateToken, async (req, res) => {
  const { name, price, description } = req.body;

  // Asegurarse que quien crea sea un proveedor
  if (req.user.rol !== 'proveedor') {
    return res.status(403).json({ error: 'Solo proveedores pueden crear productos' });
  }

  if (!name || !price) {
    return res.status(400).json({ error: 'Faltan datos obligatorios: name o price' });
  }

  try {
    const newProduct = await Product.create({
      name,
      price,
      description,
      userId: req.user.id,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

// Listar todos los productos (incluye info del proveedor)
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'rol'] }],
      order: [['id', 'DESC']],
    });
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Listar productos del proveedor autenticado
router.get('/my-products', authenticateToken, async (req, res) => {
  if (req.user.rol !== 'proveedor') {
    return res.status(403).json({ error: 'Solo proveedores pueden ver sus productos' });
  }

  try {
    const products = await Product.findAll({
      where: { userId: req.user.id },
      order: [['id', 'DESC']],
    });

    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos del proveedor:', error);
    res.status(500).json({ error: 'Error al obtener productos del proveedor' });
  }
});

module.exports = router;
