// sync.js
const sequelize = require('./config/database');
const Post = require('./models/Post');

async function syncDatabase() {
  try {
    await sequelize.sync({ force: true }); // 기존 테이블을 삭제하고 새로 만듭니다.
    console.log('Database synchronized');
  } catch (error) {
    console.error('Unable to sync database:', error);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();