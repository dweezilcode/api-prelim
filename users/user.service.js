const { User } = require('../models/user.model'); // Adjust the path according to your project structure

class ServiceError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ServiceError';
    }
}

class UserService {
    async register(userData) {
        try {
            const existingUser = await User.findOne({ where: { username: userData.username } });
            if (existingUser) {
                throw new ServiceError('User already exists');
            }

            const newUser = await User.create(userData);
            return newUser;
        } catch (error) {
            if (error instanceof ServiceError) {
                throw error; 
            }
            throw new ServiceError('Error during user existence check');
        }
    }

    async authenticate({ username, password }) {
        try {
            const user = await User.findOne({ where: { username } });
            if (!user) {
                throw new ServiceError('User not found');
            }

            const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
            if (!isPasswordValid) {
                throw new ServiceError('Invalid password');
            }

            return user; 
        } catch (error) {
            if (error instanceof ServiceError) {
                throw error; 
            }
            throw new ServiceError('Error during authentication');
        }
    }
}

module.exports = new UserService();
