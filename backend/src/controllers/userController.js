const User = require('../models/userModel');

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    res.status(201).json({ message: 'Usuario registrado exitosamente', user });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario', error });
  }
};

module.exports = {
  registerUser,
};
