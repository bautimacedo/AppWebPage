const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');

const Warning = sequelize.define('Warning', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
  type: DataTypes.INTEGER,
  allowNull: false,
  field: 'userid',
  references: {
    model: 'users',
    key: 'id'
  }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  issuedBy: {
    type: DataTypes.STRING,
    allowNull: true,
     field: 'issuedby' // 👈 importante para que coincida con la BD
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'createdat', // 👈 clave
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false,
  tableName: 'warnings'
});

User.hasMany(Warning, { foreignKey: 'userId' });
Warning.belongsTo(User, { foreignKey: 'userId' });

module.exports = Warning;
