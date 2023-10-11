// Import necessary modules
const app = require('./server'); // Import the Express app instance
const mongoose = require('mongoose'); // Import Mongoose for MongoDB operations

// Connect to the MongoDB database using the connection string from environment variables
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true, // Use the new URL parser to avoid deprecation warnings
    useUnifiedTopology: true, // Use the unified topology for Mongoose connections
  })
  .then(() => console.log('Connected to MongoDB')) // Log a success message upon successful connection
  .catch((error) => console.error('MongoDB connection error:', error)); // Log any errors that occur during connection

// Set the port for the server to listen on. Use the port from environment variables or default to 3000
const PORT = process.env.PORT || 3000;

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
