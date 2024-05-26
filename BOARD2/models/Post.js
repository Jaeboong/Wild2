'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../models/index'); // sequelize 인스턴스를 가져옵니다

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      number: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      author: {
        type: DataTypes.STRING(8),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      content: { 
        type: DataTypes.TEXT,
        allowNull: false,
      },
      recommendations: {
        type: DataTypes.STRING,
        defaultValue: 0,
      }
    }, {
      sequelize,
      timestamps: true, // timestamps를 true로 설정
      underscored: false,
      modelName: 'Post',
      tableName: 'posts',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    
  }
};