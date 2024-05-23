'use strict';

const { Sequelize, DataTypes } = require('sequelize');

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

  static associate(db) {
    // 테이블 관계 설정 (예: 댓글 등)
  }
}
