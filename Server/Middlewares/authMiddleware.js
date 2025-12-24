// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//     const token = req.headers['authorization']?.split(' ')[1]; // Extract token from the Authorization header

//     if (!token) {
//         return res.status(401).json({ message: 'No token provided. Unauthorized!' });
//     }

//     jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
//         if (err) {
//             return res.status(403).json({ message: 'Failed to authenticate token.' });
//         }

//         // Save user ID or any other user information to the request object
//         req.user = { id: decoded.id, email: decoded.email };
//         next(); // Call the next middleware or route handler
//     });
// };

// module.exports = authMiddleware;
