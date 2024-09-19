const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    search,
    getPreferences,
    updatePreferences
};

// Retrieve all users
async function getAll() {
    return await db.User.findAll();
}

// Retrieve a user by ID
async function getById(id) {
    return await getUser(id);
}

// Create a new user
async function create(params) {
    // Check if email already exists
    if (await db.User.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already registered';
    }

    // Set default creation date if not provided
    if (!params.dateCreated) {
        params.dateCreated = new Date();
    }

    // Hash the password if provided
    if (params.password) {
        params.passwordHash = await bcrypt.hash(params.password, 10);
        delete params.password; // Remove plain password from params
    }

    const user = await db.User.create(params);
    return user;
}

// Update user information
async function update(id, params) {
    const user = await getUser(id);

    // Check if username is changing and if it's already taken
    if (params.username && user.username !== params.username) {
        if (await db.User.findOne({ where: { username: params.username } })) {
            throw 'Username "' + params.username + '" is already taken';
        }
    }

    // Merge changes
    Object.assign(user, params);

    // Hash the password if it's being updated
    if (params.password) {
        user.passwordHash = await bcrypt.hash(params.password, 10);
    }

    await user.save();
    return user;
}

// Delete a user by ID
async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
    return { message: 'User deleted successfully' };
}

// Retrieve a user by ID (helper function)
async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}

// Search users with filtering criteria
async function search(params) {
    const where = {};

    if (params.fullName) {
        const fullName = params.fullName.toLowerCase();
        where[Op.and] = [
            db.sequelize.where(
                db.sequelize.fn('concat', db.sequelize.col('title'), ' ', db.sequelize.col('firstName'), ' ', db.sequelize.col('lastName')),
                {
                    [Op.like]: `%${fullName}%`
                }
            )
        ];
    }
    
    if (params.email) {
        where.email = { [Op.like]: `%${params.email}%` };
    }

    if (params.role) {
        where.role = params.role;
    }

    if (params.status) {
        where.status = params.status;
    }

    if (params.dateCreatedStart && params.dateCreatedEnd) {
        where.dateCreated = { [Op.between]: [params.dateCreatedStart, params.dateCreatedEnd] };
    }

    if (params.dateLastLoggedInStart && params.dateLastLoggedInEnd) {
        where.dateLastLoggedIn = { [Op.between]: [params.dateLastLoggedInStart, params.dateLastLoggedInEnd] };
    }

    return await db.User.findAndCountAll({ where });
}

// Retrieve user preferences
async function getPreferences(id) {
    const user = await getById(id);
    return {
        themeColor: user.themeColor,
        emailNotifications: user.emailNotifications,
        language: user.language
    };
}

// Update user preferences
async function updatePreferences(id, params) {
    const user = await getById(id);

    // Update preferences if provided
    if (params.themeColor !== undefined) user.themeColor = params.themeColor;
    if (params.emailNotifications !== undefined) user.emailNotifications = params.emailNotifications;
    if (params.language !== undefined) user.language = params.language;

    await user.save();
    return { message: 'Preferences updated successfully' };
}