'use strict';

const { Sequelize, DataTypes } = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      userid: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: ''
      },
      phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: ''
      },
      black: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      }
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }
  static associate(db) {
    this.hasMany(db.Post, { foreignKey: 'userid', sourceKey: 'userid' });
    this.hasMany(db.Comment, { foreignKey: 'userid', sourceKey: 'userid' });
    this.hasMany(db.Recommend, { foreignKey: 'userid', sourceKey: 'userid' });
    this.hasMany(db.Report, { foreignKey: 'userid', sourceKey: 'userid' });
    this.hasMany(db.Vote, { foreignKey: 'userid', sourceKey: 'userid' });
  }
}
