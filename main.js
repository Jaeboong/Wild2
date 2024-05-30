require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const asyncHandler = require('express-async-handler');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt'); 
const { sequelize, User, Post, Comment } = require('./src/index');  // Sequelize 인스턴스 및 모델 가져오기

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

const boardRoutes = require('./src/routes/boardRoutes');
app.use('/', asyncHandler(boardRoutes));

app.use((req, res, next) => {
  res.status(404).send('Page not found');
});

const initializeApp = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ force: true });  // 데이터베이스 동기화 (force: true로 설정하여 기존 테이블을 삭제하고 다시 생성)
    console.log('Database synchronized');

    
    const adminPassword = await bcrypt.hash('qwer1234', 10);
    await User.bulkCreate([
      { userid: 'admin',
      username: 'admin', 
      email: 'admin@korea.ac.kr',
      phoneNumber: 'adminNumber',
      password: adminPassword,
      isAdmin: true }
    ]);
    console.log('Admin account created');

    // 목업 데이터 삽입
    await Post.bulkCreate([
      { 
      postid: 1,
      userid: 'admin', 
      title: '제목1', 
      content: '내용 1 - 민원넣습니다.', 
      category: 'complain', 
      recommend: 19, 
      image: null,
      reports: 0, 
      date: new Date('2024-05-19T00:00:00.000Z'), 
      },
      { 
      postid: 2,
      userid: 'admin', 
      title: '제목2', 
      content: '내용 2 - 민원넣습니다.', 
      category: 'report', 
      recommend: 19, 
      image: null,
      reports: 0, 
      date: new Date('2024-05-20T00:00:00.000Z'), 
      },
      {
      postid: 3,
      userid: 'admin', 
      title: '제목3', 
      content: '내용 3 - 민원넣습니다.', 
      category: 'report', 
      recommend: 19, 
      image: null,
      reports: 0, 
      date: new Date('2024-05-21T00:00:00.000Z'), 
      },
      { 
      postid: 4,
      userid: 'admin', 
      title: '제목4', 
      content: '내용 4 - 민원넣습니다.', 
      category: 'report', 
      recommend: 19, 
      image: null,
      reports: 0, 
      date: new Date('2024-05-22T00:00:00.000Z'), 
      },
      { 
      postid: 5,
      userid: 'admin', 
      title: '제목5', 
      content: '내용 5 - 민원넣습니다.', 
      category: 'announce', 
      recommend: 19, 
      image: null,
      reports: 0, 
      date: new Date('2024-05-23T00:00:00.000Z'), 
      },
      { 
      postid: 6,
      userid: 'admin', 
      title: '제목6', 
      content: '내용 6 - 민원넣습니다.', 
      category: 'report', 
      recommend: 19, 
      image: null,
      reports: 0, 
      date: new Date('2024-05-24T00:00:00.000Z'), 
      },
      {
      postid: 7,
      userid: 'admin', 
      title: '제목7', 
      content: '내용 7 - 민원넣습니다.', 
      category: 'report', 
      recommend: 19, 
      image: null,
      reports: 0, 
      date: new Date('2024-05-25T00:00:00.000Z'), 
      },
      { 
      postid: 8,
      userid: 'admin', 
      title: '제목8', 
      content: '내용 8 - 민원넣습니다.', 
      category: 'report', 
      recommend: 19, 
      image: null,
      reports: 0, 
      date: new Date('2024-05-26T00:00:00.000Z'), 
      },
      
      { 
        postid: 9,
        userid: 'admin', 
        title: '제목9', 
        content: '내용 9 - 민원넣습니다.', 
        category: 'report', 
        recommend: 19, 
        image: null,
        reports: 0, 
        date: new Date('2024-05-27T00:00:00.000Z'), 
        },
        {
        postid: 10,
        userid: 'admin', 
        title: '제목10', 
        content: '내용 10 - 민원넣습니다.', 
        category: 'report', 
        recommend: 19, 
        image: null,
        reports: 0, 
        date: new Date('2024-05-28T00:00:00.000Z'), 
        },
        { 
        postid: 11,
        userid: 'admin', 
        title: '제목11', 
        content: '내용 11 - 민원넣습니다.', 
        category: 'report', 
        recommend: 19, 
        image: null,
        reports: 0, 
        date: new Date('2024-05-28T01:00:00.000Z'), 
        },
        { 
        postid: 12,
        userid: 'admin', 
        title: '제목12', 
        content: '내용 12 - 민원넣습니다.', 
        category: 'report', 
        recommend: 19, 
        image: null,
        reports: 0, 
        date: new Date('2024-05-28T02:00:00.000Z'), 
        },
        { 
        postid: 13,
        userid: 'admin', 
        title: '제목13', 
        content: '내용 13 - 민원넣습니다.', 
        category: 'report', 
        recommend: 19, 
        image: null,
        reports: 0, 
        date: new Date('2024-05-28T03:00:00.000Z'), 
        },
    ]);

    console.log('Mock data inserted');

    await Comment.bulkCreate([
      {
      userid: 'admin',
      postid: 1,
      comment: "hi",
      },
      {
        userid: 'admin',
        postid: 1,
        comment: "hi1",
        },
        {
          userid: 'admin',
          postid: 2,
          comment: "hi2",
          }
    ])

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

initializeApp();



app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
