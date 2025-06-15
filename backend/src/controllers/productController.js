// controllers/productController.js
const Product = require('../models/productModel');
const User = require('../models/userModel');

exports.createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const userId = req.user.id; // Supongamos que el proveedor está logueado y su id viene en req.user

    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const newProduct = await Product.create({
      name,
      price,
      description,
      userId,  // Asociamos el producto con el proveedor logueado
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating product' });
  }
};

const getPaginatedProductsByProvider = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const offset = (page - 1) * limit;

    const { count, rows } = await Product.findAndCountAll({
      where: { userId },
      limit,
      offset,
      order: [['createdat', 'DESC']]
    });

    res.json({
      products: rows,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalItems: count
    });
  } catch (error) {
    console.error("Error al obtener productos paginados:", error);
    res.status(500).json({ error: "Error al obtener productos paginados" });
  }
};


const getAllProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const offset = (page - 1) * limit;

  try {
    const { count, rows: products } = await Product.findAndCountAll({
      limit,
      offset,
      include: {
        model: User,
        as: 'provider',
        attributes: ['name', 'lastname', 'email']
      },
      order: [['id', 'DESC']]
    });

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      products
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};


// Eliminar un producto
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Producto eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};

module.exports = {
  getAllProducts,
  deleteProduct,
  getPaginatedProductsByProvider,
};