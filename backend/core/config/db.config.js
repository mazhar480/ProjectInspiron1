// backend/config/db.config.js

require('dotenv').config(); // Load environment variables from .env file (we'll set this up later)

module.exports = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'your_mysql_user',
    password: process.env.DB_PASSWORD || 'your_mysql_password',
    database: process.env.DB_DATABASE || 'project_inspiron1',
    port: process.env.DB_PORT || 3306
};