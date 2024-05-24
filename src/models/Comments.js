'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../index'); // sequelize 인스턴스를 가져옵니다

module.exports = class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      author: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      recommendations: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Comment',
      tableName: 'comments',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(index) {
    this.belongsTo(index.Post, { foreignKey: 'postId', targetKey: 'id' });
  }
}
