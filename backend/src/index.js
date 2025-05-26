require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const sequelize = require('./config/database');
const User = require('./models/userModel');
const Provider = require('./models/providerModel');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const profileRoutes = require('./routes/profileRoutes'); // Importamos perfil

const PORT = 3000; // http://localhost:3000

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/', profileRoutes); // Montamos las rutas de perfil (usa /profile)

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

// Registro de usuario
app.post('/register', async (req, res) => {
  console.log('Datos recibidos:', req.body);
  const { name, lastname, email, password, rol, sector } = req.body;

  if (!name || !lastname || !email || !password || !rol || !sector) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

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

// Login usuarios
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

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: `Usuario ${user.email} logueado correctamente`,
      token
    });
  } catch (error) {
    console.error('Error en /login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Login proveedores
app.post('/login-provider', async (req, res) => {
  const { email, password } = req.body;

  try {
    const provider = await Provider.findOne({ where: { email } });
    if (!provider) {
      return res.status(401).json({ error: 'Proveedor no encontrado' });
    }

    const validPassword = await bcrypt.compare(password, provider.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { providerId: provider.id, email: provider.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: `Proveedor ${provider.email} autenticado correctamente`,
      token
    });
  } catch (error) {
    console.error('Error en /login-provider:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar usuario (requiere token)
const { authenticateToken } = require('./middlewares/authMiddleware'); // Importa tu middleware de auth

app.put('/api/users/:id', authenticateToken, async (req, res) => {
  const userId = req.params.id;
  const { name, lastname, email, password, rol, sector } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (req.user.id !== user.id) {
      return res.status(403).json({ error: 'No tienes permisos para actualizar este usuario' });
    }

    let hashedPassword = user.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

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
