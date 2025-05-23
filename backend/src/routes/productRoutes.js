const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');
const Provider = require('../models/providerModel');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Crear producto (requiere token)
router.post('/', authenticateToken, async (req, res) => {
  const { name, price, description, providerId } = req.body;

  if (!name || !price || !providerId) {
    return res.status(400).json({ error: 'Faltan datos obligatorios: name, price o providerId' });
  }

  try {
    const provider = await Provider.findByPk(providerId);
    if (!provider) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    const newProduct = await Product.create({
      name,
      price,
      description,
      providerId
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

// Listar todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Provider, as: 'provider' }],
      order: [['id', 'DESC']],
    });
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

module.exports = router;
