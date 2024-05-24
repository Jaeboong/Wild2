// src/index.js
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
const User = require('./models/user');
const Post = require('./models/Post');
const Comments = require('./models/Comments');
User.init(sequelize);
Post.init(sequelize);
Comments.init(sequelize);
db.User = User;
db.Post = Post;
db.Comments = Comments;

// 모델 간의 관계 설정
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
