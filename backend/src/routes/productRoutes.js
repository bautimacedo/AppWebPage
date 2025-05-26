const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');
<<<<<<< HEAD
const { authenticateToken } = require('../middlewares/authMiddleware');

console.log('Middleware importado:', require('../middlewares/authMiddleware')); // Esto es para debug

=======
const Provider = require('../models/providerModel');
const { authenticateToken } = require('../middlewares/authMiddleware');

>>>>>>> c96dcf4c07aa54d61035c7590566473299b94f29
// Crear producto (requiere token)
router.post('/', authenticateToken, async (req, res) => {
  const { name, price, description } = req.body;

  // Asegurarse que quien crea sea un proveedor
  const providerId = req.user?.providerId;
  if (!providerId) {
    return res.status(403).json({ error: 'Solo proveedores pueden crear productos' });
  }

  if (!name || !price) {
    return res.status(400).json({ error: 'Faltan datos obligatorios: name o price' });
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
<<<<<<< HEAD
      providerId: req.user.id, // 👈 Usamos el ID del proveedor autenticado
=======
      providerId,
>>>>>>> c96dcf4c07aa54d61035c7590566473299b94f29
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});
<<<<<<< HEAD

// Listar productos del proveedor autenticado
router.get('/', authenticateToken, async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { providerId: req.user.id },
=======
// Listar todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Provider, as: 'provider' }],
>>>>>>> c96dcf4c07aa54d61035c7590566473299b94f29
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
  const providerId = req.user?.providerId;
  if (!providerId) {
    return res.status(403).json({ error: 'Solo proveedores pueden ver sus productos' });
  }

  try {
    const products = await Product.findAll({
      where: { providerId },
      order: [['id', 'DESC']],
    });

    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos del proveedor:', error);
    res.status(500).json({ error: 'Error al obtener productos del proveedor' });
  }
});



module.exports = router;
