// controllers/productController.js
const Product = require('../models/productModel');

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
