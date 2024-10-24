const express = require('express'); // Import the Express framework
const app = express(); // Create an instance of an Express application
const bodyParser = require('body-parser'); // Import body-parser middleware

// Middleware to parse JSON request bodies
app.use(bodyParser.json()); // Use body-parser to parse JSON formatted request bodies

// User class to store name and random number
class User {
  constructor(name) {
    this.name = name; // Assign the provided name to the user
    this.randomNumber = Math.floor(Math.random() * 100) + 1; // Generate a random number between 1 and 100
  }
}

// Store user objects in a list
let users = []; // Initialize an empty array to hold user objects

// Serve static files from the 'public' folder
app.use(express.static('public')); // Serve static files such as HTML, CSS, and JavaScript from the 'public' directory

// Route to add a new user
app.post('/add-user', (req, res) => {
  const userName = req.body.name; // Extract the user's name from the request body
  const newUser = new User(userName); // Create a new User object
  users.push(newUser); // Add the new user to the users array
  res.json(users);  // Return the updated user list as a JSON response
});

// Route to remove a user
app.post('/remove-user', (req, res) => {
  const userName = req.body.name; // Extract the user's name from the request body
  users = users.filter(user => user.name !== userName); // Filter out the user from the users array
  res.json(users);  // Return the updated user list as a JSON response
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server running on port 3000'); // Log a message indicating the server is running
});
