const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');
const { authenticateToken } = require('../middlewares/authMiddleware'); // Creamos un middleware aparte para reusar
// Agrega esto temporalmente en productRoutes.js para debuggear
console.log('Middleware importado:', require('../middlewares/authMiddleware'));
// Debe mostrar { authenticateToken: [Function] } o { authMiddleware: [Function] }
// Crear producto (requiere token)
router.post('/', authenticateToken, async (req, res) => {
  const { name, price, description } = req.body;
  if (!name || !price) return res.status(400).json({ error: 'Nombre y precio son obligatorios' });

  try {
    const newProduct = await Product.create({
      name,
      price,
      description,
      userId: req.user.id, // Se asocia el producto al usuario logueado
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

// Listar productos del usuario logueado
router.get('/', authenticateToken, async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

module.exports = router;
