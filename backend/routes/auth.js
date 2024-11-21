const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");
const { registerUser, loginUser, updateUserProfile} = require('../controllers/auth');
const {isAuthenticatedUser} = require('../middlewares/auth');

router.post('/register', upload.single('avatar'), registerUser);
router.post('/login', loginUser);
router.route('/profile/update').put(isAuthenticatedUser, updateUserProfile);
module.exports = router;