require("dotenv").config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const maraidb = require('../config/db');


const app = express();
const port = process.env.port||3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

maraidb.connect();

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


app.post('/login',function(res,req){
  var email = req.body.email;
  var password = req.body.password;

  var sql = 'SELECT * FROM users WHERE email =?'
  var params = [email];

  conn.query(sql, params, function(err, rows, fields) {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
      return;
    }
  })

  conn.query(sql,params,function(err,rows,field){
    var user = rows[0];

    if(user.email == email && user.password == password){
      res.send(user.name+"님 어서오세요")
    }
    else{
      res.status(401).send('없는 정보입니다');
    }
  });
});

/*
app.post('/sign-up',function(res,req){
  var name = req.body.fName + req.body.lName;
  var phone = req.body.phone;
  var email = req.body.email;
  var password = req.body.password;

  //누락 된 경우 경고창
  if(!name || !phone || !email || !password) {
    alert('정보를 모두 입력하세요');
    return;
  }

  var sql = 'INSERT INTO users (name, phone, email, password) values (?, ?, ?, ?)';
  var params = [name, phone, email, password];

  conn.query(sql, params, function(err, rows, fields) {
    if(err)
      console.log(err);
    else {
      console.log(rows);
      res.send('회원가입이 완료되었습니다.');
    }
  });

});
*/

app.use("/",require("./routes/main"));

// 서버 시작 확인 
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
