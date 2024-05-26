'use strict';

const { Sequelize, DataTypes } = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      name: {
        type: DataTypes.STRING(50),  
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(20),  
        allowNull: false,
        unique: true,
        defaultValue: 'N/A',  // 기본값 설정
      },
      email: {
        type: DataTypes.STRING(100),  
        allowNull: false,
        unique: true,
        defaultValue: 'N/A',  // 기본값 설정
      },
      password: {
        type: DataTypes.STRING(100), 
        allowNull: false,
        defaultValue: 'N/A',  // 기본값 설정
      },
      admin:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        
      },
      blacked:{
        type: DataTypes.INTEGER,
        allownull: true,
        defaultValue: 0,
        
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
    // 테이블 관계 설정
  }
}