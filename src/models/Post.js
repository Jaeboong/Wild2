'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../index'); // sequelize 인스턴스를 가져옵니다

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      author: {
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
      voteTitle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'complain',
      },
      votesFor: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      votesAgainst: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      recommendations: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Post',
      tableName: 'posts',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(index) {
    this.hasMany(index.Comments, { foreignKey: 'postId', sourceKey: 'id', as: 'comments' });
  }
}
