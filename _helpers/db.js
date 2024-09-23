const config = require('../config.json'); // Adjust path as needed
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
const logger = require('../_middleware/logger');

const db = {};

initialize();

async function initialize() {
    try {
        // Destructure database connection info from your config
        const { host, port, user, password, database } = config.database;

        // Create MySQL connection to check if the database exists, and create it if not
        console.log('Connecting to MySQL...');
        const connection = await mysql.createConnection({ host, port, user, password });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        await connection.end(); // Close the connection after checking/creating the database
        console.log(`Database "${database}" ensured to exist or created.`);

        // Initialize Sequelize with the MySQL database connection
        console.log('Initializing Sequelize...');
        const sequelize = new Sequelize(database, user, password, {
            dialect: 'mysql',
            logging: (msg) => logger.info(msg), // Use logger for Sequelize logging
        });

        // Test the database connection
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Add models to the db object
        db.sequelize = sequelize;

        // Load models
        await loadModels();

        // Sync all models with the database
        console.log('Syncing models...');
        await sequelize.sync({ alter: true });
        logger.info('Database initialized and models synchronized successfully.');
    } catch (error) {
        logger.error('Database initialization error:', error.message);
        console.error('Full error:', error); // Log the complete error for debugging
        throw error; // Rethrow the error after logging it
    }
}

// Load models in a separate function for clarity
async function loadModels() {
    try {
        console.log('Loading models...');
        
        db.User = require('../users/user.model')(db.sequelize);
        console.log('User model loaded.');

        db.Activity = require('../users/activity.model')(db.sequelize);
        console.log('Activity model loaded.');

        db.Product = require('../products/product.model')(db.sequelize);
        console.log('Product model loaded.');

        db.Inventory = require('../inventory/inventory.model')(db.sequelize);
        console.log('Inventory model loaded.');

        // Add any other models as needed
    } catch (error) {
        logger.error('Model loading error:', error.message);
        console.error('Full error:', error); // Log the complete error for debugging
        throw error; // Rethrow to handle in the initialize function
    }
}

module.exports = db;
