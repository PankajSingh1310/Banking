const dotenv = require('dotenv');
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // For parsing cookies
const userRoutes = require('./routes/userRoutes'); // Import user routes

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(cookieParser());

dotenv.config();


app.use(express.json()); // Middleware to parse JSON requests
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded requests    

app.use("/api/users", userRoutes); // Use user routes for all requests starting with /api/users

// Basic route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Connect to DB and then start the server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
    }
};

startServer();


