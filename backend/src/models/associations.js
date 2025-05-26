// models/associations.js
const Product = require('./productModel');
const User = require('./userModel');

function setupAssociations() {
  // Un proveedor tiene muchos productos
  User.hasMany(Product, {
    foreignKey: 'userId',
    as: 'products'
  });
  
  // Un producto pertenece a un proveedor
  Product.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });
}

module.exports = setupAssociations;