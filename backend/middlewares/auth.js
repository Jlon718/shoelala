const User = require('../models/user')
const jwt = require("jsonwebtoken")

exports.isAuthenticatedUser = async (req, res, next) => {
    
    const token  = req.header('Authorization').split(' ')[1];

    // const { token } = req.cookies
    console.log("authenticated: ", token)
    if (!token) {
        return res.status(401).json({message:'Login first to access this resource'})
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id);
    
    next()
};

// const jwt = require('jsonwebtoken');
// const User = require('../models/user');

// exports.isAuthenticatedUser = async (req, res, next) => {
//     const { authorization } = req.headers;

//     if (!authorization || !authorization.startsWith('Bearer')) {
//         return res.status(401).json({ message: 'Unauthorized access' });
//     }

//     const token = authorization.split(' ')[1];

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = await User.findById(decoded.id);
//         next();
//     } catch (error) {
//         res.status(401).json({ message: 'Invalid or expired token' });
//     }
// };

exports.authorizeRoles = (...roles) => {
	
    return (req, res, next) => {
        // console.log(roles, req.user, req.body);
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({message:`Role (${req.user.role}) is not allowed to acccess this resource`})
          
        }
        next()
    }
}