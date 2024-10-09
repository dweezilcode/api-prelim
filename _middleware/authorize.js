const jwt = require('express-jwt');
const { secret } = require('config.json');
const db = require('_helpers/db');

function authorize(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles]; // Ensure roles is an array
    }

    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt({ secret, algorithms: ['HS256'] }),

        async (req, res, next) => {
            // Check roles directly from req.user
            if (!req.user || (roles.length && !roles.includes(req.user.role))) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            // Account validation using DB
            const account = await db.Account.findByPk(req.user.id);
            if (!account || (roles.length && !roles.includes(account.role))) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // Add refresh token functionality
            req.user.role = account.role;
            const refreshTokens = await account.getRefreshTokens();
            req.user.ownsToken = token => !!refreshTokens.find(x => x.token === token);

            next();
        }
    ];
}

module.exports = authorize; // Ensure this is at the end
