'use strict';

const { Sequelize, DataTypes } = require('sequelize');

module.exports = class Vote extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      postid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userid: {
        type: DataTypes.STRING(15), // 변경된 부분
        allowNull: false,
      },
      agree: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      disagree: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Vote',
      tableName: 'votes',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    this.belongsTo(db.Post, { foreignKey: 'postid', targetKey: 'id' });
    this.belongsTo(db.User, { foreignKey: 'userid', targetKey: 'userid' }); // 변경된 부분
  }
}
