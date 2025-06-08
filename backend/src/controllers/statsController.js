const User = require('../models/userModel');
const Product = require('../models/productModel');
const sequelize = require('../config/database');

exports.getGrowthStats = async (req, res) => {
  try {
    const userStats = await User.findAll({
      attributes: [
        [sequelize.literal("TO_CHAR(\"createdAt\", 'YYYY-MM')"), 'month'],
        [sequelize.fn('COUNT', '*'), 'count']
      ],
      group: [sequelize.literal("TO_CHAR(\"createdAt\", 'YYYY-MM')")],
      order: [[sequelize.literal("TO_CHAR(\"createdAt\", 'YYYY-MM')"), 'ASC']]
    });

    const productStats = await Product.findAll({
      attributes: [
        [sequelize.literal("TO_CHAR(\"createdAt\", 'YYYY-MM')"), 'month'],
        [sequelize.fn('COUNT', '*'), 'count']
      ],
      group: [sequelize.literal("TO_CHAR(\"createdAt\", 'YYYY-MM')")],
      order: [[sequelize.literal("TO_CHAR(\"createdAt\", 'YYYY-MM')"), 'ASC']]
    });

    res.json({ users: userStats, products: productStats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching growth stats' });
  }
};
