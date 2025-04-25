const User = require('../models/User.model'); // Import the User model
const jwt = require('jsonwebtoken'); // For generating JWT tokens

const verifyToken = (req, res, next) => {
    const token = req.cookies.token; // Get the token from cookies

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' }); // No token provided
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' }); // Invalid token
        }
        req.user = decoded; // Store the decoded user info in the request object
        next(); // Proceed to the next middleware or route handler
    });
}

module.exports = verifyToken; // Export the middleware function for use in other files