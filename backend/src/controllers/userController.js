const User = require('../models/userModel');
const pool = require('../config/database'); // tu conexión a PostgreSQL
const Warning = require('../models/warningModel');

// Crear un usuario
const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({ name, email, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener usuario por email
const getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener usuario por email:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    const updateData = { name, email };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const [updated] = await User.update(updateData, {
      where: { id: userId }
    });

    if (updated) {
      const updatedUser = await User.findByPk(userId);
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};

const getProviders = async (req, res) => {
  try {
    const providers = await User.findAll({ where: { role: 'provider' } });
    const plainProviders = providers.map(p => p.get({ plain: true }));
    res.json(plainProviders);
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    res.status(500).json({ error: "Error al obtener proveedores" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deleted = await User.destroy({ where: { id: userId } });
    if (deleted) {
      res.json({ message: 'Usuario eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};

// Actualizar warning del usuario
const createWarning = async (req, res) => {
  try {
    const userId = req.params.id;
    const { message, issuedBy } = req.body;

    // Validación mínima
    if (!message) {
      return res.status(400).json({ error: 'El mensaje de advertencia es obligatorio' });
    }

    const warning = await Warning.create({
      userId,
      message,
      issuedBy
    });

    res.status(201).json({ message: 'Advertencia creada correctamente', warning });
  } catch (error) {
    console.error('Error al crear advertencia:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


module.exports = {
  createUser,
  getUsers,
  getUserByEmail,
  updateUser,
  getProviders,
  deleteUser,
  createWarning
};
