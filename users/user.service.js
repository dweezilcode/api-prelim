const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const db = require('../_helpers/db');
const logger = require('../_middleware/logger');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    search,
    getPreferences,
    updatePreferences,
    authenticate
};

// Retrieve all users
async function getAll() {
    const users = await db.User.findAll();
    logger.info(`Retrieved ${users.length} users`);
    return users;
}

// Retrieve a user by ID
async function getById(id) {
    return await getUser(id);
}

// Create a new user
async function create(params) {
    // Check for existing user by email
    if (await db.User.findOne({ where: { email: params.email } })) {
        logger.warn(`Attempt to register with existing email: ${params.email}`);
        throw 'Email "' + params.email + '" is already registered';
    }

    // Check for status
    if (!params.status) {
        throw 'Status is required';
    }

    // Add creation date if not provided
    if (!params.dateCreated) {
        params.dateCreated = new Date();
    }

    // Hash password if provided
    if (params.password) {
        params.passwordHash = await bcrypt.hash(params.password, 10);
        delete params.password; // Remove plain password from params
    }

    params.username = params.username || null;

    // Create and return new user
    const user = await db.User.create(params);
    logger.info(`User created: ID ${user.id}, Email: ${params.email}`);
    return user;
}

// Update user information
async function update(id, params) {
    const user = await getUser(id);

    // Check for username change and availability
    const usernameChanged = params.username && user.username !== params.username;
    if (usernameChanged && await db.User.findOne({ where: { username: params.username } })) {
        logger.warn(`Attempt to update to existing username: ${params.username}`);
        throw 'Username "' + params.username + '" is already taken';
    }

    // Assign new values to user object
    Object.assign(user, params);

    // Hash new password if provided
    if (params.password) {
        user.passwordHash = await bcrypt.hash(params.password, 10);
    }

    // Save updated user
    await user.save();
    logger.info(`User updated: ID ${user.id}`);
    return user;
}

// Delete a user by ID
async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
    logger.info(`User deleted: ID ${user.id}`);
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
    
    // Full name search
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

    // Other filters...
    if (params.email) {
        where.email = {
            [Op.like]: `%${params.email}%`
        };
    }
    if (params.role) where.role = params.role;
    if (params.status) where.status = params.status;
    if (params.dateCreatedStart && params.dateCreatedEnd) {
        where.dateCreated = {
            [Op.between]: [params.dateCreatedStart, params.dateCreatedEnd]
        };
    }
    if (params.dateLastLoggedInStart && params.dateLastLoggedInEnd) {
        where.dateLastLoggedIn = {
            [Op.between]: [params.dateLastLoggedInStart, params.dateLastLoggedInEnd]
        };
    }

    const result = await db.User.findAndCountAll({ where });
    logger.info(`Found ${result.count} users matching search criteria`);
    return result;
}

// Retrieve user preferences
async function getPreferences(id) {
    const user = await getUser(id);
    return {
        themeColor: user.themeColor || 'default',
        emailNotifications: user.emailNotifications || false,
        language: user.language || 'en'
    };
}

// Update user preferences
async function updatePreferences(id, params) {
    const user = await getUser(id);

    if (params.themeColor !== undefined) user.themeColor = params.themeColor;
    if (params.emailNotifications !== undefined) user.emailNotifications = params.emailNotifications;
    if (params.language !== undefined) user.language = params.language;

    await user.save();
    logger.info(`Preferences updated for User ID ${user.id}`);
    return { message: 'Preferences updated successfully' };
}

// In user.service.js

// Authenticate user
async function authenticate({ email, password }) {
    const user = await db.User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        logger.warn(`Failed authentication attempt for email: ${email}`);
        throw 'Invalid credentials';
    }
    logger.info(`User authenticated: ID ${user.id}, Email: ${user.email}`);
    return { id: user.id, email: user.email }; // Return user info without the password hash
}

