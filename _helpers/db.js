const config = require('config.json'); // Ensure the correct path to the config file
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

const db = {};

initialize();

async function initialize() {
    try {
        // Destructure database connection info from your config
        const { host, port, user, password, database } = config.database;

        // Create MySQL connection to check if the database exists, and create it if not
        const connection = await mysql.createConnection({ host, port, user, password });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        await connection.end(); // Close the connection after checking/creating the database

        // Initialize Sequelize with the MySQL database connection
        const sequelize = new Sequelize(database, user, password, {
            dialect: 'mysql',
            logging: false, // Set to true if you want SQL queries logged for debugging
        });

        // Add models to the db object
        db.sequelize = sequelize;
        db.User = require('../users/user.model')(sequelize); // Ensure the correct path to the user model
        db.Activity = require('../activity/activity.model')(sequelize); // Activity model
        db.Product = require('../products/product.model')(sequelize); // Product model

        // Sync all models with the database
        await sequelize.sync({ alter: true });
        console.log('Database initialized and synchronized successfully.');
    } catch (error) {
        console.error('Database initialization error:', error.message);
        throw error;
    }
}

module.exports = db;