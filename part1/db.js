const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'DogWalkService',   // 你的数据库名
  waitForConnections: true,
});

module.exports = pool;
