const { DataTypes } = require('sequelize');

<<<<<<< HEAD
module.exports = model;

function model(sequelize) {
    const attributes = {
        token: {type: DataTypes.STRING },
        expires: { type: DataTypes.DATE },
        created: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        createdByIp: { type: DataTypes.STRING },
        revoked: { type: DataTypes.DATE },
        revokedByIp: {type: DataTypes.STRING },
=======
module.exports = (sequelize) => {
    const attributes = {
        token: { type: DataTypes.STRING },
        expires: { type: DataTypes.DATE },
        created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        createdByIp: { type: DataTypes.STRING },
        revoked: { type: DataTypes.DATE },
        revokedByIp: { type: DataTypes.STRING },
>>>>>>> 67bb0ddd1959aa525b3bb683796e01ece9c7f457
        replacedByToken: { type: DataTypes.STRING },
        isExpired: {
            type: DataTypes.VIRTUAL,
            get() { return Date.now() >= this.expires; }
        },
        isActive: {
            type: DataTypes.VIRTUAL,
            get() { return !this.revoked && !this.isExpired; }
        }
    };

    const options = {
<<<<<<< HEAD
        // disable default timestamp fields (createdAt and updatedAt)
        timestamps: false
    };

    return sequelize.define('refreshToken', attributes, options);
}
=======
        timestamps: false
    };

    return sequelize.define('RefreshToken', attributes, options); // Changed to 'RefreshToken' for consistency
};
>>>>>>> 67bb0ddd1959aa525b3bb683796e01ece9c7f457
