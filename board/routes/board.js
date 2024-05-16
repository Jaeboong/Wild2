const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        if (!connection) {
            throw new Error('Database connection failed: Connection object is undefined');
        }
        const rows = await connection.query('SHOW TABLES');
        res.send(`Database connection successful: ${rows}`);
    } catch (err) {
        res.status(500).send(`Database connection failed: ${err.message}`);
    } finally {
        if (connection) {
            connection.release(); // 연결 해제
        }
    }
});

module.exports = router;