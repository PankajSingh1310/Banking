const express = require('express');
const User = require('../models/User.model'); // Import the User model
const Transaction = require('../models/Transaction.model'); // Import the Transaction model
const bcrypt = require('bcrypt'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating JWT tokens


const registerUser = async (req, res) => {
    const { name, email, password, accountNumber, bankName, balance } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const newUser = {
            name,
            email,
            bankName,
            password: hashedPassword,
            accountNumber,
            balance
        }

        const user = await User.create(newUser); // Create a new user in the database
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Generate a JWT token
        
        res.cookie('token', token, { httpOnly: true }); 
        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, accountNumber: user.accountNumber, bankName: user.bankName } }); // Send the token and user info in the response

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Generate a JWT toke// Store the user in the request object for later use
        res.cookie('token', token, { httpOnly: true }); 
        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, accountNumber: user.accountNumber } }); // Send the token and user info in the response
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const getUserProfile = async (req, res) => {
    const userId = req.user.id; // Get user ID from the JWT token

    try {
        const user = await User.findById(userId).select('-password'); // Find the user and exclude the password field
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user); // Send the user info in the response
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const logoutUser = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true, // set to true if using HTTPS
        sameSite: 'None' // or 'Lax' depending on your setup
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

const historyUser = async (req, res) => {
    const userId = req.user.id; // Get user ID from the JWT token

    try {
        const user = await User.findById(userId).populate('transactions'); // Find the user and populate the transactions field
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.transactions.length === 0) {
            return res.status(404).json({ message: 'No transactions found' });
        }
        
        const receiverData = user.transactions.map(transaction => ({
            receiverId: transaction.receiver,
            amount: transaction.amount
        }));

        res.status(200).json(receiverData); // Send the transactions in the response4
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    logoutUser,
    historyUser
};