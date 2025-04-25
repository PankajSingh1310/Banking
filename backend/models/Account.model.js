const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    username: { type: String, required: true },
    bankname: { type: String, required: true, unique: true },
    branch:    { type: String, required: true, unique: true },
    ifsccode: { type: String, required: true },
    user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

const Account = mongoose.model('Account', accountSchema);
module.exports = Account;