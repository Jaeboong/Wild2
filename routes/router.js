const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const { User, Sequelize } = require('../src/index');  // Sequelize 추가
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const router = express.Router();
const { Op } = Sequelize;

// 로그인 페이지
router.get('/login', (req, res) => {
  const filePath = path.join(__dirname, '../src/template', 'login.html');
  res.sendFile(filePath);
});

// 회원가입 페이지
router.get('/sign-up', (req, res) => {
  const filePath = path.join(__dirname, '../src/template', 'sign-up.html');
  res.sendFile(filePath);
});

// 로그인 과정
router.post('/login', async function(req, res) {
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
      // JWT 토큰 생성
      const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });

      // 토큰을 쿠키에 설정
      res.cookie('token', token, { httpOnly: true });

      return res.send(user.name + '님 어서오세요');
    } else {
      return res.status(401).send('비밀번호가 일치하지 않습니다');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal server error');
  }
});

// 회원가입
router.post('/sign-up', async function(req, res) {
  const name = req.body.fName + req.body.lName;
  const phone = req.body.phone;
  const email = req.body.email;
  const password = req.body.psw;
  const confirmPassword = req.body.cPsw;

  // 모두 입력 안하는 경우
  if (!name || !phone || !email || !password || !confirmPassword) {
    return res.status(400).send('정보를 모두 입력하세요');
  }

  // 비밀번호가 다른 경우
  if (password !== confirmPassword) {
    return res.status(400).send('비밀번호가 일치하지 않습니다');
  }

  try {
    // 이메일 또는 전화번호 중복 확인
    const existingUser = await User.findOne({ where: { [Op.or]: [{ email: email }, { phone: phone }] } });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).send('이미 사용 중인 이메일입니다.');
      } else if (existingUser.phone === phone) {
        return res.status(400).send('이미 사용 중인 전화번호입니다.');
      }
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // db저장
    const newUser = await User.create({ name, phone, email, password: hashedPassword });
    return res.status(201).send('회원가입이 완료되었습니다.')
  } catch (err) {
    console.error(err);
    // 기타 오류 처리
    return res.status(500).send('Internal server error');
  }

});

// 기본 경로
router.get('/', (req, res) => {
  res.send('Welcome to the home page');
});

// 404 페이지
router.use((req, res, next) => {
  res.status(404).send('Page not found');
});

module.exports = router;
