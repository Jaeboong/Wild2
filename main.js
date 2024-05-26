require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const asyncHandler = require('express-async-handler');
const { sequelize, User } = require('./src/index');  // Sequelize 인스턴스 및 모델 가져오기
const Announcement = require('./models/announcement');
const Complain = require('./models/complain');

const app = express();
const port = process.env.PORT || 3000;

const initializeApp = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ force: true });  // 데이터베이스 동기화 (force: true로 설정하여 기존 테이블을 삭제하고 다시 생성)
    console.log('Database synchronized');

    // 목업 데이터 삽입
    await Announcement.bulkCreate([
      { title: 'Sample Announcement 1' },
      { title: 'Sample Announcement 2' },
      { title: 'Sample Announcement 3' },
      { title: 'Sample Announcement 4' }
    ]);

    await Complain.bulkCreate([
      { title: 'Sample Complain 1' },
      { title: 'Sample Complain 2' },
      { title: 'Sample Complain 3' },
      { title: 'Sample Complain 4' }
    ]);

    console.log('Mock data inserted');

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

initializeApp();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'src', 'views'));


// 기본 경로에 대한 응답 설정
app.get('/', (req, res) => {
  res.send('Welcome to the home page');
});


app.use((req, res, next) => {
  res.status(404).send('Page not found');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
