const User = require('../models/user');
//const sendToken = require('../utils/jwtToken');
// const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto');
const cloudinary = require('cloudinary');

exports.registerUser = async (req, res, next) => {
    try {
        let result = { public_id: '', secure_url: '' };

        if (req.body.avatar) {
            result = await cloudinary.v2.uploader.upload(req.body.avatar, {
                folder: 'avatars',
                width: 150,
                crop: "scale"
            });
        }

        const { name, email, password, phone, address } = req.body;
        const user = await User.create({
            name,
            email,
            password,
            phone,
            address,
            avatar: {
                public_id: result.public_id,
                url: result.secure_url
            },
        });

        res.status(201).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({
            success: false,
            message: 'User registration failed'
        });
    }
};

exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    // Checks if email and password is entered by user
    if (!email || !password) {
        return res.status(400).json({ error: 'Please enter email & password' });
    }

    // Finding user in database
    let user = await User.findOne({ email }).select('+password');
    if (!user) {
        return res.status(401).json({ message: 'Invalid Email or Password' });
    }

    // Checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return res.status(401).json({ message: 'Invalid Email or Password' });
    }

    // Generate JWT token
    const token = user.getJwtToken();

    // Remove password from user object before sending response
    user.password = undefined;

    return res.status(201).json({
        success: true,
        token,
        user
    });
};