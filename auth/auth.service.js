const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db'); 
const User = db.User;

async function login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        throw new Error('Invalid password');
    }

    const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token, user: { id: user.id, email: user.email, role: user.role } };
}

function logout() {
    // Handle logout (typically no server-side action needed for JWT)
    return { message: 'Logged out successfully' };
}

module.exports = { login, logout };
