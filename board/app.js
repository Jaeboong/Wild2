const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

const pool = require('./config/db'); // 데이터베이스 연결 가져오기

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//라우팅 추가
app.use('/', require('./routes/board'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
