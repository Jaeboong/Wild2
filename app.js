require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const connectDb = require("./BOARD2/config/db");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const { conn } = require('./BOARD2/config/db');

const app = express();
const port = process.env.PORT || 3000;

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", "./BOARD2/views");

app.use(express.static("./BOARD2/public"));

app.use(express.json());
app.use(express.urlencoded ({extended: true}));

app.use(cookieParser());
app.use(methodOverride("_method"));

app.use("/", require("./BOARD2/routes/main"));

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});