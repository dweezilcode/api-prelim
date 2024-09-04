const config = require('config/config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    try {
        const { host, port, username, password, database } = config.development;
        
        
        const connection = await mysql.createConnection({ host, port, user: username, password });
        
        
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        
        
        await connection.end();
        
        
        const sequelize = new Sequelize(database, username, password, { dialect: 'mysql', host });
        
        
        db.User = require('../users/user.model')(sequelize);
        await sequelize.sync({ alter: true });
    } catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
}
