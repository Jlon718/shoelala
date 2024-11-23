const jwt = require('jsonwebtoken');
const User = require('../models/user');

<<<<<<< Updated upstream
// exports.isAuthenticatedUser = async (req, res, next) => {
    
//     const token  = req.header('Authorization').split(' ')[1];


//     if (!token) {
//         return res.status(401).json({message:'Login first to access this resource'})
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET)
//     req.user = await User.findById(decoded.id);
    
//     next()
// };

exports.isAuthenticatedUser = async (req, res, next) => {
    const { authorization } = req.headers;
  
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "Please login to access this resource"
      });
    }
  
    const token = authorization.split('Bearer ')[1];
  
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }
  };
=======
// Check if user is authenticated
exports.isAuthenticatedUser = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Login first to access this resource.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token.'
        });
    }
};
>>>>>>> Stashed changes

// Handling users roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role (${req.user.role}) is not allowed to access this resource`
            });
        }
        next();
    };
};