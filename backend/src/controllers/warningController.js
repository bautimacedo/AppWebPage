const Warning = require('../models/warningModel');
const User = require('../models/userModel');

const createWarning = async (req, res) => {
  const { message, issuedBy } = req.body;
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const warning = await Warning.create({ userId, message, issuedBy });
    res.status(201).json(warning);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el warning' });
  }
};

const getWarningsByUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const warnings = await Warning.findAll({ where: { userId } });
    res.json(warnings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los warnings' });
  }
};

module.exports = {
  createWarning,
  getWarningsByUser
};
