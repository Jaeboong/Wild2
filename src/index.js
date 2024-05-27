'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    port: config.port,
    define: {
      timestamps: true,
      underscored: false,
    },
  });
}

// 모델을 가져와 초기화
const User = require('./models/users');
const Post = require('./models/Post');
const Comment = require('./models/Comments');
const Recommend = require('./models/Recommend');
const Report = require('./models/Report');
const Vote = require('./models/Vote');

User.init(sequelize);
Post.init(sequelize);
Comment.init(sequelize);
Recommend.init(sequelize);
Report.init(sequelize);
Vote.init(sequelize);

db.User = User;
db.Post = Post;
db.Comment = Comment;
db.Recommend = Recommend;
db.Report = Report;
db.Vote = Vote;

// 모델 간의 관계 설정
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
