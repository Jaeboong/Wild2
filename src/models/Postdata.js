'use strict';

const { Sequelize, DataTypes } = require('sequelize');

module.exports = class Postdata extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isVoted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isRecommended: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Postdata',
      tableName: 'postdata',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(index) {
    this.belongsTo(index.User, { foreignKey: 'userId', targetKey: 'id' });
    this.belongsTo(index.Post, { foreignKey: 'postId', targetKey: 'id' });
  }
}
