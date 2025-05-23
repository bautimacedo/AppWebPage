const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');
const { authenticateToken } = require('../middlewares/authMiddleware');

console.log('Middleware importado:', require('../middlewares/authMiddleware')); // Esto es para debug

// Crear producto (requiere token)
router.post('/', authenticateToken, async (req, res) => {
  const { name, price, description } = req.body;
  if (!name || !price) return res.status(400).json({ error: 'Nombre y precio son obligatorios' });

  try {
    const newProduct = await Product.create({
      name,
      price,
      description,
      providerId: req.user.id, // 👈 Usamos el ID del proveedor autenticado
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

// Listar productos del proveedor autenticado
router.get('/', authenticateToken, async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { providerId: req.user.id },
      order: [['id', 'DESC']],
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

module.exports = router;
