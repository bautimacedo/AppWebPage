const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Provider = require('./providerModel');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  description: {type: DataTypes.STRING, allowNull: true},
  providerId: { //Referencia al proviedr que lo creo
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'providers',
      key: 'id'
    }
  }
}, {
  timestamps: false,
  tableName: 'products'
});

// Cada producto pertenece a un proveedor
Product.belongsTo(Provider, { foreignKey: 'providerId' });

module.exports = Product;
