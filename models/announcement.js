const { DataTypes } = require('sequelize');
const sequelize = require('../src/index');

const Announcement = sequelize.define('Announcement', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  updatedAt: false
});

module.exports = Announcement;
