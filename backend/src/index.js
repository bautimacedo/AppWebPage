require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');

const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors()); // Permite CORS para todas las rutas y orígenes
app.use(express.json()); // Para parsear JSON automáticamente

// Rutas
app.use('/api/users', userRoutes);

// Conexión a la DB
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a la base de datos exitosa.');
    app.listen(PORT, () => {
      console.log(`🌐 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al conectar con la base de datos:', error.message);
  });

  app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente');
});
const User = require('./models/userModel'); // Ajusta la ruta según dónde esté el modelo

app.post('/register', async (req, res) => {
    console.log('Datos recibidos:', req.body);

    // Desestructurando todos los datos que recibís del formulario
    const { name, lastname, email, password, rol, sector } = req.body;

    // Validación de datos
    if (!name || !lastname || !email || !password || !rol || !sector) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    try {
        const newUser = await User.create({ name, lastname, email, password, rol, sector });

        res.json({
            message: 'Usuario registrado correctamente',
            user: {
                id: newUser.id,
                name: newUser.name,
                lastname: newUser.lastname,
                email: newUser.email,
                rol: newUser.rol,
                sector: newUser.sector
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar el usuario en la base de datos' });
    }
});





// Ruta de login (POST /login)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Buscar el usuario por nombre
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const user = result.rows[0];

    // Comparar contraseña ingresada con la almacenada
    const passwordValida = await bcrypt.compare(password, user.password);

    if (!passwordValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Login exitoso
    res.json({ message: `Usuario ${username} logueado correctamente` });

  } catch (error) {
    console.error('Error en /login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });


});