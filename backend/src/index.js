require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/users', userRoutes);

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('No se pudo sincronizar la base de datos:', err);
});
