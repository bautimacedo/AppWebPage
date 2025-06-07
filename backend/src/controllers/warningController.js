const Warning = require('../models/warningModel');
const User = require('../models/userModel');

const createWarning = async (req, res) => {
  const { message, issuedBy } = req.body;
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const warning = await Warning.create({ userId, message, issuedBy }); // 👈 corregido
    res.status(201).json(warning);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el warning' });
  }
};

const getWarningsByUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const warnings = await Warning.findAll({ where: { userId } }); // 👈 corregido
    res.json(warnings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los warnings' });
  }
};

const getAllWarnings = async (req, res) => {
  try {
    const warnings = await Warning.findAll({ include: User });
    res.json(warnings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los warnings' });
  }
};

const deleteWarning = async (req, res) => {
  try {
    const warningId = req.params.id;
    const deleted = await Warning.destroy({ where: { id: warningId } });
    if (deleted) {
      res.json({ message: 'Warning eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'Warning no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el warning' });
  }
};


module.exports = {
  createWarning,
  getWarningsByUser,
  deleteWarning,
  getAllWarnings
};
