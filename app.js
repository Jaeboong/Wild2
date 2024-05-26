require('dotenv').config();
const express = require('express');
const expressLayouts = require("express-ejs-layouts");
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const asyncHandler = require('express-async-handler');
const { sequelize, Post } = require('./BOARD2/models/index');  // Sequelize 인스턴스 및 모델 가져오기

const app = express();
const port = process.env.PORT || 3000;

const initializeApp = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ force: true });  // 데이터베이스 동기화 (force: true로 설정하여 기존 테이블을 삭제하고 다시 생성)
    console.log('Database synchronized');

    // 목업 데이터 삽입
    await Post.bulkCreate([
        { number: 1, author: '작성자1', title: '제목1', body: '내용 1 - 민원넣습니다.', recommendations: 19, createdAt: new Date('2024-05-19T00:00:00.000Z') },
        { number: 2, author: '작성자2', title: '제목2', body: '내용 2 - 민원넣습니다.', recommendations: 5, createdAt: new Date('2024-05-20T00:00:00.000Z') },
        { number: 3, author: '작성자3', title: '제목3', body: '내용 3 - 민원넣습니다.', recommendations: 2, createdAt: new Date('2024-05-21T00:00:00.000Z') }
      ]);
    console.log('Mock data inserted');

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

initializeApp();


app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", "./BOARD2/views");
app.use(express.static("./BOARD2/public"));

// 기본 경로에 대한 응답 설정
app.use("/", require("./BOARD2/routes/main"));

// app.use((req, res, next) => {
//   res.status(404).send('Page not found');
// });

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});