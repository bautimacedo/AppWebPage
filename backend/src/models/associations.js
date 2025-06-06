// models/associations.js
const Product = require('./productModel');
const User = require('./userModel');
const Warning = require('./warningModel');

function setupAssociations() {
  // Un usuario (proveedor) tiene muchos productos
  User.hasMany(Product, {
    foreignKey: 'userId',
    as: 'products'
  });

  // Un producto pertenece a un usuario (proveedor)
  Product.belongsTo(User, {
    foreignKey: 'userId',
    as: 'provider'
  });

  // Un usuario tiene muchas advertencias
  User.hasMany(Warning, {
    foreignKey: 'userId',
    as: 'warnings',
    onDelete: 'CASCADE'
  });

  // Una advertencia pertenece a un usuario
  Warning.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });
}

module.exports = setupAssociations;
