require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const sequelize = require('./config/database');
const Warning = require('./models/warningModel'); // Importa el modelo de Warning

//Definimos Roles
const User = require('./models/userModel');
const Admin = require('./models/adminModel');
const Product = require('./models/productModel');
//Definimos Rutas
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const profileRoutes = require('./routes/profileRoutes');
const path = require('path');


console.log('adminRoutes es router?', typeof adminRoutes === 'function');
console.log('adminRoutes:', adminRoutes);

const PORT = 3000; // http://localhost:3000

const { authenticateToken } = require('./middlewares/authMiddleware'); // Importa tu middleware de auth
const { authenticateAdminToken } = require('./middlewares/authAdminMiddleware');


const authAdminMiddleware = require('./middlewares/authAdminMiddleware');
console.log('authAdminMiddleware:', authAdminMiddleware);

// Middlewares
app.use(express.json({ limit: '100mb' })); // Aumenta el límite de tamaño del cuerpo a 10mb
app.use(express.urlencoded({ extended: true, limit: '100mb' })); // Aumenta el límite de tamaño del cuerpo a 10mb
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

console.log('authenticateAdminToken es función?', typeof authenticateAdminToken === 'function');
console.log('adminRoutes es router?', typeof adminRoutes === 'function');

console.log('adminRoutes:', adminRoutes);
console.log('typeof adminRoutes:', typeof adminRoutes);


// Rutas
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/', profileRoutes);
app.use('/api/profile', profileRoutes); // Ruta para el perfil del usuario

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
  const { name, lastname, email, password, rol } = req.body;

  if (!name || !lastname || !email || !password || !rol) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, lastname, email, password: hashedPassword, rol });

    res.json({
      message: 'Usuario registrado correctamente',
      user: {
        id: newUser.id,
        name: newUser.name,
        lastname: newUser.lastname,
        email: newUser.email,
        rol: newUser.rol,
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
      token,
      userId: user.id,
      rol: user.rol,
    });
  } catch (error) {
    console.error('Error en /login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


//Login Admin
app.post('/login-admin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return res.status(401).json({ error: 'Admin no encontrado' });

    const validPass = await bcrypt.compare(password, admin.password);
    if (!validPass) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_ADMIN_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ message: 'Admin autenticado correctamente', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno servidor' });
  }
});



// Actualizar usuario (requiere token)



app.put('/api/users/:id', authenticateToken, async (req, res) => {
  const userId = req.params.id;
  const { name, lastname, email, password, rol } = req.body;

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
    });

    res.json({
      message: 'Usuario actualizado correctamente',
      user: {
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        rol: user.rol,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});


app.put('/api/products/:id', async (req, res) => {
  const id = req.params.id;
  const { name, description, price } = req.body;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.name = name;
    product.description = description;
    product.price = price;
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Traer todos los proveedores

app.get('/api/providers', async (req, res) => {
  try {
    const providers = await User.findAll({
      where: { rol: 'proveedor' },
      attributes: ['name', 'lastname', 'email']
    });
    res.json(providers);
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    res.status(500).json({ error: 'Error al obtener proveedores' });
  }
});
