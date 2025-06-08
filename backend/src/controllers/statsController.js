// controllers/statsController.js
const { User, Product, Warning } = require('../models');
const { sequelize } = require('../config/database');

exports.getFullStats = async (req, res) => {
  try {
    // Totales
    const totalUsers = await User.count();
    const totalProducts = await Product.count();
    const totalWarnings = await Warning.count();

    // Users por rol
    const usersByRole = await User.findAll({
      attributes: ['rol', [sequelize.fn('COUNT', 'rol'), 'count']],
      group: ['rol']
    });

    // Productos por usuario
    const productsPerUser = await Product.findAll({
      attributes: ['userId', [sequelize.fn('COUNT', 'id'), 'count']],
      group: ['userId']
    });

    // Advertencias totales
    const allWarnings = await Warning.findAll({
      attributes: ['createdAt']
    });

    // Crecimiento mensual
    const usersGrowth = await User.findAll({
      attributes: [
        [sequelize.literal("TO_CHAR(\"createdAt\", 'YYYY-MM')"), 'month'],
        [sequelize.fn('COUNT', '*'), 'count']
      ],
      group: [sequelize.literal("TO_CHAR(\"createdAt\", 'YYYY-MM')")],
      order: [sequelize.literal("TO_CHAR(\"createdAt\", 'YYYY-MM')")]
    });

    const productsGrowth = await Product.findAll({
      attributes: [
        [sequelize.literal("TO_CHAR(\"createdAt\", 'YYYY-MM')"), 'month'],
        [sequelize.fn('COUNT', '*'), 'count']
      ],
      group: [sequelize.literal("TO_CHAR(\"createdAt\", 'YYYY-MM')")],
      order: [sequelize.literal("TO_CHAR(\"createdAt\", 'YYYY-MM')")]
    });

    res.json({
      totalUsers,
      totalProducts,
      totalWarnings,
      usersByRole,
      productsPerUser,
      allWarnings,
      usersGrowth,
      productsGrowth
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching full stats' });
  }
};
