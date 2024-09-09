const { Op } = require('sequelize');
const db = require('_helpers/db');
const bcrypt = require('bcryptjs');

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

    
    if (!params.status) {
        throw 'Status is required';
    }

    if (!params.dateCreated) {
        params.dateCreated = new Date(); 
    }

    
    const user = new db.User({
        email: params.email,
        title: params.title,
        firstName: params.firstName,
        lastName: params.lastName,
        role: params.role,
        status: params.status,
        dateCreated: params.dateCreated, 
        dateLastLoggedIn: params.dateLastLoggedIn, 
        passwordHash: await bcrypt.hash(params.password, 10)
    });

    
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
        where.email = {
            [Op.like]: `%${params.email}%`
        };
    }

    if (params.role) {
        where.role = params.role;
    }

    if (params.status) {
        where.status = params.status;
    }

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

    return await db.User.findAndCountAll({ where });
}
