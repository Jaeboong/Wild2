require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const asyncHandler = require('express-async-handler');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt'); 
const { sequelize, User } = require('./src/index');  // Sequelize 인스턴스 및 모델 가져오기

const app = express();
const port = process.env.PORT || 3001;

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
      { name: 'admin', 
      phone: '010-1111-1111', 
      email: 'admin@admin.com', 
      password: adminPassword,
      admin: true }
    ]);
    console.log('Admin account created');

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

initializeApp();



app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
