'use strict';

const { Sequelize, DataTypes } = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      userid: { // user의 고유 아이디 필드 추가
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true, // 고유 아이디로 설정
        primaryKey: true, // 기본 키로 설정
      },
      username: {
        type: DataTypes.STRING(50),  
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100), 
        allowNull: false,
      },
      black: {
        type: DataTypes.INTEGER, // 블랙당한 횟수이므로 INTEGER로 변경
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
