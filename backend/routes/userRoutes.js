const express = require('express');
const router = express.Router();
const User = require('../models/User.model'); // Import the User model
const userController = require('../controllers/userController'); // Import the user controller
const verifyToken = require('../middlewares/userAuth'); // Import the authentication middleware

router.get('/register', userController.registerUser); // Route for user registration
router.get('/login', userController.loginUser); // Route for user login 
router.get('/logout', userController.logoutUser); // Route for user logout
router.get('/getUser', verifyToken, userController.getUserProfile); // Route to get user details
router.get('/history', verifyToken, userController.historyUser); // Route to update user details

module.exports = router; // Export the router for use in other files