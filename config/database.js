const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('wild2', 'wild2', 'wild2', {
  host: 'localhost',
  port: 3306,
  dialect: 'mariadb',
});

module.exports = sequelize;