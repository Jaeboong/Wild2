require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const { sequelize, User } = require('./src/index');  // Sequelize 인스턴스 및 모델 가져오기

const app = express();
const port = process.env.PORT || 3000;


const initializeApp = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ force: true });  // 데이터베이스 동기화 (force: true로 설정하여 기존 테이블을 삭제하고 다시 생성)
    console.log('Database synchronized');

    // 목업 데이터 삽입
    await User.bulkCreate([
      { name: 'Alice3', phone:'010-1111-1111',email:'123@gmail.com',password: '123'},
      { name: 'Bob3', phone:'010-2222-2222',email:'456@gmail.com',password: '456'},
      { name: 'Charlie3', phone:'010-3333-3333',email:'789@gmail.com',password: '789'},
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


app.get('/login', (req, res) => {
  const filePath = path.join(__dirname, './src/template', 'login.html');
  res.sendFile(filePath);
});

app.get('/sign-up', (req, res) => {
  const filePath = path.join(__dirname, './src/template', 'sign-up.html');
  res.sendFile(filePath);
});


//로그인 과정
app.post('/login', async function(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  try {
    // 이메일로 사용자 조회
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(401).send('없는 정보입니다');
    }

    // 비밀번호 확인
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return res.send(user.name + "님 어서오세요");
    }else {
      return res.status(401).send('없는 정보입니다');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal server error');
  }
});

//회원가입
app.post('/sign-up', async function(req, res) {
  const name = req.body.fName + req.body.lName;
  const phone = req.body.phone;
  const email = req.body.email;
  const password = req.body.psw;
  const confirmPassword = req.body.cPsw;

  // 누락된 경우 응답으로 경고 메시지 반환
  if (!name || !phone || !email || !password) {
    return res.status(400).send('정보를 모두 입력하세요');
  }

  // 비밀번호가 다른 경우
  if (password !== confirmPassword) {
    return res.status(400).send('비밀번호가 일치하지 않습니다');
  }

  try {
    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새 사용자 생성
    const newUser = await User.create({ name, phone, email, password: hashedPassword });
    return res.status(201).send('회원가입이 완료되었습니다.');
  } catch (err) {
    console.error(err);
    // 이메일 또는 전화번호가 중복된 경우를 처리
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).send('이미 사용 중인 이메일 또는 전화번호입니다.');
    }
    return res.status(500).send('Internal server error');
  }
});


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
