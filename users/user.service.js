const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const { Op } = require('sequelize');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    search
};

async function getAll() {
    return await db.User.findAll();
}

async function getById(id) {
    return await getUser(id);
}

async function create(params) {
    if (await db.User.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already registered';
    }

    const user = new db.User(params);

    user.passwordHash = await bcrypt.hash(params.password, 10);

    await user.save();
}

async function update(id, params) {
    const user = await getUser(id);

    const usernameChanged = params.username && user.username !== params.username;
    if (usernameChanged && await db.User.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }

    Object.assign(user, params);
    await user.save();
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}

async function search(params) {
    const { fullName, email, role, status, dateCreated, dateLastLoggedIn } = params;

    const where = {};

    if (fullName) {
        const [firstName, lastName] = fullName.split(' ');
        if (firstName) where.firstName = firstName;
        if (lastName) where.lastName = lastName;
    }
    if (email) where.email = email;
    if (role) where.role = role;
    if (status) where.status = status;
    if (dateCreated) where.dateCreated = { [Op.gte]: new Date(dateCreated) };
    if (dateLastLoggedIn) where.dateLastLoggedIn = { [Op.gte]: new Date(dateLastLoggedIn) };

    return await db.User.findAll({ where });
}

