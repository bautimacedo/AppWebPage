const User = require('../models/userModel');
const Product = require('../models/productModel');
const Warning = require('../models/warningModel');
const sequelize = require('../config/database');

exports.getGrowthStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalProducts = await Product.count();
    const totalWarnings = await Warning.count();

    const usersByRole = await User.findAll({
      attributes: ['rol', [sequelize.fn('COUNT', sequelize.col('rol')), 'count']],
      group: ['rol']
    });

    const productsPerUser = await Product.findAll({
      attributes: ['userId', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['userId']
    });

    const allWarnings = await Warning.findAll({ attributes: ['createdAt'] });

    const userStats = await User.findAll({
      attributes: [
        [sequelize.literal('TO_CHAR("createdat", \'YYYY-MM\')'), 'month'],
        [sequelize.fn('COUNT', '*'), 'count']
      ],
      group: [sequelize.literal('TO_CHAR("createdat", \'YYYY-MM\')')],
      order: [[sequelize.literal('TO_CHAR("createdat", \'YYYY-MM\')'), 'ASC']]
    });

    const productStats = await Product.findAll({
      attributes: [
        [sequelize.literal('TO_CHAR("createdat", \'YYYY-MM\')'), 'month'],
        [sequelize.fn('COUNT', '*'), 'count']
      ],
      group: [sequelize.literal('TO_CHAR("createdat", \'YYYY-MM\')')],
      order: [[sequelize.literal('TO_CHAR("createdat", \'YYYY-MM\')'), 'ASC']]
    });

    res.json({
      totalUsers,
      totalProducts,
      totalWarnings,
      usersByRole,
      productsPerUser,
      allWarnings,
      growthData: { users: userStats, products: productStats }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching statistics' });
  }
};
