const { auth, storage } = require('../firebase'); // Adjust the path as necessary
const { createUserWithEmailAndPassword, updateProfile } = require('firebase/auth');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const User = require('../models/user');
const crypto = require('crypto');
const cloudinary = require('cloudinary');

exports.registerUser = async (req, res, next) => {
    try {
      const { name, email, password, phone, address, avatar } = req.body;
  
      // Register user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      console.log('Firebase user created:', firebaseUser);
  
      let photoURL = '';
      if (avatar) {
        // Convert base64 string to Buffer
        const buffer = Buffer.from(avatar, 'base64');
  
        // Upload photo to Firebase Storage
        const storageRef = ref(storage, `profile_photos/${firebaseUser.uid}`);
        const uploadResult = await uploadBytes(storageRef, buffer);
        photoURL = await getDownloadURL(uploadResult.ref);
        console.log('Photo uploaded to Firebase Storage:', photoURL);
      }
  
      // Update Firebase user profile
      await updateProfile(firebaseUser, {
        displayName: name,
        photoURL: photoURL
      });
      console.log('Firebase user profile updated:', firebaseUser);
  
      // Save user to your database
      const user = await User.create({
        name,
        email,
        password,
        phone,
        address,
        avatar: {
          public_id: firebaseUser.uid,
          url: photoURL
        },
      });
  
      res.status(201).json({
        success: true,
        user
      });
    } catch (error) {
      console.error('Error during user registration:', error.message);
      res.status(500).json({
        success: false,
        message: `User registration failed: ${error.message}`
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