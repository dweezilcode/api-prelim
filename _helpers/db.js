const config = require('./config/config.json');  // Update the path to match your project structure
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    try {
        const { host, port, username, password, database } = config.development; // Change to the appropriate environment if needed
        
        // Create a connection without specifying the database
        const connection = await mysql.createConnection({ host, port, user: username, password });
        
        // Create the database if it does not exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        
        // Close the connection
        await connection.end();
        
        // Create a new connection specifying the database
        const sequelize = new Sequelize(database, username, password, { dialect: 'mysql', host });
        
        // Define and synchronize models
        db.User = require('../users/user.model')(sequelize);
        await sequelize.sync({ alter: true });
    } catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
}
