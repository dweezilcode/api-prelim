const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

const db = {};

initialize();

async function initialize() {
    try {
        const { host, port, user, password, database } = config.database;
        
        // Create MySQL connection and ensure database exists
        const connection = await mysql.createConnection({ host, port, user, password });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        await connection.end();
        
        // Initialize Sequelize with the database
        const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });
        
        // Add models to the db object
        db.sequelize = sequelize;
        db.User = require('../users/user.model')(sequelize);
        db.Activity = require('../users/activity.model')(sequelize); // Added model from sub project

        // Sync models to the database
        await sequelize.sync({ alter: true });
    } catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
}

module.exports = db;
