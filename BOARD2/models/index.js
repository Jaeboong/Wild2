// src/index.js
'use strict';
const fs = require('fs');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// 모델들 불러오기
const Post = require('./Post');

// 모델 초기화
Post.init(sequelize);

// 모델들을 db 객체에 등록
db.Post = Post;

// 모델 간 관계 설정 (associate 메소드가 정의된 경우)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// 시퀄라이즈 인스턴스와 모델들을 db 객체에 저장
db.sequelize = sequelize;

module.exports = db;
