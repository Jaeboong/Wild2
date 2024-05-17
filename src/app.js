const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// /login 경로 요청시 template/login.html 파일 열림
app.get('/login', (req, res) => {
  const filePath = path.join(__dirname, 'template', 'login.html');
  res.sendFile(filePath);
});

// /login 경로 요청시 template/sign-up.html 파일 열림
app.get('/sign-up', (req, res) => {
  const filePath = path.join(__dirname, 'template', 'sign-up.html');
  res.sendFile(filePath);
});

// 서버 시작 확인 
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
