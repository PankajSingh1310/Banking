const User = require('../models/User.model'); // Import the User model
const Transaction = require('../models/Transaction.model'); // Import the Transaction model

const TransactionController = {
    async createTransaction(req, res) {
        try {
            const { sender, reciever, amount } = req.body; // Extract sender, reciever, and amount from request body

            // Validate the input data
            if (!sender || !reciever || !amount) {
                return res.status(400).json({ message: 'Sender, reciever and amount are required' });
            }

            // Find the sender and reciever users in the database
            const senderUser = await User.findById(sender);
            const recieverUser = await User.findById(reciever);

            if (!senderUser || !recieverUser) {
                return res.status(404).json({ message: 'Sender or reciever not found' });
            }

            // Create a new transaction record
            const transaction = new Transaction({
                sender: senderUser._id,
                reciever: recieverUser._id,
                amount: amount,
            });

            await transaction.save(); // Save the transaction to the database

            return res.status(201).json({ message: 'Transaction created successfully', transaction });
        } catch (error) {
            console.error(error); // Log the error for debugging
            return res.status(500).json({ message: 'Internal server error' }); // Handle server errors
        }
    }, 
}