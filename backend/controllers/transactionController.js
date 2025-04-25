const User = require('../models/User.model'); // Import the User model
const Transaction = require('../models/Transaction.model'); // Import the Transaction model

const payment = async (req, res) => {
    try {
        const { sender, receiver, amount } = req.body;

        // Validate the input data
        if (!sender || !receiver || !amount) {
            return res.status(400).json({ message: 'Sender, receiver and amount are required' });
        }

        // Find users
        const senderUser = await User.findById(sender);
        const receiverUser = await User.findById(receiver);

        if (!senderUser || !receiverUser) {
            return res.status(404).json({ message: 'Sender or receiver not found' });
        }

        if (senderUser._id.equals(receiverUser._id)) {
            return res.status(400).json({ message: 'Sender and receiver cannot be the same' });
        }

        if (senderUser.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Transaction document
        const transaction = new Transaction({
            sender: senderUser._id,
            receiver: receiverUser._id,
            amount: amount
        });

        // Update balances
        senderUser.balance -= amount;
        receiverUser.balance += amount;

        // Save all
        await senderUser.save();
        await receiverUser.save();
        await transaction.save();

        return res.status(201).json({ message: 'Transaction completed successfully', transaction });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {payment}; // Export the TransactionController object for use in other files