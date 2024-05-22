const mariadb = require('mariadb');

// MariaDB 연결 풀 생성
const pool = mariadb.createPool({
    host: 'localhost', // MariaDB 서버 호스트
    user: 'wild2',      // MariaDB 사용자
    password: 'wild2', // MariaDB 사용자 비밀번호
    port: 3308,
    database: 'wild2',
    connectionLimit: 5  // 연결 풀의 최대 연결 수
});

async function createDatabase() {
    let conn;
    try {
        // MariaDB 서버에 연결
        conn = await pool.getConnection();
        
        // 데이터베이스 생성 SQL 실행
        await conn.query('CREATE DATABASE mydatabase');
        console.log("Database 'mydatabase' created successfully!");
    } catch (err) {
        console.error('Error creating database:', err);
    } finally {
        // 연결 해제
        if (conn) conn.end();
    }
}

// 데이터베이스 생성 함수 호출
createDatabase();