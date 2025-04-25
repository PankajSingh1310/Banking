const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    reciever: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    balance: {
        type: Number,
        default: 0, // starts with zero balance
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;