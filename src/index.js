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
} else { // 새로운 시퀄라이즈 인스턴스 생성.
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const User = require('./models/user');
// const Post = require('./models/post'); // 게시판 모델링
User.init(sequelize);
// Post.init(sequelize);
db.User = User;
// db.Post = Post;

// 모델 간 관계설정
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
