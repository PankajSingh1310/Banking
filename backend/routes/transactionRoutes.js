const express = require('express');
const router = express.Router();
const {payment} = require('../controllers/transactionController'); // Import the transaction controller

router.get('/payment', payment); // Route for creating a transaction

module.exports = router; // Export the router for use in other files