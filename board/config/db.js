require('dotenv').config();
const mariadb = require('mariadb');

const conn = mariadb.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    connectionLimit: 5
});

module.exports.conn = conn;
