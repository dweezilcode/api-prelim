<<<<<<< HEAD
const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
module.exports = db = {};
initialize();

async function initialize() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    // connect to db
    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });
    // init models and add them to the exported db object
    db.Account = require('../accounts/account.model')(sequelize);
    db.RefreshToken = require('../accounts/refresh-token.model')(sequelize);
    // define relationships
    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);
    // sync all models with database await sequelize.sync();
    await sequelize.sync();
}
=======
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
const config = require('../config.json');

const db = {}; // Object to hold the models
const sequelize = new Sequelize(config.database.database, config.database.user, config.database.password, { dialect: 'mysql' });

async function initialize() {
    const { host, port, database } = config.database;

    // Create database if it doesn't exist
    const connection = await mysql.createConnection({ host, port, user: config.database.user, password: config.database.password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // Initialize models
    db.User = require('../users/user.model')(sequelize);
    console.log('User model initialized:', db.User); // Log the User model
    db.Product = require('../products/product.model')(sequelize);
    db.Account = require('../accounts/account.model')(sequelize);
    db.RefreshToken = require('../accounts/refresh-token.model')(sequelize);   

    db.Inventory = require('../inventory/inventory.model')(sequelize);

    // Define model relationships
    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    db.Inventory.belongsTo(db.Product, { foreignKey: 'productId' });
    db.Product.hasMany(db.Inventory, { foreignKey: 'productId' });

    db.User.hasMany(db.Account, { foreignKey: 'userId' }); // Assuming there's a relationship

    // Sync all models with the database
    await sequelize.sync();

    // Log loaded models
    console.log('Loaded models:', db);
}

// Call the initialize function to set up the database connection and models
(async () => {
    await initialize();
})();

module.exports = { sequelize, db };
>>>>>>> 67bb0ddd1959aa525b3bb683796e01ece9c7f457
