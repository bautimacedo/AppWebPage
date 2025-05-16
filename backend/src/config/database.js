require('dotenv').config(); // Carga el archivo .env
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT,
        logging: false,
    }
);

sequelize.authenticate()
    .then(() => console.log("✅ Conectado a PostgreSQL correctamente"))
    .catch(err => console.error("❌ Error al conectar con PostgreSQL:", err));

module.exports = sequelize;
