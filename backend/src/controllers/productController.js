const Product = require('../models/Product');

const createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    // Si usas token y pusiste userId ahí, lo sacás del token (req.user)
    const userId = req.user.id; 

    // Crear producto
    const product = await Product.create({ name, price, description, userId });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProduct
};
