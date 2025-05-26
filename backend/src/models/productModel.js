const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: true },
  userId: { // <- Clave foránea a la tabla users
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users', // tabla referida
      key: 'id'
    }
  }
}, {
  timestamps: false,
  tableName: 'products'
});

module.exports = Product;
