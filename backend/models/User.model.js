  const mongoose = require('mongoose');

// Step 1: Define the schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // must be provided
  },
  email: {
    type: String,
    required: true,
    unique: true, // no two users can have the same email
  },
  password: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true,
  },
  bankName: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0, // starts with zero balance
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction', // reference to the Transaction model
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now, // auto-set current date/time
  }
});

// Step 2: Create and export the model
const User = mongoose.model('User', userSchema);
module.exports = User;
