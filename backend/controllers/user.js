const User = require('../models/user');

// Get all users
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        console.log(users);
        res.status(200).json({
            success: true,
            users,
            totalUsers: users.length
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users'
        });
    }
};