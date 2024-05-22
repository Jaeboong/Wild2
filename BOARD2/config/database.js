// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('wild2', 'wild2', 'wild2', {
  host: 'localhost',
  port: 3308,
  dialect: 'mariadb'
});

module.exports = sequelize;