const bcrypt = require('bcryptjs');
const db = require('_helpers/db'); // Ensure this path is correct

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getPreferences,
    updatePreferences
};

// Retrieve all users
async function getAll() {
    return await db.User.findAll();
}

// Retrieve a user by ID
async function getById(id) {
    return await db.User.findByPk(id);
}

// Create a new user
async function create(params) {
    // Optionally hash the password before saving, if you include password in params
    if (params.password) {
        params.passwordHash = await bcrypt.hash(params.password, 10);
        delete params.password; // Remove plain password from params
    }
    const user = await db.User.create(params);
    return user;
}

// Update user information
async function update(id, params) {
    const user = await getById(id);
    if (!user) throw new Error('User not found');
    
    // Only update fields that are provided
    Object.assign(user, params);
    
    // Optionally hash the new password if provided
    if (params.password) {
        user.passwordHash = await bcrypt.hash(params.password, 10);
    }
    
    await user.save();
    return user;
}

// Delete a user by ID
async function _delete(id) {
    const user = await getById(id);
    if (!user) throw new Error('User not found');
    await user.destroy();
    return { message: 'User deleted successfully' };
}

// Retrieve user preferences
async function getPreferences(id) {
    try {
        const user = await getById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return {
            themeColor: user.themeColor,
            emailNotifications: user.emailNotifications,
            language: user.language
        };
    } catch (error) {
        throw new Error(`Error retrieving user preferences: ${error.message}`);
    }
}

// Update user preferences
async function updatePreferences(id, params) {
    try {
        const user = await getById(id);
        if (!user) {
            throw new Error('User not found');
        }

        // Update only the fields provided
        if (params.themeColor !== undefined) user.themeColor = params.themeColor;
        if (params.emailNotifications !== undefined) user.emailNotifications = params.emailNotifications;
        if (params.language !== undefined) user.language = params.language;

        await user.save();
        return { message: 'Preferences updated successfully' };
    } catch (error) {
        throw new Error(`Error updating user preferences: ${error.message}`);
    }
}
