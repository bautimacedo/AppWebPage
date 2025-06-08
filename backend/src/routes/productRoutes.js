const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');
const User = require('../models/userModel');
const { authenticateToken } = require('../middlewares/authMiddleware');
const upload = require('../../utils/upload'); // Para manejar multipart/form-data

// Crear un nuevo producto (datos sin imagen)
router.post('/', authenticateToken, upload.none(), async (req, res) => {
  const userId = req.user?.id || req.user?.userId;
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
      userId,
    });

    res.status(201).json(newProduct);

  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

// Subir imagen a un producto
router.post('/:id/photo', authenticateToken, upload.single('photo'), async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Validar que el producto pertenezca al usuario
    if (product.userId !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso para modificar este producto' });
    }

    product.imageUrl = req.file.filename;
    await product.save();

    res.json({ message: 'Imagen subida correctamente', image: req.file.filename });
  } catch (error) {
    console.error('Error al subir imagen del producto:', error);
    res.status(500).json({ error: 'Error al subir la imagen del producto' });
  }
});

// Obtener todos los productos
router.get('/', async (req, res) => {
  const { providerId } = req.query;

  let whereClause = {};
  if (providerId) {
    whereClause.userId = providerId;  // o el campo que relacione producto con proveedor
  }

  try {
    const products = await Product.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'provider',
        attributes: ['name']
      }],
      order: [['id', 'DESC']],
    });
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});


// Obtener productos del proveedor logueado
router.get('/my-products', authenticateToken, async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

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

// Obtener un producto por ID
// Obtener un producto por ID (con su proveedor)
router.get('/:id', authenticateToken, async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findByPk(productId, {
      include: [{
        model: User,
        as: 'provider',
        attributes: ['id', 'name', 'lastname', 'email', 'location', 'description', 'imageUrl'],
      }]
    });

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

module.exports = router;
