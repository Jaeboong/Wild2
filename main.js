require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const asyncHandler = require('express-async-handler');
const {sequelize} = require('./src/index');  // Sequelize 인스턴스 및 모델 가져오기
const mainRouter = require('./routes/mainRoutes');

const app = express();
const port = process.env.PORT || 3000;

const initializeApp = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync();  
    console.log('Database synchronized');

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

initializeApp();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', mainRouter);
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
