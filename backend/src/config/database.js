// backend/src/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: process.env.DB_PORT || 5432,  
});

sequelize.authenticate()
  .then(() => console.log('✅ Conectado a PostgreSQL correctamente'))
  .catch((err) => console.error('❌ Error al conectar con PostgreSQL:', err));

module.exports = sequelize;

