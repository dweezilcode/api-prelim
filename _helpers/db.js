const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

const db = {};

initialize();

async function initialize() {
    try {
        const { host, port, user, password, database } = config.database;
        
        const connection = await mysql.createConnection({ host, port, user, password });
        
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        
        await connection.end();
        
        const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });
        
        db.sequelize = sequelize;
        db.User = require('../users/user.model')(sequelize);
        await sequelize.sync({ alter: true });
    } catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
}

module.exports = db;
