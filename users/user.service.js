const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const { UserError } = require('_helpers/errors');
const { Op } = require('sequelize');

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteUser,
    search,
    updateRole,
    grantPermissions,
    revokePermissions
};

// Fetch all users
async function getAll() {
    try {
        // Attempt to fetch all users that are not marked as deleted
        return await db.User.findAll({
            where: {
                isDeleted: false // Filter out soft-deleted users
            }
        });
    } catch (error) {
        // Log the error for debugging
        console.error('Error fetching users:', error.message || error);

        // Throw a more detailed error message
        throw new Error('Error fetching users. Please check the server logs for details.');
    }
}

// Fetch a user by ID
async function getById(id) {
    try {
        const user = await db.User.findByPk(id, {
            where: {
                isDeleted: false // Ensure you don't retrieve soft-deleted users
            }
        });

        if (!user) throw new UserError('User not found');
        return user;
    } catch (error) {
        console.error('Error in getById:', error);  // Log the error
        throw error;  // Rethrow the error to be caught by the controller
    }
}

// Create a new user
async function create(params) {
    if (await db.User.findOne({ where: { email: params.email } })) {
        throw new UserError(`Email "${params.email}" is already registered`);
    }

    try {
        await db.User.create({
            ...params,
            passwordHash: await bcrypt.hash(params.password, 10)
        });
    } catch (error) {
        throw new Error('Error creating user');
    }
}

// Update user details
async function update(id, params) {
    const user = await getById(id);

    if (params.email && user.email !== params.email) {
        const emailTaken = await db.User.findOne({ where: { email: params.email } });
        if (emailTaken) throw new UserError(`Email "${params.email}" is already registered`);
    }

    try {
        Object.assign(user, params);
        await user.save();
    } catch (error) {
        throw new Error('Error updating user');
    }
}

// Soft delete a user
async function deleteUser(id) {
    const user = await getById(id);

    try {
        user.isDeleted = true;
        await user.save();
    } catch (error) {
        throw new Error('Error deleting user');
    }
}

// Search users based on criteria
async function search(criteria, pagination) {
    const searchOptions = {
        where: {
            isDeleted: false
        }
    };

    if (criteria.email) searchOptions.where.email = { [Op.like]: `%${criteria.email}%` };
    if (criteria.name) searchOptions.where.firstName = { [Op.like]: `%${criteria.name}%` };

    // Handle pagination if provided
    if (pagination.page && pagination.limit) {
        searchOptions.limit = pagination.limit;
        searchOptions.offset = (pagination.page - 1) * pagination.limit;
    }

    try {
        return await db.User.findAll(searchOptions);
    } catch (error) {
        throw new Error('Error searching users');
    }
}

// Update user roles
async function updateRole(id, role) {
    const user = await getById(id);
    if (!['Admin', 'User'].includes(role)) throw new UserError('Invalid role');

    try {
        user.role = role;
        await user.save();
    } catch (error) {
        throw new Error('Error updating user role');
    }
}

// Grant Permissions
async function grantPermissions(id, permissions) {
    const user = await getById(id);

    if (!Array.isArray(permissions)) throw new UserError('Permissions must be an array');

    try {
        user.permissions = [...new Set([...user.permissions || [], ...permissions])];
        await user.save();
    } catch (error) {
        throw new Error('Error granting permissions');
    }
}

// Revoke Permissions
async function revokePermissions(id, permissions) {
    const user = await getById(id);

    if (!Array.isArray(permissions)) throw new UserError('Permissions must be an array');

    try {
        user.permissions = user.permissions?.filter(p => !permissions.includes(p)) || [];
        await user.save();
    } catch (error) {
        throw new Error('Error revoking permissions');
    }
}