const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./productModel');  // Importar el modelo Product

const Provider = sequelize.define('Provider', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'providers'
});

const Product = require('./productModel'); // Importar el modelo Product



// Definir relación: Un proveedor tiene muchos productos
//Provider.hasMany(Product, { foreignKey: 'providerId' });

module.exports = Provider;
