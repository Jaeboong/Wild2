require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const asyncHandler = require('express-async-handler');
const { sequelize, User } = require('./src/index');  // Sequelize 인스턴스 및 모델 가져오기

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

const boardRoutes = require('./src/routes/boardRoutes');
app.use('/board', asyncHandler(boardRoutes));

app.use((req, res, next) => {
  res.status(404).send('Page not found');
});

const initializeApp = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ force: true });  // 데이터베이스 동기화 (force: true로 설정하여 기존 테이블을 삭제하고 다시 생성)
    console.log('Database synchronized');

    // 목업 데이터 삽입
    await User.bulkCreate([
      { name: 'Alice2', age: 30, married: false },
      { name: 'Bob2', age: 40, married: true },
      { name: 'Charlie2', age: 25, married: false },
    ]);
    console.log('Mock data inserted');

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

initializeApp();



app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
