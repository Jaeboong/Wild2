require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

const boardRoutes = require('./src/routes/boardRoutes');
app.use('/board', boardRoutes);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
