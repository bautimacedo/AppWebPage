// models/associations.js
const Provider = require('./providerModel');
const Product = require('./productModel');

function setupAssociations() {
  // Un proveedor tiene muchos productos
  Provider.hasMany(Product, {
    foreignKey: 'providerId',
    as: 'products'
  });
  
  // Un producto pertenece a un proveedor
  Product.belongsTo(Provider, {
    foreignKey: 'providerId',
    as: 'provider'
  });
}

module.exports = setupAssociations;