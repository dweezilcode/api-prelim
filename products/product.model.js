const { DataTypes } = require('sequelize');

<<<<<<< HEAD
module.exports = model;

function model(sequelize) {
    const attributes = {
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING, allowNull: false },
        price: { type: DataTypes.FLOAT, allowNull: false },
        status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'active' }, // Can be 'active' or 'deleted'
        stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
    };

    const options = {
        timestamps: true
    };

    return sequelize.define('Product', attributes, options);
}
=======
// Define the Product model
module.exports = (sequelize) => {
    return sequelize.define('Product', {
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING },
        price: { type: DataTypes.DECIMAL, allowNull: false },
        stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    });
};
>>>>>>> 67bb0ddd1959aa525b3bb683796e01ece9c7f457
