'use strict';

const { Sequelize, DataTypes } = require('sequelize');

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      postid: {
        type: DataTypes.INTEGER(50), 
        allowNull: false,
      },
      userid: {
        type: DataTypes.STRING(50), // 변경된 부분
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT, 
        allowNull: false
      },
      title: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },voteTitle: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defalutValue: "투표",
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'complain',
      },
      recommend: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      image: {
        type: DataTypes.BLOB,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      reports: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      needVote: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      }
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
    this.belongsTo(index.User, { foreignKey: 'userid', targetKey: 'userid' }); // 변경된 부분
    this.hasMany(index.Comment, { foreignKey: 'postid', sourceKey: 'id' , as: 'Comments'});
    this.hasMany(index.Recommend, { foreignKey: 'postid', sourceKey: 'id' });
    this.hasMany(index.Report, { foreignKey: 'postid', sourceKey: 'id' });
    this.hasMany(index.Vote, { foreignKey: 'postid', sourceKey: 'id' });
  }
}
