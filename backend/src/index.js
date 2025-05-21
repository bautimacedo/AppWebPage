require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const User = require('./models/userModel'); // Ajusta la ruta según dónde esté el modelo
const bcrypt = require('bcrypt');

const PORT = 3000; //http://localhost:3000

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


app.post('/register', async (req, res) => {
    console.log('Datos recibidos:', req.body);

    // Desestructurando todos los datos que recibís del formulario
    const { name, lastname, email, password, rol, sector } = req.body;

    // Validación de datos
    if (!name || !lastname || !email || !password || !rol || !sector) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    try {

        const hashedPassword = await bcrypt.hash(password, 10); // se hashea la contraseña y 10 es el salt rounds

        const newUser = await User.create({ name, lastname, email, password: hashedPassword, rol, sector });

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
  console.log('Login - req.body:', req.body);  // <<-- debug para ver qué llega

  const { email, password } = req.body;

  try {
    // Buscar usuario por email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    console.log('Password recibida:', password);
    console.log('Hash guardado en DB:', user.password);
    // Comparar contraseña ingresada con la guardada
    const passwordValida = await bcrypt.compare(password, user.password);
    console.log('Resultado bcrypt.compare:', passwordValida);

    
    if (!passwordValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    res.json({ message: `Usuario ${user.email} logueado correctamente` });

  } catch (error) {
    console.error('Error en /login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
