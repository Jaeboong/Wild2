'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../models/index'); // sequelize 인스턴스를 가져옵니다

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      userId: {
        type: DataTypes.STRING(8),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'complain',
      },
      recommendations: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      reports: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      }
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Post',
      tableName: 'test',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }
}

