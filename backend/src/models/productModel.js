const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: true },
  imageUrl: { // <-- Campo nuevo para imagen
    type: DataTypes.STRING,
    field: 'imageurl', // 👈 esto lo conecta con la columna real
    allowNull: true
  },
  userId: { // Clave foránea a la tabla users
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  timestamps: false,
  tableName: 'products'
});

module.exports = Product;
