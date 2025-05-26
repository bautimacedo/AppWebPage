const User = require('../models/userModel');
const pool = require('../config/database'); // tu conexión a PostgreSQL

const bcrypt = require('bcrypt');
const { User } = require('../models');

const registerUser = async (req, res) => {
  console.log('Datos recibidos:', req.body);
  const { name, lastname, email, password, rol, sector } = req.body;

  if (!name || !lastname || !email || !password || !rol || !sector) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      lastname,
      email,
      password: hashedPassword,
      rol,
      sector
    });

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
};



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


module.exports = {
  createUser,
  getUsers,
  getUserByEmail,
  updateUser,
  registerUser
};
