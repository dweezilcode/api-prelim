// db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('product', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',   

    logging: console.log, // Enable logging to see SQL queries
});

module.exports = sequelize;