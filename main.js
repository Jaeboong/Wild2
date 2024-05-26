require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const asyncHandler = require('express-async-handler');
const { sequelize, User } = require('./src/index');  // Sequelize 인스턴스 및 모델 가져오기
const expressLayouts = require("express-ejs-layouts"); // ejs 추가
const mypageRoutes = require('./src/routes/mypage'); // 내 정보 수정하기 위한 라우트 추가.

const app = express();
const port = process.env.PORT || 3000;

const initializeApp = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ force: true });  // 데이터베이스 동기화 (force: true로 설정하여 기존 테이블을 삭제하고 다시 생성)
    console.log('Database synchronized');

    // 초기 데이터 삽입
    await User.bulkCreate([
      { name: 'Alice', phone: '123-456-7890', email: 'alice@example.com', password: 'alicepass', admin: false, blacked: 0 },
      { name: 'Bob', phone: '234-567-8901', email: 'bob@example.com', password: 'bobpass', admin: true, blacked: 0 },
      { name: 'Charlie', phone: '345-678-9012', email: 'charlie@example.com', password: 'charliepass', admin: false, blacked: 1 },
      { name: 'David', phone: '456-789-0123', email: 'david@example.com', password: 'davidpass', admin: false, blacked: 0 },
      { name: 'Eva', phone: '567-890-1234', email: 'eva@example.com', password: 'evapass', admin: true, blacked: 1 },
    ]);
    console.log('Mock data inserted');


    // // 데이터 불러오기 및 출력
    // const users = await User.findAll();
    // // console.log('Retrieved users:', users);

    // // 개별 필드 출력
    // users.forEach(user => {
    //   console.log(`Name: ${user.name}, Age: ${user.age}, Married: ${user.married}`);
    // });


  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// initializeApp();

// express 사용위한 초기작업들
app.use(expressLayouts);
app.set('view engine', 'ejs'); // 이 코드 필수.(없으면 에러발생)

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));
app.set('views', path.join(__dirname, 'src', 'views'));

app.use("/", require("./src/routes/mypage")); // 라우트코드 연결(코드 간결성)
app.use(mypageRoutes);


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
