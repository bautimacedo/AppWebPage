require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const User = require('./models/userModel'); // Ajusta la ruta según dónde esté el modelo
const bcrypt = require('bcrypt');
const productRoutes = require('./routes/productRoutes');

const PORT = 3000; //http://localhost:3000

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors()); // Permite CORS para todas las rutas y orígenes
app.use(express.json()); // Para parsear JSON automáticamente

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);


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
// Después de conectar a la base de datos:
const setupAssociations = require('./models/associations');
setupAssociations();

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
const jwt = require('jsonwebtoken');

app.post('/login', async (req, res) => {
  console.log('Login - req.body:', req.body);

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const passwordValida = await bcrypt.compare(password, user.password);

    if (!passwordValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Generar token JWT con payload básico (por ejemplo id y email)
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,  // tu secreto en .env
      { expiresIn: '1d' }  // duración del token (1 día)
    );

    // Devolver token al cliente
    res.json({ 
      message: `Usuario ${user.email} logueado correctamente`,
      token
    });

  } catch (error) {
    console.error('Error en /login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.put('/api/users/:id', authenticateToken, async (req, res) => {
  const userId = req.params.id;
  const { name, lastname, email, password, rol, sector } = req.body;

  try {
    // Buscar usuario por id
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Opcional: verificar que el usuario que hace la petición sea el mismo o tenga permisos
    if (req.user.id !== user.id) {
      return res.status(403).json({ error: 'No tienes permisos para actualizar este usuario' });
    }

    // Hashear contraseña si se envía
    let hashedPassword = user.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Actualizar usuario con los datos recibidos (si no vienen, mantiene los actuales)
    await user.update({
      name: name ?? user.name,
      lastname: lastname ?? user.lastname,
      email: email ?? user.email,
      password: hashedPassword,
      rol: rol ?? user.rol,
      sector: sector ?? user.sector
    });

    res.json({
      message: 'Usuario actualizado correctamente',
      user: {
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        rol: user.rol,
        sector: user.sector
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});
// Ruta para obtener el perfil del usuario autenticado


