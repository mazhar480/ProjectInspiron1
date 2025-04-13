// backend/database/db.js

const mysql = require('mysql2');
const dbConfig = require('../config/db.config'); // This is the corrected path
require('dotenv').config();

const pool = mysql.createPool({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    port: dbConfig.port,
    waitForConnections: true,
    connectionLimit: 10,
    queueTimeout: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        } else if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        } else {
            console.error('Error connecting to database:', err);
        }
        return;
    }

    console.log('Connected to MySQL database!');
    connection.release();
});

module.exports = pool.promise(); // Export the promise-based pool for async/await