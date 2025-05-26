// models/associations.js
const Product = require('./productModel');
const User = require('./userModel');  // Importa el modelo User

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
}

module.exports = setupAssociations;
