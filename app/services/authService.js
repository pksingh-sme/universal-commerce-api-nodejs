const jwt = require('jsonwebtoken');
const config = require('../../config/config');

function generateToken(user) {
    return jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: '1h' });
}

function authenticate(req, res, next) {
    // Get the token from the request headers or query parameters
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify the token
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // If token is valid, set user ID in request object
        req.userId = decoded.id;
        next();
    });
}

module.exports = {
    generateToken,
    authenticate,
};
