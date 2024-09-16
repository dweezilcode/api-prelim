require('dotenv').config(); // Load environment variables
const { UserError } = require('./errors'); // Ensure path is correct
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
const path = require('path');

module.exports = db = {}; // Export db object

async function initialize() {
    let sequelize;
    try {
        // Configuration from environment variables
        const config = {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        };

        // Check if all environment variables are set
        if (!config.host || !config.port || !config.user || !config.password || !config.database) {
            throw new UserError('Database configuration is missing some environment variables.');
        }

        // Create a connection without specifying the database
        const connection = await mysql.createConnection({
            host: config.host,
            port: config.port,
            user: config.user,
            password: config.password
        });

        // Create the database if it does not exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`);

        // Close the connection
        await connection.end();

        // Create a new connection specifying the database
        sequelize = new Sequelize(config.database, config.user, config.password, { 
            dialect: 'mysql',
            logging: false // Disable logging if not needed
        });

        // Define and synchronize models
        db.User = require(path.resolve(__dirname, '../users/user.model'))(sequelize);
        db.UserActivity = require(path.resolve(__dirname, '../users/userActivity.model'))(sequelize);

        // Synchronize models
        await sequelize.sync({ alter: true });

        console.log('Database initialized and synchronized successfully.');
    } catch (error) {
        if (error instanceof UserError) {
            console.error('UserError:', error.message);
        } else {
            console.error('Database initialization error:', error.message);
        }
        throw error;
    }
}

// Initialize the database
initialize();